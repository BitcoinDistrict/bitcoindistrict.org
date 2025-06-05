// scripts/seedDevData.ts
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import 'dotenv/config';

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const NUM_USERS = 10;
const MAX_VOTES_PER_USER = 2;
const DEFAULT_PASSWORD = 'password123';

async function main() {
  // 1. Create fake users via Supabase Auth (if not already present)
  const { data: existingUsers, error: listUsersError } = await supabase.auth.admin.listUsers();
  if (listUsersError) throw listUsersError;

  const users = [...existingUsers.users];
  const emails = new Set(users.map(u => u.email));

  for (let i = users.length; i < NUM_USERS; i++) {
    let email;
    do {
      email = faker.internet.email().toLowerCase();
    } while (emails.has(email));
    emails.add(email);
    // Create user via Supabase Auth Admin API
    const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password: DEFAULT_PASSWORD,
      email_confirm: true,
      user_metadata: { name: faker.person.fullName() },
    });
    if (createUserError) throw createUserError;
    users.push(newUser.user);
  }
  console.log(`Seeded ${users.length} auth users.`);

  // 2. Fetch books and current poll
  const { data: books, error: booksError } = await supabase
    .from('books')
    .select('id, title');
  if (booksError) throw booksError;

  const { data: polls, error: pollsError } = await supabase
    .from('polls')
    .select('id, expiration_date')
    .order('expiration_date', { ascending: false })
    .limit(1);
  if (pollsError) throw pollsError;
  const poll = polls?.[0];
  if (!poll) throw new Error('No poll found.');

  // 3. Fetch poll options
  const { data: pollOptions, error: pollOptionsError } = await supabase
    .from('poll_options')
    .select('id, book_id')
    .eq('poll_id', poll.id);
  if (pollOptionsError) throw pollOptionsError;

  // 4. Generate random votes for each user
  let totalVotes = 0;
  for (const user of users) {
    // Each user votes for up to MAX_VOTES_PER_USER random books
    const shuffled = pollOptions.sort(() => 0.5 - Math.random());
    const votesFor = shuffled.slice(0, Math.floor(Math.random() * MAX_VOTES_PER_USER) + 1);
    for (const option of votesFor) {
      // Insert vote
      const { error: voteError } = await supabase
        .from('votes')
        .insert({ user_id: user.id, poll_option_id: option.id });
      if (voteError) {
        if (voteError.code === '23505') continue; // skip duplicate votes
        throw voteError;
      }
      totalVotes++;
    }
  }
  console.log(`Seeded ${totalVotes} votes for poll ${poll.id}.`);
  console.log('All fake users have password: password123');
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
}); 