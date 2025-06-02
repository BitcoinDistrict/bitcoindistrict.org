# Bitcoin District Book Club Feature Setup

This document provides setup instructions for the Bitcoin District Book Club feature implemented with Next.js 15 and Supabase.

## Overview

The book club feature includes:
- **Public Book Club Page** (`/bookclub`) - Displays all books with sortable table and active polls
- **Voting Page** (`/bookclub/vote`) - Authenticated users can vote in active polls
- **Admin Page** (`/bookclub/admin`) - Book club admins can manage books and polls

## Database Setup

### 1. Run Migrations

The database schema is created using Supabase migrations. Run the following commands:

```bash
# Navigate to your project directory
cd /path/to/your/project

# Run the migrations to create tables, functions, and policies
npx supabase db push

# Or if using Supabase CLI locally:
supabase db reset --linked
```

### 2. Verify Database Schema

After running migrations, your database should have the following tables:
- `books` - Stores book information
- `polls` - Stores voting polls
- `poll_options` - Junction table for poll-book relationships
- `votes` - Stores user votes
- `user_roles` - Stores user role assignments

### 3. Create Your First Admin User

Once you have the database set up, you need to create a book club admin:

1. Sign up for an account through your app's authentication flow
2. Get your user ID from the Supabase Auth dashboard
3. Run this SQL query in the Supabase SQL editor:

```sql
INSERT INTO public.user_roles (user_id, role) 
VALUES ('YOUR_USER_ID_HERE', 'book_club_admin');
```

Replace `YOUR_USER_ID_HERE` with your actual user ID from the `auth.users` table.

## Environment Variables

Ensure you have the following environment variables set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Feature Details

### Supabase Best Practices Implemented

This implementation follows Supabase best practices as specified in the project rules:

1. **Search Path Security**: All PostgreSQL functions explicitly set `search_path = ''` to prevent schema hijacking
2. **RLS Performance**: Auth functions like `auth.uid()` are wrapped in subqueries to avoid per-row execution
3. **Field Size Limits**: Character fields have appropriate size constraints to prevent abuse

### Database Functions

Several PostgreSQL functions are created to optimize performance and security:

- `is_book_club_admin()` - Checks if the current user is a book club admin
- `get_active_polls()` - Returns currently active polls
- `get_poll_results()` - Returns poll results for admins (with user attribution)
- `get_poll_results_public()` - Returns aggregated poll results for public view
- `cast_vote()` - Handles vote casting with validation

### Row Level Security (RLS)

RLS policies are implemented to ensure:
- Everyone can view books and active polls
- Only admins can manage books and polls
- Users can only view/insert their own votes
- Admins can view all votes for poll management

## Usage

### For Regular Users

1. **Browse Books**: Visit `/bookclub` to see all books, filter by read/unread status
2. **Vote in Polls**: If there's an active poll and you're signed in, click "Vote Now" to participate
3. **View Results**: See real-time poll results (aggregated) on the main page

### For Admins

1. **Access Admin Panel**: Visit `/bookclub/admin` (requires admin role)
2. **Manage Books**: Add, edit, or delete books from the collection
3. **Create Polls**: Set up new voting polls with customizable options
4. **Monitor Results**: View detailed poll results including individual vote counts

### Book Management

When adding books, you can specify:
- Title and Author (required)
- Description
- Cover image URL
- Purchase link (Amazon, etc.)
- Reading date (when the book was/will be discussed)

### Poll Management

When creating polls:
- Set a descriptive title
- Choose an expiration date/time
- Optionally include books that have already been read
- Select which books to include as options

## API Functions

The `/lib/bookClub.ts` file provides TypeScript functions for all database operations:

```typescript
// Book functions
getAllBooks()
getBooksRead()
getBooksToRead()
createBook(book)
updateBook(id, updates)
deleteBook(id)

// Poll functions
getActivePolls()
getAllPolls()
createPoll(poll)
addPollOptions(pollId, bookIds)
getPollResults(pollId)

// Voting functions
castVote(pollId, bookId)
getUserVote(pollId)

// Admin functions
isBookClubAdmin()
addBookClubAdmin(userId)
removeBookClubAdmin(userId)
```

## Security Features

- **Authentication Required**: Voting requires user authentication
- **Role-Based Access**: Admin functions require the `book_club_admin` role
- **Input Validation**: All inputs are validated both client and server-side
- **SQL Injection Prevention**: All queries use parameterized statements
- **CSRF Protection**: Supabase handles CSRF protection automatically

## Performance Optimizations

- **Efficient Queries**: Auth functions are cached using subqueries in RLS policies
- **Indexed Fields**: Key fields like `title`, `reading_date`, and `expiration_date` are indexed
- **Optimized Loading**: Parallel data fetching where possible
- **Client-Side Caching**: React state management for optimal user experience

## Troubleshooting

### Common Issues

1. **Migration Errors**: Ensure you have the latest Supabase CLI and your database is accessible
2. **Auth Issues**: Verify your environment variables are set correctly
3. **RLS Errors**: Check that your user has the correct roles assigned
4. **Function Errors**: Verify all PostgreSQL functions were created successfully

### Testing the Setup

1. Visit `/bookclub` - Should show books and any active polls
2. Sign in and visit `/bookclub/vote` - Should show voting interface if polls exist
3. As an admin, visit `/bookclub/admin` - Should show management interface

## Future Enhancements

Potential improvements to consider:
- Email notifications for new polls
- Book recommendations based on voting history
- Integration with reading schedule/calendar
- Book discussion threads
- Reading progress tracking

## Support

For issues related to the book club feature, check:
1. Supabase logs for database errors
2. Next.js console for client-side issues
3. Network tab for API call failures
4. Database permissions and RLS policies 