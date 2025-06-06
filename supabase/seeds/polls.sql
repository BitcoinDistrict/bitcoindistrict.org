-- Insert a sample poll (expires in 7 days from now)
insert into public.bookclub_polls (title, expiration_date, include_read_books) values
(
  'Next Book Club',
  now() + interval '7 days',
  false
);

-- Get the poll ID for the above poll
do $$
declare
  poll_uuid uuid;
  book_uuid uuid;
begin
  -- Get the poll ID
  select id into poll_uuid 
  from public.bookclub_polls 
  where title = 'Next Book Club';
  
  -- Add poll options for books that haven't been read yet (reading_date is null)
  for book_uuid in 
    select id from public.bookclub_books where reading_date is null
  loop
    insert into public.bookclub_poll_options (poll_id, book_id) 
    values (poll_uuid, book_uuid);
  end loop;
end $$; 