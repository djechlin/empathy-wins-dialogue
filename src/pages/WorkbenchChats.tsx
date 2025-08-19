import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { MessageCircle, User, Bot, LogIn, Lock, ChevronDown, ChevronRight, Zap } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible';
import Navbar from '@/components/layout/Navbar';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

interface ChatData {
  id: string;
  organizer_mode: string;
  attendee_mode: string;
  organizer_system_prompt: string | null;
  organizer_first_message: string | null;
  attendee_system_prompt: string | null;
  created_at: string;
  ended_at: string | null;
  message_count?: number;
}

interface ChatMessage {
  id: string;
  chat_id: string;
  persona: 'organizer' | 'attendee';
  message: string;
  created_at: string;
}

interface CoachEval {
  id: string;
  chat_id: string;
  coach_id: string;
  coach_prompt: string;
  coach_result: string;
  created_at: string;
}

interface ExpandedChatData {
  messages: ChatMessage[];
  coachEvals: CoachEval[];
}

const WorkbenchChats = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedChats, setExpandedChats] = useState<Record<string, ExpandedChatData>>({});
  const [expandedChatIds, setExpandedChatIds] = useState<Set<string>>(new Set());
  const [systemPromptsOpen, setSystemPromptsOpen] = useState<Record<string, boolean>>({});
  const [messagesOpen, setMessagesOpen] = useState<Record<string, boolean>>({});
  const [coachEvalsOpen, setCoachEvalsOpen] = useState<Record<string, boolean>>({});

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
            organizer_first_message,
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

  const fetchChatDetails = async (chatId: string) => {
    try {
      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Fetch coach evaluations
      const { data: coachData, error: coachError } = await supabase
        .from('chat_coaches')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (coachError) throw coachError;

      const expandedData: ExpandedChatData = {
        messages: (messagesData || []) as ChatMessage[],
        coachEvals: coachData || [],
      };

      setExpandedChats((prev) => ({ ...prev, [chatId]: expandedData }));

      // Set default open states
      setSystemPromptsOpen((prev) => ({ ...prev, [chatId]: false }));
      setMessagesOpen((prev) => ({ ...prev, [chatId]: true }));
      setCoachEvalsOpen((prev) => ({ ...prev, [chatId]: true }));
    } catch (err) {
      console.error('Error fetching chat details:', err);
    }
  };

  const toggleChatExpansion = async (chatId: string) => {
    const isExpanded = expandedChatIds.has(chatId);
    const newExpandedIds = new Set(expandedChatIds);

    if (isExpanded) {
      newExpandedIds.delete(chatId);
    } else {
      newExpandedIds.add(chatId);
      if (!expandedChats[chatId]) {
        await fetchChatDetails(chatId);
      }
    }

    setExpandedChatIds(newExpandedIds);
  };

  const parseScore = (text: string): { score: number | null; content: string } => {
    const lines = text.split('\n');
    const firstLine = lines[0]?.trim();

    const scoreMatch = firstLine?.match(/^Score:\s*([0-5])$/);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[1], 10);
      const remainingContent = lines.slice(1).join('\n').trim();
      return { score, content: remainingContent };
    }

    return { score: null, content: text };
  };

  const getScoreBadgeColor = (score: number | null): string => {
    if (score === null) return '';
    if (score >= 4) return 'border border-green-500 text-green-700 bg-green-50';
    if (score === 3) return 'border border-gray-500 text-gray-700 bg-gray-50';
    return 'border border-red-500 text-red-700 bg-red-50';
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  if (!user && !userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 relative">
        <Navbar pageTitle="Chat History" />
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
        <Navbar pageTitle="Chat History" />
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
        <Navbar pageTitle="Chat History" />
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
        <Navbar pageTitle="Chat History" />
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
      <Navbar pageTitle="Chat History" />
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
              {chats.map((chat) => {
                const isExpanded = expandedChatIds.has(chat.id);
                const chatData = expandedChats[chat.id];

                return (
                  <Card key={chat.id} className="hover:shadow-md transition-shadow">
                    <Collapsible open={isExpanded} onOpenChange={() => toggleChatExpansion(chat.id)}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full p-0 h-auto">
                          <CardContent className="p-6 w-full">
                            <div className="flex items-center justify-between text-left">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    {chat.organizer_mode === 'ai' ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                    Organizer: {chat.organizer_mode}
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    {chat.attendee_mode === 'ai' ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                    Attendee: {chat.attendee_mode}
                                  </Badge>
                                  <Badge variant={chat.ended_at ? 'default' : 'secondary'}>
                                    {chat.ended_at ? 'Completed' : 'In Progress'}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <MessageCircle className="h-4 w-4" />
                                    {chat.message_count} messages
                                  </div>
                                  <span className="text-sm text-gray-500">{formatDateTime(chat.created_at)}</span>
                                </div>
                              </div>

                              <div className="ml-4 flex items-center">
                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </div>
                            </div>
                          </CardContent>
                        </Button>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <CardContent className="pt-0 pb-6 px-6">
                          {chatData && (
                            <div className="space-y-4 border-t pt-4">
                              {/* System Prompts Section */}
                              {(chat.organizer_system_prompt || chat.attendee_system_prompt || chat.organizer_first_message) && (
                                <Collapsible
                                  open={systemPromptsOpen[chat.id]}
                                  onOpenChange={(open) => setSystemPromptsOpen((prev) => ({ ...prev, [chat.id]: open }))}
                                >
                                  <CollapsibleTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start p-0 h-auto font-semibold">
                                      <div className="flex items-center gap-2">
                                        {systemPromptsOpen[chat.id] ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4" />
                                        )}
                                        System Prompts
                                      </div>
                                    </Button>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="space-y-4 mt-3">
                                    {chat.organizer_system_prompt && (
                                      <div>
                                        <h4 className="font-medium text-purple-800 mb-2">Organizer Prompt</h4>
                                        <div className="bg-purple-50 p-3 rounded border">
                                          <p className="text-sm whitespace-pre-wrap">{chat.organizer_system_prompt}</p>
                                        </div>
                                      </div>
                                    )}
                                    {chat.organizer_first_message && (
                                      <div>
                                        <h4 className="font-medium text-purple-800 mb-2">Organizer First Message</h4>
                                        <div className="bg-purple-50 p-3 rounded border">
                                          <p className="text-sm whitespace-pre-wrap">{chat.organizer_first_message}</p>
                                        </div>
                                      </div>
                                    )}
                                    {chat.attendee_system_prompt && (
                                      <div>
                                        <h4 className="font-medium text-orange-800 mb-2">Attendee Prompt</h4>
                                        <div className="bg-orange-50 p-3 rounded border">
                                          <p className="text-sm whitespace-pre-wrap">{chat.attendee_system_prompt}</p>
                                        </div>
                                      </div>
                                    )}
                                  </CollapsibleContent>
                                </Collapsible>
                              )}

                              {/* Messages Section */}
                              {chatData.messages.length > 0 && (
                                <Collapsible
                                  open={messagesOpen[chat.id]}
                                  onOpenChange={(open) => setMessagesOpen((prev) => ({ ...prev, [chat.id]: open }))}
                                >
                                  <CollapsibleTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start p-0 h-auto font-semibold">
                                      <div className="flex items-center gap-2">
                                        {messagesOpen[chat.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                        Conversation ({chatData.messages.length} messages)
                                      </div>
                                    </Button>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="mt-3">
                                    <div className="space-y-4">
                                      {chatData.messages.map((message) => (
                                        <div
                                          key={message.id}
                                          className={`flex ${message.persona === 'organizer' ? 'justify-end' : 'justify-start'}`}
                                        >
                                          <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                                              message.persona === 'organizer'
                                                ? 'bg-purple-200 text-gray-900'
                                                : 'bg-orange-200 text-gray-900'
                                            }`}
                                          >
                                            <div className="flex items-center gap-2 mb-1">
                                              {message.persona === 'organizer' ? <User size={12} /> : <Bot size={12} />}
                                              <span className="text-xs opacity-75">
                                                {message.persona === 'organizer' ? 'Organizer' : 'Attendee'}
                                              </span>
                                            </div>
                                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                                            <p className="text-xs mt-1 text-gray-600">{formatTime(message.created_at)}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              )}

                              {/* Coach Evaluations Section */}
                              {chatData.coachEvals.length > 0 && (
                                <Collapsible
                                  open={coachEvalsOpen[chat.id]}
                                  onOpenChange={(open) => setCoachEvalsOpen((prev) => ({ ...prev, [chat.id]: open }))}
                                >
                                  <CollapsibleTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start p-0 h-auto font-semibold">
                                      <div className="flex items-center gap-2">
                                        {coachEvalsOpen[chat.id] ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4" />
                                        )}
                                        <Zap className="h-4 w-4 text-red-600" />
                                        Coach Evaluations
                                      </div>
                                    </Button>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="mt-3">
                                    <div className="space-y-4">
                                      {chatData.coachEvals.map((evaluation) => {
                                        const { score, content } = parseScore(evaluation.coach_result);
                                        return (
                                          <div key={evaluation.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                              <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-red-300 rounded-full" />
                                                <span className="text-sm font-medium text-gray-900">Coach Evaluation</span>
                                              </div>
                                              {score !== null && (
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBadgeColor(score)}`}>
                                                  {score}/5
                                                </span>
                                              )}
                                            </div>
                                            <div className="mb-3">
                                              <h5 className="text-xs font-medium text-gray-600 mb-1">Coach Prompt:</h5>
                                              <div className="text-xs text-gray-700 bg-white p-2 rounded border">
                                                {evaluation.coach_prompt}
                                              </div>
                                            </div>
                                            <div>
                                              <h5 className="text-xs font-medium text-gray-600 mb-1">Evaluation:</h5>
                                              <div className="text-sm text-gray-600 bg-white p-2 rounded border whitespace-pre-wrap">
                                                {content || evaluation.coach_result}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              )}

                              {chatData.messages.length === 0 && chatData.coachEvals.length === 0 && (
                                <div className="text-center py-8">
                                  <p className="text-gray-500">No messages or evaluations found for this chat.</p>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkbenchChats;
