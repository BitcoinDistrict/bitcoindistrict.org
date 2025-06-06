'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import BookCover from '@/components/BookCover';
import { useRouter } from 'next/navigation';
import { 
  getActivePolls, 
  getPollOptions, 
  castVote, 
  getCurrentUser,
  getUserVote,
  Poll,
  Book
} from '@/lib/bookClub';
import { Vote, ArrowLeft, CheckCircle, AlertCircle, User } from 'lucide-react';

export default function VotePage() {
  const router = useRouter();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [pollOptions, setPollOptions] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [userVote, setUserVote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedPoll && user) {
      loadPollData();
    }
  }, [selectedPoll, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [activePolls, currentUser] = await Promise.all([
        getActivePolls(),
        getCurrentUser()
      ]);

      setPolls(activePolls);
      setUser(currentUser);

      if (activePolls.length > 0) {
        setSelectedPoll(activePolls[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Failed to load polls' });
    } finally {
      setLoading(false);
    }
  };

  const loadPollData = async () => {
    if (!selectedPoll || !user) return;

    try {
      const [options, vote] = await Promise.all([
        getPollOptions(selectedPoll.id),
        getUserVote(selectedPoll.id)
      ]);

      setPollOptions(options);
      setUserVote(vote);

      if (vote) {
        setSelectedBook(vote.book_id);
      }
    } catch (error) {
      console.error('Error loading poll data:', error);
    }
  };

  const handleVote = async () => {
    if (!selectedPoll || !selectedBook || !user) return;

    try {
      setSubmitting(true);
      setMessage(null);

      const result = await castVote(selectedPoll.id, selectedBook);

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Reload poll data to show the vote
        await loadPollData();
        // Redirect to main page after a delay
        setTimeout(() => {
          router.push('/bookclub');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error: any) {
      console.error('Error casting vote:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to cast vote' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading polls...</p>
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
                You must be signed in to participate in polls.
              </p>
              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/bookclub">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Book Club
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle>No Active Polls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                There are no active polls at this time.
              </p>
              <Button asChild>
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

  const timeLeft = selectedPoll ? new Date(selectedPoll.expiration_date).getTime() - Date.now() : 0;
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  const hasExpired = daysLeft <= 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/bookclub">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Book Club
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Vote in Poll</h1>
          <p className="text-muted-foreground">
            Choose your preferred book for the next reading session
          </p>
        </div>

        {selectedPoll && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="w-5 h-5" />
                {selectedPoll.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Expires: {new Date(selectedPoll.expiration_date).toLocaleDateString()}</span>
                <span>
                  {hasExpired ? (
                    <Badge variant="destructive">Expired</Badge>
                  ) : (
                    <Badge variant="secondary">{daysLeft} days left</Badge>
                  )}
                </span>
              </div>
            </CardHeader>
          </Card>
        )}

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

        {userVote && (
          <Alert className="mb-6 border-blue-500">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              You have already voted in this poll. You can view your selection below.
            </AlertDescription>
          </Alert>
        )}

        {hasExpired && (
          <Alert className="mb-6 border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This poll has expired. You can no longer vote.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Select a Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pollOptions.map((option) => {
                const book = option.books as Book;
                const isSelected = selectedBook === book.id;
                
                return (
                  <div
                    key={option.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      isSelected 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    } ${userVote || hasExpired ? 'cursor-not-allowed opacity-50' : ''}`}
                    onClick={() => {
                      if (!userVote && !hasExpired) {
                        setSelectedBook(book.id);
                      }
                    }}
                  >
                    <div className="flex items-start gap-4">
<<<<<<< HEAD
                      <div className="flex-shrink-0">
                        <BookCover
                          coverImagePath={book.cover_image_path}
                          title={book.title}
                          width={80}
                          height={100}
                        />
                      </div>
=======
                      {book.cover_image_path ? (
                        <div className="flex-shrink-0">
                          <Image
                            src={book.cover_image_path}
                            alt={`${book.title} cover`}
                            width={80}
                            height={100}
                            className="rounded shadow-sm"
                          />
                        </div>
                      ) : null}
>>>>>>> staging
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                        <p className="text-muted-foreground mb-2">{book.author}</p>
                        {book.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {book.description}
                          </p>
                        )}
                        {book.buy_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <a href={book.buy_url} target="_blank" rel="noopener noreferrer">
                              View on Amazon
                            </a>
                          </Button>
                        )}
                      </div>
                      {isSelected && (
                        <div className="flex-shrink-0">
                          <CheckCircle className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {!userVote && !hasExpired && (
              <div className="mt-6 pt-6 border-t">
                <Button 
                  onClick={handleVote}
                  disabled={!selectedBook || submitting}
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Casting Vote...
                    </>
                  ) : (
                    <>
                      <Vote className="w-4 h-4 mr-2" />
                      Cast Vote
                    </>
                  )}
                </Button>
                {selectedBook && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    You will vote for: {pollOptions.find(opt => opt.books.id === selectedBook)?.books.title}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 