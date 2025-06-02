'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import Link from 'next/link';
import { 
  getAllBooks,
  getAllPolls,
  getBooksToRead,
  createBook,
  updateBook,
  deleteBook,
  createPoll,
  addPollOptions,
  getPollResultsAdmin,
  isBookClubAdmin,
  getCurrentUser,
  Book,
  Poll,
  PollResult
} from '@/lib/bookClub';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Book as BookIcon, 
  Vote, 
  User, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Save,
  X
} from 'lucide-react';

export default function AdminPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [pollResults, setPollResults] = useState<{ [pollId: string]: PollResult[] }>({});
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Book form state
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    description: '',
    image_url: '',
    buy_url: '',
    reading_date: ''
  });

  // Poll form state
  const [showPollForm, setShowPollForm] = useState(false);
  const [pollForm, setPollForm] = useState({
    title: '',
    expiration_date: '',
    include_read_books: false
  });
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [currentUser, adminStatus] = await Promise.all([
        getCurrentUser(),
        isBookClubAdmin()
      ]);

      setUser(currentUser);
      setIsAdmin(adminStatus);

      if (adminStatus) {
        const [allBooks, allPolls] = await Promise.all([
          getAllBooks(),
          getAllPolls()
        ]);

        setBooks(allBooks);
        setPolls(allPolls);

        // Load poll results
        const results: { [pollId: string]: PollResult[] } = {};
        for (const poll of allPolls) {
          const pollResult = await getPollResultsAdmin(poll.id);
          results[poll.id] = pollResult;
        }
        setPollResults(results);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Failed to load admin data' });
    } finally {
      setLoading(false);
    }
  };

  const resetBookForm = () => {
    setBookForm({
      title: '',
      author: '',
      description: '',
      image_url: '',
      buy_url: '',
      reading_date: ''
    });
    setEditingBook(null);
    setShowBookForm(false);
  };

  const handleEditBook = (book: Book) => {
    setBookForm({
      title: book.title,
      author: book.author,
      description: book.description || '',
      image_url: book.image_url || '',
      buy_url: book.buy_url || '',
      reading_date: book.reading_date || ''
    });
    setEditingBook(book);
    setShowBookForm(true);
  };

  const handleSubmitBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await updateBook(editingBook.id, bookForm);
        setMessage({ type: 'success', text: 'Book updated successfully' });
      } else {
        await createBook(bookForm);
        setMessage({ type: 'success', text: 'Book created successfully' });
      }
      resetBookForm();
      loadData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save book' });
    }
  };

  const handleDeleteBook = async (book: Book) => {
    if (!confirm(`Are you sure you want to delete "${book.title}"?`)) return;
    
    try {
      await deleteBook(book.id);
      setMessage({ type: 'success', text: 'Book deleted successfully' });
      loadData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete book' });
    }
  };

  const handleSubmitPoll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const poll = await createPoll(pollForm);
      await addPollOptions(poll.id, selectedBooks);
      setMessage({ type: 'success', text: 'Poll created successfully' });
      setPollForm({ title: '', expiration_date: '', include_read_books: false });
      setSelectedBooks([]);
      setShowPollForm(false);
      loadData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to create poll' });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You must be signed in to access the admin panel.
              </p>
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You don't have permission to access the admin panel.
              </p>
              <Button variant="outline" asChild>
                <Link href="/bookclub">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Book Club
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const availableBooks = pollForm.include_read_books ? books : books.filter(book => !book.reading_date);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/bookclub">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Book Club
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">Book Club Administration</h1>
        <p className="text-muted-foreground">
          Manage books and polls for the Bitcoin District Book Club
        </p>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'error' ? 'border-destructive' : 'border-green-500'}`}>
          {message.type === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="books" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="books">Books Management</TabsTrigger>
          <TabsTrigger value="polls">Polls Management</TabsTrigger>
        </TabsList>

        <TabsContent value="books" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookIcon className="w-5 h-5" />
                    Books ({books.length})
                  </CardTitle>
                  <Button onClick={() => setShowBookForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Book
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Cover</th>
                        <th className="text-left p-2">Title</th>
                        <th className="text-left p-2">Author</th>
                        <th className="text-left p-2">Reading Date</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((book) => (
                        <tr key={book.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">
                            {book.image_url ? (
                              <Image
                                src={book.image_url}
                                alt={`${book.title} cover`}
                                width={40}
                                height={50}
                                className="rounded"
                              />
                            ) : (
                              <div className="w-10 h-12 bg-muted rounded flex items-center justify-center text-xs">
                                No Image
                              </div>
                            )}
                          </td>
                          <td className="p-2 font-medium">{book.title}</td>
                          <td className="p-2">{book.author}</td>
                          <td className="p-2">
                            {book.reading_date ? (
                              <Badge variant="secondary">
                                {new Date(book.reading_date).toLocaleDateString()}
                              </Badge>
                            ) : (
                              <Badge variant="outline">Not scheduled</Badge>
                            )}
                          </td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditBook(book)}
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteBook(book)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Book Form */}
            {showBookForm && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</CardTitle>
                    <Button variant="outline" onClick={resetBookForm}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitBook} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={bookForm.title}
                          onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="author">Author *</Label>
                        <Input
                          id="author"
                          value={bookForm.author}
                          onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        value={bookForm.description}
                        onChange={(e) => setBookForm({...bookForm, description: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="image_url">Image URL</Label>
                        <Input
                          id="image_url"
                          type="url"
                          value={bookForm.image_url}
                          onChange={(e) => setBookForm({...bookForm, image_url: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="buy_url">Buy URL</Label>
                        <Input
                          id="buy_url"
                          type="url"
                          value={bookForm.buy_url}
                          onChange={(e) => setBookForm({...bookForm, buy_url: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reading_date">Reading Date</Label>
                      <Input
                        id="reading_date"
                        type="date"
                        value={bookForm.reading_date}
                        onChange={(e) => setBookForm({...bookForm, reading_date: e.target.value})}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      {editingBook ? 'Update Book' : 'Create Book'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="polls" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="w-5 h-5" />
                    Polls ({polls.length})
                  </CardTitle>
                  <Button onClick={() => setShowPollForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Poll
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {polls.map((poll) => {
                    const results = pollResults[poll.id] || [];
                    const totalVotes = results.reduce((sum, result) => sum + result.vote_count, 0);
                    const isActive = new Date(poll.expiration_date) > new Date() && poll.is_active;

                    return (
                      <Card key={poll.id} className="border-l-4 border-l-primary">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{poll.title}</CardTitle>
                            <Badge variant={isActive ? 'default' : 'secondary'}>
                              {isActive ? 'Active' : 'Closed'}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Expires: {new Date(poll.expiration_date).toLocaleDateString()}</p>
                            <p>Total votes: {totalVotes}</p>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {results.map((result) => (
                              <div key={result.book_id} className="flex items-center justify-between p-2 border rounded">
                                <div>
                                  <p className="font-medium">{result.book_title}</p>
                                  <p className="text-sm text-muted-foreground">{result.book_author}</p>
                                </div>
                                <Badge variant="outline">
                                  {result.vote_count} vote{result.vote_count !== 1 ? 's' : ''}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Poll Form */}
            {showPollForm && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Create New Poll</CardTitle>
                    <Button variant="outline" onClick={() => setShowPollForm(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitPoll} className="space-y-4">
                    <div>
                      <Label htmlFor="poll_title">Poll Title *</Label>
                      <Input
                        id="poll_title"
                        value={pollForm.title}
                        onChange={(e) => setPollForm({...pollForm, title: e.target.value})}
                        required
                        placeholder="e.g., Next Book Club Selection - March 2025"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiration_date">Expiration Date *</Label>
                      <Input
                        id="expiration_date"
                        type="datetime-local"
                        value={pollForm.expiration_date}
                        onChange={(e) => setPollForm({...pollForm, expiration_date: e.target.value})}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="include_read_books"
                        checked={pollForm.include_read_books}
                        onChange={(e) => setPollForm({...pollForm, include_read_books: e.target.checked})}
                      />
                      <Label htmlFor="include_read_books">Include books we've already read</Label>
                    </div>
                    <div>
                      <Label>Select Books for Poll ({selectedBooks.length} selected)</Label>
                      <div className="mt-2 max-h-60 overflow-y-auto border rounded p-2">
                        {availableBooks.map((book) => (
                          <div key={book.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded">
                            <input
                              type="checkbox"
                              id={`book-${book.id}`}
                              checked={selectedBooks.includes(book.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedBooks([...selectedBooks, book.id]);
                                } else {
                                  setSelectedBooks(selectedBooks.filter(id => id !== book.id));
                                }
                              }}
                            />
                            <Label htmlFor={`book-${book.id}`} className="flex-1 cursor-pointer">
                              {book.title} by {book.author}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={selectedBooks.length === 0}>
                      <Save className="w-4 h-4 mr-2" />
                      Create Poll
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 