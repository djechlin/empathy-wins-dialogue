import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { MessageCircle, User, Bot, LogIn, Lock, ChevronDown, ChevronRight, Zap, Megaphone } from 'lucide-react';
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
  organizer_prompt?: { name: string };
  attendee_prompt?: { name: string };
  chat_messages?: { count: number }[];
  organizer_name?: string;
  attendee_name?: string;
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

interface ScoutEval {
  id: string;
  chat_id: string;
  scout_id: string;
  scout_prompt: string;
  scout_result: string;
  created_at: string;
}

interface ExpandedChatData {
  messages: ChatMessage[];
  coachEvals: CoachEval[];
  scoutEvals: ScoutEval[];
}

interface EvaluationCriterion {
  shortCriterion: string;
  score: number;
  feedback: string;
}

interface EvaluationCriterionProps {
  criterion: EvaluationCriterion;
  index: number;
}

const EvaluationCriterionComponent = ({ criterion, index }: EvaluationCriterionProps) => {
  const getScoreIndicator = (): string => {
    return '●';
  };

  const getScoreIndicatorColor = (score: number): string => {
    if (score >= 4) return 'text-green-500';
    if (score === 3) return 'text-gray-400';
    return 'text-red-500';
  };

  const getScoreBadgeColor = (score: number): string => {
    if (score >= 4) return 'border border-green-500 text-green-700 bg-green-50';
    if (score === 3) return 'border border-gray-500 text-gray-700 bg-gray-50';
    return 'border border-red-500 text-red-700 bg-red-50';
  };

  return (
    <div key={index} className="border-l-2 border-gray-200 pl-3 py-1">
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-lg ${getScoreIndicatorColor(criterion.score)}`}>{getScoreIndicator()}</span>
        <span className="font-medium text-gray-900 text-sm">{criterion.shortCriterion}</span>
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getScoreBadgeColor(criterion.score)}`}>{criterion.score}/5</span>
      </div>
      <p className="text-sm text-gray-600 ml-6">{criterion.feedback}</p>
    </div>
  );
};

interface CoachEvaluationProps {
  evaluation: CoachEval;
}

