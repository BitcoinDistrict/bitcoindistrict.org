import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Test the connection
supabase.auth.getSession().then(
  ({ data: { session }, error }) => {
    if (error) {
      console.error('Error connecting to Supabase:', error)
    } else {
      console.log('Supabase connection successful')
    }
  }
)

export interface Book {
  id: string
  title: string
  author: string
  description?: string
  cover_image_path?: string
  cover_image_uploaded_at?: string
  buy_url?: string
  reading_date?: string
  is_deleted: boolean
  created_at: string
  updated_at: string
}

export interface Poll {
  id: string
  title: string
  expiration_date: string
  include_read_books: boolean
  is_active: boolean
  created_at: string
  created_by?: string
}

export interface PollOption {
  id: string
  poll_id: string
  book_id: string
  created_at: string
}

export interface Vote {
  id: string
  poll_id: string
  book_id: string
  user_id: string
  created_at: string
}

export interface PollResult {
  book_id: string
  book_title: string
  book_author: string
  book_image_url?: string
  vote_count: number
}

// Book functions
export async function getAllBooks() {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_deleted', false)
    .order('title')

  if (error) throw error
  return data as Book[]
}

export async function getBooksRead() {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_deleted', false)
    .not('reading_date', 'is', null)
    .order('reading_date', { ascending: false })

  if (error) throw error
  return data as Book[]
}

export async function getBooksToRead() {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_deleted', false)
    .is('reading_date', null)
    .order('title')

  if (error) throw error
  return data as Book[]
}

export async function createBook(book: Omit<Book, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>) {
  const { data, error } = await supabase
    .from('books')
    .insert([book])
    .select()
    .single()

  if (error) throw error
  return data as Book
}

export async function updateBook(id: string, updates: Partial<Book>) {
  const { data, error } = await supabase
    .from('books')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Book
}

export async function deleteBook(id: string) {
  const { data, error } = await supabase
    .from('books')
    .update({ is_deleted: true })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Book
}

// Storage functions for book covers
export async function uploadBookCover(file: File, bookId: string): Promise<string> {
  // Generate a unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${bookId}-${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('book-covers')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error
  return data.path
}

export async function deleteBookCover(path: string) {
  const { error } = await supabase.storage
    .from('book-covers')
    .remove([path])

  if (error) throw error
}

export async function getBookCoverUrl(path: string | null | undefined): Promise<string | null> {
  if (!path) return null
  
  const { data } = supabase.storage
    .from('book-covers')
    .getPublicUrl(path)
    
  return data.publicUrl
}

// Poll functions
export async function getActivePolls() {
  const { data, error } = await supabase.rpc('get_active_polls')

  if (error) throw error
  return data as Poll[]
}

export async function getAllPolls() {
  const { data, error } = await supabase
    .from('polls')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Poll[]
}

export async function createPoll(poll: Omit<Poll, 'id' | 'created_at' | 'created_by' | 'is_active'>) {
  const { data, error } = await supabase
    .from('polls')
    .insert([poll])
    .select()
    .single()

  if (error) throw error
  return data as Poll
}

export async function addPollOptions(pollId: string, bookIds: string[]) {
  const options = bookIds.map(bookId => ({
    poll_id: pollId,
    book_id: bookId
  }))

  const { data, error } = await supabase
    .from('poll_options')
    .insert(options)
    .select()

  if (error) throw error
  return data as PollOption[]
}

export async function getPollOptions(pollId: string) {
  const { data, error } = await supabase
    .from('poll_options')
    .select(`
      *,
      books (*)
    `)
    .eq('poll_id', pollId)

  if (error) throw error
  return data
}

export async function getPollResults(pollId: string) {
  const { data, error } = await supabase.rpc('get_poll_results_public', {
    poll_id_param: pollId
  })

  if (error) throw error
  return data as PollResult[]
}

export async function getPollResultsAdmin(pollId: string) {
  const { data, error } = await supabase.rpc('get_poll_results', {
    poll_id_param: pollId
  })

  if (error) throw error
  return data as PollResult[]
}

// Voting functions
export async function castVote(pollId: string, bookId: string) {
  const { data, error } = await supabase.rpc('cast_vote', {
    poll_id_param: pollId,
    book_id_param: bookId
  })

  if (error) throw error
  return data
}

export async function getUserVote(pollId: string) {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('poll_id', pollId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as Vote | null
}

// Admin functions
export async function isBookClubAdmin() {
  const { data, error } = await supabase.rpc('is_book_club_admin')

  if (error) throw error
  return data as boolean
}

export async function addBookClubAdmin(userId: string) {
  const { data, error } = await supabase
    .from('user_roles')
    .insert([{
      user_id: userId,
      role: 'book_club_admin'
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeBookClubAdmin(userId: string) {
  const { data, error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role', 'book_club_admin')

  if (error) throw error
  return data
}

// Auth functions
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
} 