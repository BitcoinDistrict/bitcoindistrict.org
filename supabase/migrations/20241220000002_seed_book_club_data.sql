-- Migration: Seed Book Club Data
-- Created: 2024-12-20
-- Description: Seeds initial data for book club feature testing

-- Insert sample books
insert into public.books (title, author, description, image_url, buy_url, reading_date) values
(
  'The Bitcoin Standard',
  'Saifedean Ammous',
  'An in-depth analysis of the properties of Bitcoin as money and its economic implications.',
  'https://images-na.ssl-images-amazon.com/images/I/71XVKm6DPUL.jpg',
  'https://amazon.com/dp/1119473861',
  '2023-01-15'
),
(
  'Mastering Bitcoin',
  'Andreas M. Antonopoulos',
  'A technical guide to understanding Bitcoin and blockchain technology.',
  'https://images-na.ssl-images-amazon.com/images/I/71k-pDFMuPL.jpg',
  'https://amazon.com/dp/1491954388',
  '2023-03-20'
),
(
  'The Sovereign Individual',
  'James Dale Davidson, William Rees-Mogg',
  'How to survive and thrive during the collapse of the welfare state.',
  'https://images-na.ssl-images-amazon.com/images/I/81V7z9JL9SL.jpg',
  'https://amazon.com/dp/0684832720',
  '2023-06-10'
),
(
  'The Fiat Standard',
  'Saifedean Ammous',
  'The debt slavery alternative to human civilization.',
  'https://images-na.ssl-images-amazon.com/images/I/71nZj5BHLPL.jpg',
  'https://amazon.com/dp/1544526474',
  null
),
(
  'Broken Money',
  'Lyn Alden',
  'Why Our Financial System is Failing Us and How We Can Make it Better.',
  'https://images-na.ssl-images-amazon.com/images/I/71iRYqvVJCL.jpg',
  'https://amazon.com/dp/1544526482',
  null
),
(
  'The Price of Tomorrow',
  'Jeff Booth',
  'Why Deflation is the Key to an Abundant Future.',
  'https://images-na.ssl-images-amazon.com/images/I/71nI9z7LNXL.jpg',
  'https://amazon.com/dp/1999257405',
  null
),
(
  'The Technology Trap',
  'Carl Benedikt Frey',
  'Capital, Labor, and Power in the Age of Automation.',
  'https://images-na.ssl-images-amazon.com/images/I/91qhQTcwjWL.jpg',
  'https://amazon.com/dp/0691172796',
  null
);

-- Insert a sample poll (expires in 7 days from now)
insert into public.polls (title, expiration_date, include_read_books) values
(
  'Next Book Club Selection - January 2025',
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
  from public.polls 
  where title = 'Next Book Club Selection - January 2025';
  
  -- Add poll options for books that haven't been read yet (reading_date is null)
  for book_uuid in 
    select id from public.books where reading_date is null
  loop
    insert into public.poll_options (poll_id, book_id) 
    values (poll_uuid, book_uuid);
  end loop;
end $$; 