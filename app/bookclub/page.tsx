'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookCover from '@/components/BookCover';
import Link from 'next/link';
import { 
  getAllBooks, 
  getBooksRead, 
  getBooksToRead, 
  getActivePolls, 
  getPollResults,
  getCurrentUser,
  Book,
  Poll,
  PollResult
} from '@/lib/bookClub';
import { ExternalLink, Calendar, Vote, User } from 'lucide-react';

export default function BookClubPage() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [booksRead, setBooksRead] = useState<Book[]>([]);
  const [booksToRead, setBooksToRead] = useState<Book[]>([]);
  const [activePolls, setActivePolls] = useState<Poll[]>([]);
  const [pollResults, setPollResults] = useState<{ [pollId: string]: PollResult[] }>({});
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'reading_date'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load data sequentially to better identify where errors occur
      console.log('Loading books...');
      const books = await getAllBooks();
      console.log('Books loaded:', books.length);
      
      console.log('Loading read books...');
      const readBooks = await getBooksRead();
      console.log('Read books loaded:', readBooks.length);
      
      console.log('Loading to-read books...');
      const toReadBooks = await getBooksToRead();
      console.log('To-read books loaded:', toReadBooks.length);
      
      console.log('Loading polls...');
      const polls = await getActivePolls();
      console.log('Polls loaded:', polls.length);
      
      console.log('Getting current user...');
      const currentUser = await getCurrentUser();
      console.log('Current user:', currentUser?.id);

      setAllBooks(books);
      setBooksRead(readBooks);
      setBooksToRead(toReadBooks);
      setActivePolls(polls);
      setUser(currentUser);

      // Load poll results for active polls
      console.log('Loading poll results...');
      const results: { [pollId: string]: PollResult[] } = {};
      for (const poll of polls) {
        try {
          const pollResult = await getPollResults(poll.id);
          results[poll.id] = pollResult;
          console.log(`Results loaded for poll ${poll.id}:`, pollResult.length);
        } catch (error) {
          console.error(`Error loading results for poll ${poll.id}:`, error);
        }
      }
      setPollResults(results);
    } catch (error) {
      console.error('Detailed error loading book club data:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    } finally {
      setLoading(false);
    }
  };

  const sortBooks = (books: Book[]) => {
    return [...books].sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      
      if (sortBy === 'reading_date') {
        aValue = a.reading_date || '9999-12-31'; // Put null dates at end
        bValue = b.reading_date || '9999-12-31';
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });
  };

  const handleSort = (field: 'title' | 'author' | 'reading_date') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const BookTable = ({ books }: { books: Book[] }) => {
    const sortedBooks = sortBooks(books);

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Cover</th>
              <th 
                className="text-left p-4 cursor-pointer hover:bg-muted"
                onClick={() => handleSort('title')}
              >
                Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="text-left p-4 cursor-pointer hover:bg-muted"
                onClick={() => handleSort('author')}
              >
                Author {sortBy === 'author' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="text-left p-4 cursor-pointer hover:bg-muted"
                onClick={() => handleSort('reading_date')}
              >
                Reading Date {sortBy === 'reading_date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-left p-4">Description</th>
              <th className="text-left p-4">Buy</th>
            </tr>
          </thead>
          <tbody>
            {sortedBooks.map((book) => (
              <tr key={book.id} className="border-b hover:bg-muted/50">
                <td className="p-4">
                  <BookCover
                    coverImagePath={book.cover_image_path}
                    title={book.title}
                    width={60}
                    height={80}
                  />
                </td>
                <td className="p-4 font-semibold">{book.title}</td>
                <td className="p-4">{book.author}</td>
                <td className="p-4">
                  {book.reading_date ? (
                    <Badge variant="secondary">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(book.reading_date).toLocaleDateString()}
                    </Badge>
                  ) : (
                    <Badge variant="outline">TBD</Badge>
                  )}
                </td>
                <td className="p-4 max-w-xs">
                  {book.description ? (
                    <p className="text-sm text-muted-foreground truncate">
                      {book.description.length > 100 
                        ? `${book.description.substring(0, 100)}...` 
                        : book.description
                      }
                    </p>
                  ) : (
                    <span className="text-muted-foreground text-sm">No description</span>
                  )}
                </td>
                <td className="p-4">
                  {book.buy_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={book.buy_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Buy
                      </a>
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const PollDisplay = ({ poll }: { poll: Poll }) => {
    const results = pollResults[poll.id] || [];
    const totalVotes = results.reduce((sum, result) => sum + result.vote_count, 0);
    const timeLeft = new Date(poll.expiration_date).getTime() - Date.now();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5" />
            {poll.title}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Expires: {new Date(poll.expiration_date).toLocaleDateString()}</span>
            <span>({daysLeft > 0 ? `${daysLeft} days left` : 'Expired'})</span>
            <span>Total votes: {totalVotes}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {results.map((result) => (
              <div key={result.book_id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <BookCover
                    coverImagePath={result.book_image_url}
                    title={result.book_title}
                    width={40}
                    height={50}
                  />
                  <div>
                    <h4 className="font-medium">{result.book_title}</h4>
                    <p className="text-sm text-muted-foreground">{result.book_author}</p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {result.vote_count} vote{result.vote_count !== 1 ? 's' : ''}
                </Badge>
              </div>
            ))}
          </div>
          {user && daysLeft > 0 && (
            <div className="mt-4">
              <Button asChild>
                <Link href="/bookclub/vote">
                  Vote Now
                </Link>
              </Button>
            </div>
          )}
          {!user && daysLeft > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Sign in to participate in the poll
              </p>
              <Button variant="outline" asChild>
                <Link href="/sign-in">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading book club data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Bitcoin District Book Club</h1>
        <p className="text-lg text-muted-foreground">
          Expanding minds through Bitcoin and Austrian economics literature
        </p>
      </div>

      {/* Active Polls Section */}
      {activePolls.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Active Polls</h2>
          {activePolls.map((poll) => (
            <PollDisplay key={poll.id} poll={poll} />
          ))}
        </div>
      )}

      {/* Books Section */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Books ({allBooks.length})</TabsTrigger>
          <TabsTrigger value="read">Books Read ({booksRead.length})</TabsTrigger>
          <TabsTrigger value="toread">To Read ({booksToRead.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Books</CardTitle>
            </CardHeader>
            <CardContent>
              <BookTable books={allBooks} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="read" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Books We've Read</CardTitle>
            </CardHeader>
            <CardContent>
              <BookTable books={booksRead} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="toread" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Books To Read</CardTitle>
            </CardHeader>
            <CardContent>
              <BookTable books={booksToRead} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
  