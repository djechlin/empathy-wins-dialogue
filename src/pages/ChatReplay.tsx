import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Bot, User, MessageCircle, Clock, Zap, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible';
import Navbar from '@/components/layout/Navbar';

interface ChatData {
  id: string;
  user_id: string;
  organizer_mode: string;
  organizer_prompt_id: string | null;
  attendee_mode: string;
  attendee_prompt_id: string | null;
  organizer_system_prompt: string | null;
  organizer_first_message: string | null;
  attendee_system_prompt: string | null;
  created_at: string;
  ended_at: string | null;
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

const ChatReplay = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [chat, setChat] = useState<ChatData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [coachEvals, setCoachEvals] = useState<CoachEval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemPromptsOpen, setSystemPromptsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(true);
  const [coachEvalsOpen, setCoachEvalsOpen] = useState(true);

  useEffect(() => {
    if (!chatId) return;

    const fetchChatData = async () => {
      try {
        setLoading(true);

        // Fetch chat details
        const { data: chatData, error: chatError } = await supabase.from('chats').select('*').eq('id', chatId).single();

        if (chatError) throw chatError;
        setChat(chatData);

        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;
        setMessages((messagesData || []) as ChatMessage[]);

        // Fetch coach evaluations
        const { data: coachData, error: coachError } = await supabase
          .from('chat_coaches')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true });

        if (coachError) throw coachError;
        setCoachEvals(coachData || []);
      } catch (err) {
        console.error('Error fetching chat data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [chatId]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar pageTitle="Chat Replay" pageSummary="View chat history and analysis" />
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

  if (error || !chat) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar pageTitle="Chat Replay" pageSummary="View chat history and analysis" />
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error || 'Chat not found'}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar pageTitle="Chat Replay" pageSummary="View chat history and analysis" />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat Session
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {formatDateTime(chat.created_at)}
                  {chat.ended_at && (
                    <>
                      {' - '}
                      {formatDateTime(chat.ended_at)}
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-3">
                <Badge variant="outline">Organizer: {chat.organizer_mode}</Badge>
                <Badge variant="outline">Attendee: {chat.attendee_mode}</Badge>
                <Badge variant={chat.ended_at ? 'default' : 'secondary'}>{chat.ended_at ? 'Completed' : 'In Progress'}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* System Prompts Section */}
              {(chat.organizer_system_prompt || chat.attendee_system_prompt) && (
                <Collapsible open={systemPromptsOpen} onOpenChange={setSystemPromptsOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start p-0 h-auto font-semibold">
                      <div className="flex items-center gap-2">
                        {systemPromptsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
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
              {messages.length > 0 && (
                <Collapsible open={messagesOpen} onOpenChange={setMessagesOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start p-0 h-auto font-semibold">
                      <div className="flex items-center gap-2">
                        {messagesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        Conversation ({messages.length} messages)
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.persona === 'organizer' ? 'justify-end' : 'justify-start'}`}>
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
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Coach Evaluations Section */}
              {coachEvals.length > 0 && (
                <Collapsible open={coachEvalsOpen} onOpenChange={setCoachEvalsOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start p-0 h-auto font-semibold">
                      <div className="flex items-center gap-2">
                        {coachEvalsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        <Zap className="h-4 w-4 text-red-600" />
                        Coach Evaluations
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="space-y-4">
                      {coachEvals.map((evaluation) => {
                        const { score, content } = parseScore(evaluation.coach_result);
                        return (
                          <div key={evaluation.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-300 rounded-full" />
                                <span className="text-sm font-medium text-gray-900">Coach Evaluation</span>
                              </div>
                              {score !== null && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBadgeColor(score)}`}>{score}/5</span>
                              )}
                            </div>
                            <div className="mb-3">
                              <h5 className="text-xs font-medium text-gray-600 mb-1">Coach Prompt:</h5>
                              <div className="text-xs text-gray-700 bg-white p-2 rounded border">{evaluation.coach_prompt}</div>
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

              {messages.length === 0 && coachEvals.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No messages or evaluations found for this chat.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatReplay;
