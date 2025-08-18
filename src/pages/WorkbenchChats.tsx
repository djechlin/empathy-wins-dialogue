import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { MessageCircle, Clock, User, Bot, Eye, LogIn, Lock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface ChatData {
  id: string;
  organizer_mode: string;
  attendee_mode: string;
  organizer_system_prompt: string | null;
  attendee_system_prompt: string | null;
  created_at: string;
  ended_at: string | null;
  message_count?: number;
}

const WorkbenchChats = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('WorkbenchChats: Error getting session:', error);
      } else {
        setUser(session?.user ?? null);
      }
      setUserLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      try {
        setLoading(true);

        // Fetch chats for the current user
        const { data: chatsData, error: chatsError } = await supabase
          .from('chats')
          .select(
            `
            id,
            organizer_mode,
            attendee_mode,
            organizer_system_prompt,
            attendee_system_prompt,
            created_at,
            ended_at
          `,
          )
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (chatsError) throw chatsError;

        // Get message counts for each chat
        const chatsWithCounts = await Promise.all(
          (chatsData || []).map(async (chat) => {
            const { count } = await supabase.from('chat_messages').select('*', { count: 'exact', head: true }).eq('chat_id', chat.id);

            return {
              ...chat,
              message_count: count || 0,
            };
          }),
        );

        setChats(chatsWithCounts);
      } catch (err) {
        console.error('Error fetching chats:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chats');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  const formatDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  if (!user && !userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 relative">
        <Navbar pageTitle="Chat History" pageSummary="View your conversation history" />
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-serif">Authentication Required</CardTitle>
                <p className="text-gray-600">You need to be logged in to view your chat history.</p>
              </CardHeader>
              <CardContent>
                <Link to="/auth">
                  <Button className="w-full bg-dialogue-purple hover:bg-dialogue-darkblue">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar pageTitle="Chat History" pageSummary="View your conversation history" />
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar pageTitle="Chat History" pageSummary="View your conversation history" />
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar pageTitle="Chat History" pageSummary="View your conversation history" />
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar pageTitle="Chat History" pageSummary="View your conversation history" />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Chat Sessions</h1>
            <p className="text-gray-600">
              {chats.length === 0
                ? 'No chat sessions found. Start a conversation in the Workbench to see it here.'
                : `${chats.length} chat session${chats.length === 1 ? '' : 's'} found`}
            </p>
          </div>

          {chats.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-gray-500 mb-4">Start a chat session in the Workbench to see your conversation history here.</p>
                <Link to="/workbench">
                  <Button>Go to Workbench</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {chats.map((chat) => (
                <Card key={chat.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              {chat.organizer_mode === 'ai' ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                              Organizer: {chat.organizer_mode}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              {chat.attendee_mode === 'ai' ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                              Attendee: {chat.attendee_mode}
                            </Badge>
                            <Badge variant={chat.ended_at ? 'default' : 'secondary'}>{chat.ended_at ? 'Completed' : 'In Progress'}</Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(chat.created_at).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {chat.message_count} messages
                          </div>
                          <div>Duration: {formatDuration(chat.created_at, chat.ended_at)}</div>
                        </div>

                        {(chat.organizer_system_prompt || chat.attendee_system_prompt) && (
                          <div className="space-y-2">
                            {chat.organizer_system_prompt && (
                              <div>
                                <span className="text-xs font-medium text-purple-700">Organizer: </span>
                                <span className="text-xs text-gray-600">
                                  {chat.organizer_system_prompt.length > 100
                                    ? `${chat.organizer_system_prompt.substring(0, 100)}...`
                                    : chat.organizer_system_prompt}
                                </span>
                              </div>
                            )}
                            {chat.attendee_system_prompt && (
                              <div>
                                <span className="text-xs font-medium text-orange-700">Attendee: </span>
                                <span className="text-xs text-gray-600">
                                  {chat.attendee_system_prompt.length > 100
                                    ? `${chat.attendee_system_prompt.substring(0, 100)}...`
                                    : chat.attendee_system_prompt}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="ml-4">
                        <Link to={`/workbench/chats/${chat.id}`}>
                          <Button size="sm" className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View Replay
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkbenchChats;
