-- Migration: Fix Poll Results Function
-- Created: 2024-12-20
-- Description: Updates get_poll_results_public function to use cover_image_path

-- Update the get_poll_results_public function
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
    public.get_book_cover_url(b.cover_image_path),
    count(v.id) as vote_count
  from public.poll_options po
  inner join public.books b on po.book_id = b.id
  left join public.votes v on v.poll_id = po.poll_id and v.book_id = b.id
  where po.poll_id = poll_id_param
  group by b.id, b.title, b.author, b.cover_image_path
  order by vote_count desc, b.title;
$$; 