const CoachEvaluationComponent = ({ evaluation }: CoachEvaluationProps) => {
  const parseEvaluationJSON = (text: string): EvaluationCriterion[] | null => {
    try {
      // Try to extract JSON from the text
      // Look for JSON array pattern or ```json blocks
      const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\[[\s\S]*\])/);

      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        if (
          Array.isArray(parsed) &&
          parsed.every((item) => typeof item === 'object' && 'shortCriterion' in item && 'score' in item && 'feedback' in item)
        ) {
          return parsed;
        }
      }

      // Not valid JSON, return null
    } catch {
      // Not valid JSON, return null
    }
    return null;
  };

  const parseScore = (text: string): { score: number | null; content: string } => {
    const lines = text.split('\n');
    const firstLine = lines[0]?.trim();
    const scoreMatch = firstLine?.match(/^Score:\s*([0-5])$/);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[1], 10);
      const content = lines.slice(1).join('\n').trim();
      return { score, content };
    }
    return { score: null, content: text };
  };

  const criteria = parseEvaluationJSON(evaluation.coach_result);
  const fallbackParsed = !criteria ? parseScore(evaluation.coach_result) : { score: null, content: '' };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 bg-red-300 rounded-full" />
        <span className="text-sm font-medium text-gray-900">Coach Evaluation</span>
      </div>

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-start p-0 h-auto text-xs mb-2">
            <div className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-gray-600">Coach Prompt</span>
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mb-3">
          <div className="text-xs text-gray-700 bg-white p-2 rounded border ml-4">{evaluation.coach_prompt}</div>
        </CollapsibleContent>
      </Collapsible>

      <div>
        <h5 className="text-xs font-medium text-gray-600 mb-2">Evaluation:</h5>
        {criteria ? (
          <div className="space-y-2">
            {criteria.map((criterion, idx) => (
              <EvaluationCriterionComponent key={idx} criterion={criterion} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-600 bg-white p-2 rounded border whitespace-pre-wrap">
            {fallbackParsed.content || evaluation.coach_result}
          </div>
        )}
      </div>
    </div>
  );
};

interface ScoutEvaluationProps {
  evaluation: ScoutEval;
}

interface ConversationMessageProps {
  message: ChatMessage;
  formatTime: (dateString: string) => string;
}

const ConversationMessageComponent = ({ message, formatTime }: ConversationMessageProps) => {
  return (
    <div className={`flex ${message.persona === 'organizer' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
          message.persona === 'organizer' ? 'bg-purple-200 text-gray-900' : 'bg-orange-200 text-gray-900'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          {message.persona === 'organizer' ? <User size={12} /> : <Bot size={12} />}
          <span className="text-xs opacity-75">{message.persona === 'organizer' ? 'Organizer' : 'Attendee'}</span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        <p className="text-xs mt-1 text-gray-600">{formatTime(message.created_at)}</p>
      </div>
    </div>
  );
};

interface ConversationSectionProps {
  chatData: ExpandedChatData;
  chatId: string;
  messagesOpen: Record<string, boolean>;
  setMessagesOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  formatTime: (dateString: string) => string;
}

const ConversationSectionComponent = ({ chatData, chatId, messagesOpen, setMessagesOpen, formatTime }: ConversationSectionProps) => {
  if (chatData.messages.length === 0) return null;

  return (
    <Collapsible
      open={messagesOpen[chatId] || false}
      onOpenChange={(open) => setMessagesOpen((prev) => ({ ...prev, [chatId]: open }))}
    >
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-start p-0 h-auto font-semibold">
          <div className="flex items-center gap-2">
            {messagesOpen[chatId] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            Conversation ({chatData.messages.length} messages)
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3">
        <div className="space-y-4">
          {chatData.messages.map((message) => (
            <ConversationMessageComponent key={message.id} message={message} formatTime={formatTime} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const ScoutEvaluationComponent = ({ evaluation }: ScoutEvaluationProps) => {
  const parseEvaluationJSON = (text: string): EvaluationCriterion[] | null => {
    try {
      // Try to extract JSON from the text
      // Look for JSON array pattern or ```json blocks
      const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\[[\s\S]*\])/);

      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        if (
          Array.isArray(parsed) &&
          parsed.every((item) => typeof item === 'object' && 'shortCriterion' in item && 'score' in item && 'feedback' in item)
        ) {
          return parsed;
        }
      }

      // Not valid JSON, return null
    } catch {
      // Not valid JSON, return null
    }
    return null;
  };

  const parseScore = (text: string): { score: number | null; content: string } => {
    const lines = text.split('\n');
    const firstLine = lines[0]?.trim();
    const scoreMatch = firstLine?.match(/^Score:\s*([0-5])$/);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[1], 10);
      const content = lines.slice(1).join('\n').trim();
      return { score, content };
    }
    return { score: null, content: text };
  };

  const criteria = parseEvaluationJSON(evaluation.scout_result);
  const fallbackParsed = !criteria ? parseScore(evaluation.scout_result) : { score: null, content: '' };

  return (
    <div className="bg-white border border-purple-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 bg-purple-300 rounded-full" />
        <span className="text-sm font-medium text-gray-900">Scout Evaluation</span>
      </div>

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-start p-0 h-auto text-xs mb-2">
            <div className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-gray-600">Scout Prompt</span>
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mb-3">
          <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border ml-4">{evaluation.scout_prompt}</div>
        </CollapsibleContent>
      </Collapsible>

      <div>
        <h5 className="text-xs font-medium text-gray-600 mb-2">Evaluation:</h5>
        {criteria ? (
          <div className="space-y-2">
            {criteria.map((criterion, idx) => (
              <EvaluationCriterionComponent key={idx} criterion={criterion} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-600 bg-white p-2 rounded border whitespace-pre-wrap">
            {fallbackParsed.content || evaluation.scout_result}
          </div>
        )}
      </div>
    </div>
  );
};

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
  const [evaluationsOpen, setEvaluationsOpen] = useState<Record<string, boolean>>({});

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

        // Fetch chats for the current user with message counts
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
            organizer_prompt_id,
            attendee_prompt_id,
            created_at,
            ended_at,
            organizer_prompt:prompts!chats_organizer_prompt_id_fkey(name),
            attendee_prompt:prompts!chats_attendee_prompt_id_fkey(name),
            chat_messages(count)
          `,
          )
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (chatsError) throw chatsError;

        console.log('Raw chat data:', chatsData); // Debug log

        // Transform data and filter out chats with 0 messages
        const chatsWithCounts = (chatsData || []).map((chat) => {
          console.log('Processing chat:', chat.id, 'organizer_prompt:', chat.organizer_prompt, 'attendee_prompt:', chat.attendee_prompt); // Debug log
          return {
            ...chat,
            message_count: chat.chat_messages?.[0]?.count || 0,
            organizer_name: chat.organizer_prompt?.name,
            attendee_name: chat.attendee_prompt?.name,
          };
        });

        const chatsWithMessages = chatsWithCounts.filter((chat) => chat.message_count > 0);
        setChats(chatsWithMessages);
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

      // Fetch scout evaluations
      const { data: scoutData, error: scoutError } = await supabase
        .from('chat_scouts')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (scoutError) throw scoutError;

      const expandedData: ExpandedChatData = {
        messages: (messagesData || []) as ChatMessage[],
        coachEvals: coachData || [],
        scoutEvals: scoutData || [],
      };

      setExpandedChats((prev) => ({ ...prev, [chatId]: expandedData }));

      // Set default open states
      setSystemPromptsOpen((prev) => ({ ...prev, [chatId]: false }));
      setMessagesOpen((prev) => ({ ...prev, [chatId]: false }));
      setEvaluationsOpen((prev) => ({ ...prev, [chatId]: false }));
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
                                    <Megaphone className="h-3 w-3" />
                                    {chat.organizer_name || 'Human'}
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {chat.attendee_name || 'Human'}
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
                                  open={systemPromptsOpen[chat.id] || false}
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
                              <ConversationSectionComponent
                                chatData={chatData}
                                chatId={chat.id}
                                messagesOpen={messagesOpen}
                                setMessagesOpen={setMessagesOpen}
                                formatTime={formatTime}
                              />

                              {/* Evaluations Section */}
                              {(chatData.coachEvals.length > 0 || chatData.scoutEvals.length > 0) && (
                                <Collapsible
                                  open={evaluationsOpen[chat.id] || false}
                                  onOpenChange={(open) => setEvaluationsOpen((prev) => ({ ...prev, [chat.id]: open }))}
                                >
                                  <CollapsibleTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start p-0 h-auto font-semibold">
                                      <div className="flex items-center gap-2">
                                        {evaluationsOpen[chat.id] ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4" />
                                        )}
                                        <Zap className="h-4 w-4 text-blue-600" />
                                        Evaluations ({chatData.coachEvals.length + chatData.scoutEvals.length})
                                      </div>
                                    </Button>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="mt-3">
                                    <div className="space-y-4">
                                      {/* Coach Evaluations */}
                                      {chatData.coachEvals.map((evaluation) => (
                                        <CoachEvaluationComponent key={evaluation.id} evaluation={evaluation} />
                                      ))}

                                      {/* Scout Evaluations */}
                                      {chatData.scoutEvals.map((evaluation) => (
                                        <ScoutEvaluationComponent key={evaluation.id} evaluation={evaluation} />
                                      ))}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              )}

                              {chatData.messages.length === 0 && chatData.coachEvals.length === 0 && chatData.scoutEvals.length === 0 && (
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
