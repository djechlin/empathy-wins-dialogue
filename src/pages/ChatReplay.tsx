import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Bot, User, MessageCircle, Clock, Zap } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Chat Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat Session
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {new Date(chat.created_at).toLocaleString()}
                  {chat.ended_at && (
                    <>
                      {' - '}
                      {new Date(chat.ended_at).toLocaleString()}
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Badge variant="outline">Organizer: {chat.organizer_mode}</Badge>
                <Badge variant="outline">Attendee: {chat.attendee_mode}</Badge>
                <Badge variant={chat.ended_at ? 'default' : 'secondary'}>{chat.ended_at ? 'Completed' : 'In Progress'}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* System Prompts */}
          {(chat.organizer_system_prompt || chat.attendee_system_prompt) && (
            <Card>
              <CardHeader>
                <CardTitle>System Prompts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Conversation ({messages.length} messages)</CardTitle>
              </CardHeader>
              <CardContent>
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
                        <p className="text-xs mt-1 text-gray-600">
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Coach Evaluations */}
          {coachEvals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-red-600" />
                  Coach Evaluations
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          )}

          {messages.length === 0 && coachEvals.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No messages or evaluations found for this chat.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatReplay;
