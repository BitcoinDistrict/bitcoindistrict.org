-- Migration: Create Book Club Tables and Functions
-- Created: 2024-12-20
-- Description: Creates tables, indexes, RLS policies, and functions for the book club feature

-- Enable RLS
alter database postgres set row_security = on;

-- Create Books table
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  author varchar(255) not null,
  description text,
  image_url varchar(500),
  buy_url varchar(500),
  reading_date date,
  is_deleted boolean not null default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create Polls table  
create table if not exists public.polls (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  expiration_date timestamp with time zone not null,
  include_read_books boolean not null default false,
  is_active boolean not null default true,
  created_at timestamp with time zone default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- Create Poll_Options table (junction table)
create table if not exists public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(poll_id, book_id)
);

-- Create Votes table
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(poll_id, user_id)
);

-- Create user_roles table for admin access
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role varchar(50) not null,
  created_at timestamp with time zone default now(),
  unique(user_id, role)
);

-- Create indexes for performance
create index if not exists idx_books_title on public.books(title);
create index if not exists idx_books_reading_date on public.books(reading_date);
create index if not exists idx_books_is_deleted on public.books(is_deleted);
create index if not exists idx_polls_expiration_date on public.polls(expiration_date);
create index if not exists idx_polls_is_active on public.polls(is_active);
create index if not exists idx_poll_options_poll_id on public.poll_options(poll_id);
create index if not exists idx_poll_options_book_id on public.poll_options(book_id);
create index if not exists idx_votes_poll_id on public.votes(poll_id);
create index if not exists idx_votes_user_id on public.votes(user_id);
create index if not exists idx_user_roles_user_id on public.user_roles(user_id);
create index if not exists idx_user_roles_role on public.user_roles(role);

-- Create trigger function to update updated_at timestamp
create or replace function public.update_updated_at_column()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create trigger for books table
create trigger trigger_update_books_updated_at
  before update on public.books
  for each row
  execute function public.update_updated_at_column();

-- Function to check if user is book club admin
create or replace function public.is_book_club_admin(check_user_id uuid default null)
  returns boolean
  language sql
  security definer
  set search_path = ''
as $$
  select exists(
    select 1 
    from public.user_roles 
    where user_id = coalesce(check_user_id, (select auth.uid())) 
    and role = 'book_club_admin'
  );
$$;

-- Function to get active polls
create or replace function public.get_active_polls()
  returns table(
    id uuid,
    title varchar(255),
    expiration_date timestamp with time zone,
    include_read_books boolean,
    created_at timestamp with time zone,
    created_by uuid
  )
  language sql
  security definer
  set search_path = ''
as $$
  select p.id, p.title, p.expiration_date, p.include_read_books, p.created_at, p.created_by
  from public.polls p
  where p.is_active = true 
  and p.expiration_date > now()
  order by p.expiration_date asc;
$$;

-- Function to get poll results (for admins)
create or replace function public.get_poll_results(poll_id_param uuid)
  returns table(
    book_id uuid,
    book_title varchar(255),
    book_author varchar(255),
    vote_count bigint
  )
  language sql
  security definer
  set search_path = ''
as $$
  select 
    b.id,
    b.title,
    b.author,
    count(v.id) as vote_count
  from public.poll_options po
  inner join public.books b on po.book_id = b.id
  left join public.votes v on v.poll_id = po.poll_id and v.book_id = b.id
  where po.poll_id = poll_id_param
  group by b.id, b.title, b.author
  order by vote_count desc, b.title;
$$;

-- Function to get poll results (public - aggregated only)
create or replace function public.get_poll_results_public(poll_id_param uuid)
  returns table(
    book_id uuid,
    book_title varchar(255),
    book_author varchar(255),
    book_image_url varchar(500),
    vote_count bigint
  )
  language sql
  set search_path = ''
as $$
  select 
    b.id,
    b.title,
    b.author,
    b.image_url,
    count(v.id) as vote_count
  from public.poll_options po
  inner join public.books b on po.book_id = b.id
  left join public.votes v on v.poll_id = po.poll_id and v.book_id = b.id
  where po.poll_id = poll_id_param
  group by b.id, b.title, b.author, b.image_url
  order by vote_count desc, b.title;
$$;

-- Function to cast a vote
create or replace function public.cast_vote(poll_id_param uuid, book_id_param uuid)
  returns json
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  current_user_id uuid;
  poll_expired boolean;
  poll_exists boolean;
  book_in_poll boolean;
  existing_vote_id uuid;
begin
  -- Get current user
  current_user_id := (select auth.uid());
  
  if current_user_id is null then
    return json_build_object('success', false, 'error', 'User not authenticated');
  end if;

  -- Check if poll exists and is not expired
  select 
    true,
    expiration_date < now()
  into poll_exists, poll_expired
  from public.polls 
  where id = poll_id_param and is_active = true;
  
  if not poll_exists then
    return json_build_object('success', false, 'error', 'Poll not found or inactive');
  end if;
  
  if poll_expired then
    return json_build_object('success', false, 'error', 'Poll has expired');
  end if;

  -- Check if book is in poll
  select exists(
    select 1 
    from public.poll_options 
    where poll_id = poll_id_param and book_id = book_id_param
  ) into book_in_poll;
  
  if not book_in_poll then
    return json_build_object('success', false, 'error', 'Book not available in this poll');
  end if;

  -- Check for existing vote
  select id into existing_vote_id
  from public.votes 
  where poll_id = poll_id_param and user_id = current_user_id;
  
  if existing_vote_id is not null then
    return json_build_object('success', false, 'error', 'You have already voted in this poll');
  end if;

  -- Cast the vote
  insert into public.votes (poll_id, book_id, user_id)
  values (poll_id_param, book_id_param, current_user_id);

  return json_build_object('success', true, 'message', 'Vote cast successfully');
end;
$$;

-- Enable RLS on all tables
alter table public.books enable row level security;
alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.votes enable row level security;
alter table public.user_roles enable row level security;

-- RLS Policies for Books table
create policy "Books are viewable by everyone" on public.books
  for select using (is_deleted = false);

create policy "Books can be managed by book club admins" on public.books
  for all using ((select public.is_book_club_admin()));

-- RLS Policies for Polls table  
create policy "Active polls are viewable by everyone" on public.polls
  for select using (is_active = true);

create policy "Polls can be managed by book club admins" on public.polls
  for all using ((select public.is_book_club_admin()));

-- RLS Policies for Poll_Options table
create policy "Poll options are viewable by everyone" on public.poll_options
  for select using (true);

create policy "Poll options can be managed by book club admins" on public.poll_options
  for all using ((select public.is_book_club_admin()));

-- RLS Policies for Votes table
create policy "Users can view their own votes" on public.votes
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert their own votes" on public.votes
  for insert with check ((select auth.uid()) = user_id);

create policy "Admins can view all votes" on public.votes
  for select using ((select public.is_book_club_admin()));

create policy "Admins can manage all votes" on public.votes
  for all using ((select public.is_book_club_admin()));

-- RLS Policies for User_Roles table
create policy "Users can view their own roles" on public.user_roles
  for select using ((select auth.uid()) = user_id);

create policy "Admins can manage all user roles" on public.user_roles
  for all using ((select public.is_book_club_admin()));

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to authenticated;
grant all on all sequences in schema public to authenticated;
grant execute on all functions in schema public to authenticated, anon; 