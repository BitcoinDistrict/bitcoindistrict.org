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
import PieChart, { PieChartData } from '@/components/PieChart';

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

  // Dashboard metrics
  const totalVotes = activePolls.length > 0 && pollResults[activePolls[0].id]
    ? pollResults[activePolls[0].id].reduce((sum, result) => sum + result.vote_count, 0)
    : 0;

  // Pie chart data for the current poll
  const poll = activePolls[0];
  const pollData: PieChartData[] = poll && pollResults[poll.id]
    ? pollResults[poll.id].map((result, idx) => ({
        title: result.book_title,
        value: result.vote_count,
        color: [
          '#FFD600', '#FF6D00', '#00B8D4', '#00C853', '#D500F9', '#FF1744', '#AEEA00', '#304FFE', '#FFAB00', '#00E5FF',
        ][idx % 10],
      }))
    : [];

  // Book grid for poll choices
  const PollBookGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {pollResults[poll.id]?.map((result) => (
        <Card key={result.book_id} className="flex flex-col items-center p-4">
          <BookCover
            coverImagePath={result.book_image_url}
            title={result.book_title}
            width={60}
            height={80}
          />
          <div className="mt-2 text-center">
            <div className="font-semibold">{result.book_title}</div>
            <div className="text-sm text-muted-foreground">{result.book_author}</div>
          </div>
          <Badge variant="secondary" className="mt-2">
            {result.vote_count} vote{result.vote_count !== 1 ? 's' : ''}
          </Badge>
        </Card>
      ))}
    </div>
  );

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
      {/* Dashboard metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center p-4"><div className="text-2xl font-bold">{booksRead.length}</div><div className="text-sm text-muted-foreground">Books Read</div></Card>
        <Card className="text-center p-4"><div className="text-2xl font-bold">{booksToRead.length}</div><div className="text-sm text-muted-foreground">To Read</div></Card>
        <Card className="text-center p-4"><div className="text-2xl font-bold">{allBooks.length}</div><div className="text-sm text-muted-foreground">Total Books</div></Card>
        <Card className="text-center p-4"><div className="text-2xl font-bold">{totalVotes}</div><div className="text-sm text-muted-foreground">Votes in Current Poll</div></Card>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Bitcoin District Book Club</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Join other DC Bitcoiners on the never-ending journey down the Bitcoin rabbit hole. Our book club meets every month!
        </p>
      </div>

      {/* Condensed Poll Section */}
      {poll && pollResults[poll.id] && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Vote for the Next Book</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <PieChart data={pollData} label="Current Votes" className="w-full md:w-1/3" />
            <div className="flex-1">
              <PollBookGrid />
              {user && new Date(poll.expiration_date) > new Date() && (
                <div className="mt-4 flex justify-center">
                  <Button asChild>
                    <Link href="/bookclub/vote">Vote Now</Link>
                  </Button>
                </div>
              )}
              {!user && new Date(poll.expiration_date) > new Date() && (
                <div className="mt-4 flex flex-col items-center">
                  <p className="text-sm text-muted-foreground mb-2">Sign in to participate in the poll</p>
                  <Button variant="outline" asChild>
                    <Link href="/sign-in"><User className="w-4 h-4 mr-2" />Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
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
  