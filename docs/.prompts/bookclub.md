Bitcoin Book Club Feature for Next.js + Supabase Website
I want to enhance my Next.js (version 14) and Supabase website with a dynamic book club feature to replace the static page at https://bitcoindistrict.org/bookclub/. The current page uses a static file to list books we’ve read and suggested, with voting handled via Google Forms and events posted on Meetup.org. The new feature will store book data in Supabase, enable authenticated voting, and provide an admin interface for managing books and polls. The UI should match the existing site’s style, using Tailwind CSS for responsive design.
Database Schema
Design a normalized set of PostgreSQL tables in Supabase to store book club data, including SQL queries for table creation. Include the following:
Tables and Fields

Books:

id: UUID (primary key, auto-generated)
title: VARCHAR(255) (NOT NULL, required)
author: VARCHAR(255) (NOT NULL, required, supports multiple authors as a comma-separated string)
description: TEXT (optional, for book summary)
image_url: VARCHAR(255) (optional, for book cover image URL)
buy_url: VARCHAR(255) (optional, for Amazon or other purchase link)
reading_date: DATE (nullable, represents the book club meeting date; NULL for books not yet scheduled)
created_at: TIMESTAMP (default CURRENT_TIMESTAMP)
updated_at: TIMESTAMP (default CURRENT_TIMESTAMP, updated on changes)


Polls:

id: UUID (primary key, auto-generated)
title: VARCHAR(255) (NOT NULL, e.g., "October 2025 Book Vote")
expiration_date: TIMESTAMP (NOT NULL, when the poll closes)
include_read_books: BOOLEAN (NOT NULL, default FALSE, indicates if previously read books are included)
created_at: TIMESTAMP (default CURRENT_TIMESTAMP)
created_by: UUID (foreign key referencing auth.users.id, the admin who created the poll)


Poll_Options:

id: UUID (primary key, auto-generated)
poll_id: UUID (foreign key referencing Polls.id)
book_id: UUID (foreign key referencing Books.id)
created_at: TIMESTAMP (default CURRENT_TIMESTAMP)


Votes:

id: UUID (primary key, auto-generated)
poll_id: UUID (foreign key referencing Polls.id)
book_id: UUID (foreign key referencing Books.id)
user_id: UUID (foreign key referencing auth.users.id, NOT NULL)
created_at: TIMESTAMP (default CURRENT_TIMESTAMP)
Constraint: Unique (poll_id, user_id) to prevent multiple votes per user per poll



Notes

Use Supabase’s auth.users table for user authentication and roles.
Create a Book Club Admin role in Supabase Auth (e.g., via a custom user_roles table or metadata).
Ensure indexes on frequently queried fields (e.g., Books.title, Polls.expiration_date).
Provide SQL queries for creating tables, indexes, and any necessary triggers (e.g., to update updated_at).

Voting Functionality (/bookclub/vote)
Create a voting page at /bookclub/vote where authenticated users can vote in active polls. Requirements:

Poll Creation: Admins with the Book Club Admin role can create polls via the admin page (see below). Polls include:
A title (e.g., "October 2025 Book Vote").
An expiration date/time (e.g., 7 days from creation).
A list of books from the Books table where reading_date is NULL (or all books if include_read_books is TRUE).


Voting: Authenticated users can vote for one book per poll. Prevent multiple votes using the unique constraint in the Votes table.
Display: Show the active poll (if any, based on expiration_date >= CURRENT_TIMESTAMP). List poll options (books) with title, author, and image (if available). Allow users to select one book and submit their vote.
Privacy: Vote attribution (linking user_id to book_id) is private and only accessible to admins via the admin page. Public users see only aggregated vote counts (e.g., “5 votes” per book).
Edge Cases:
If no active poll exists, display a message: “No active polls at this time.”
If a poll expires, prevent new votes and mark it as closed.
Handle invalid votes (e.g., voting for a non-existent book).



Admin Page (/bookclub/admin)
Create an admin page at /bookclub/admin for users with the Book Club Admin role. Requirements:

Authentication: Restrict access to authenticated admins only, using Supabase Auth.
Book Management:
Add a new book with all fields from the Books table.
Edit existing books (update any field).
Delete books (soft delete preferred, e.g., add is_deleted BOOLEAN to Books).


Poll Management:
Create a new poll with a title, expiration date, and option to include read books.
View all polls (active and expired) with their vote counts per book.
Option to close a poll early (update expiration_date to CURRENT_TIMESTAMP).


UI: Use Tailwind CSS to match the site’s existing style (clean, modern, responsive). Include forms for book/poll creation and a table for managing books/polls.
Edge Cases:
Prevent duplicate book entries (e.g., same title and author).
Validate form inputs (e.g., valid URLs for image_url and buy_url, future expiration_date for polls).



Main Book Club Page (/bookclub)
Replace the static page at /bookclub with a dynamic, public page. Requirements:

Sortable Table: Display all books from the Books table in a responsive, sortable table using Tailwind CSS. Columns:
Title (sortable)
Author (sortable)
Reading Date (sortable, display “TBD” if NULL)
Description (truncated with “Read More” link if long)
Image (thumbnail, clickable to enlarge)
Buy Link (button or link to buy_url)


Filtering: Add a filter to toggle between “Books Read” (reading_date is not NULL) and “Books to Read” (reading_date is NULL).
Poll Display: If an active poll exists, show its title, expiration date, and aggregated vote counts (e.g., “Book A: 5 votes, Book B: 3 votes”). Include a “Vote Now” button linking to /bookclub/vote (visible to authenticated users only).
Performance: Use server-side rendering (Next.js) for initial load and client-side sorting/filtering for responsiveness. Add pagination if more than 50 books.
Edge Cases:
Handle missing data (e.g., no image or buy URL).
Ensure accessibility (e.g., alt text for images, keyboard navigation).



General Notes

Tech Stack: Use Next.js 15, Supabase (PostgreSQL and Auth), and Tailwind CSS. Use the Supabase JavaScript client for database operations.
Access Control:
Book data, reading dates, and poll details (except vote attribution) are public.
Voting requires authentication via Supabase Auth.
Admin page access requires the Book Club Admin role.


Future Integration: The reading_date may eventually link to an events feature, but for now, treat it as a standalone date.
Error Handling:
Prevent duplicate books or polls.
Display user-friendly error messages (e.g., “You’ve already voted in this poll”).
Log errors (e.g., failed database queries) for debugging.


Scalability: Optimize for a small dataset (<100 books initially) but include indexes for performance.
Testing: Ensure the feature works on desktop and mobile (responsive design).

Deliverables

SQL queries for creating tables, indexes, and triggers.
Next.js code for:
/bookclub page (public, with sortable table and poll display).
/bookclub/vote page (authenticated voting).
/bookclub/admin page (admin-only book and poll management).


Supabase configuration for authentication and roles.
Tailwind CSS styles to match the existing site’s design.