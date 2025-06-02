-- Migration: Update Books Table for Supabase Storage
-- Created: 2024-12-20
-- Description: Updates books table to use Supabase Storage and removes external image URLs

-- Create storage bucket for book covers if it doesn't exist
insert into storage.buckets (id, name, public)
values ('book-covers', 'book-covers', true)
on conflict (id) do nothing;

-- Create storage policies for the book-covers bucket
create policy "Anyone can view book covers" on storage.objects
  for select using (bucket_id = 'book-covers');

create policy "Admins can upload book covers" on storage.objects
  for insert with check (
    bucket_id = 'book-covers' 
    and (select public.is_book_club_admin())
  );

create policy "Admins can update book covers" on storage.objects
  for update using (
    bucket_id = 'book-covers' 
    and (select public.is_book_club_admin())
  );

create policy "Admins can delete book covers" on storage.objects
  for delete using (
    bucket_id = 'book-covers' 
    and (select public.is_book_club_admin())
  );

-- Update books table structure
alter table public.books 
  drop column if exists image_url,
  add column if not exists cover_image_path varchar(255),
  add column if not exists cover_image_uploaded_at timestamp with time zone;

-- Add index for cover image path
create index if not exists idx_books_cover_image_path on public.books(cover_image_path);

-- Add comment to explain the new field
comment on column public.books.cover_image_path is 'Path to book cover image in Supabase Storage bucket book-covers';

-- Function to get book cover URL from storage path
create or replace function public.get_book_cover_url(cover_path text)
  returns text
  language sql
  immutable
as $$
  select case 
    when cover_path is null or cover_path = '' then null
    else (select concat(
      current_setting('app.settings.supabase_url', true),
      '/storage/v1/object/public/book-covers/',
      cover_path
    ))
  end;
$$;

-- Function to delete old cover when updating
create or replace function public.cleanup_old_book_cover()
  returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
begin
  -- If cover_image_path is being updated and old path exists, mark for cleanup
  if old.cover_image_path is not null 
     and old.cover_image_path != new.cover_image_path then
    -- Note: In a production app, you might want to queue this for background deletion
    -- For now, we'll just log it
    raise notice 'Old cover image should be cleaned up: %', old.cover_image_path;
  end if;
  
  return new;
end;
$$;

-- Create trigger for cleanup
drop trigger if exists trigger_cleanup_book_cover on public.books;
create trigger trigger_cleanup_book_cover
  before update on public.books
  for each row
  execute function public.cleanup_old_book_cover(); 