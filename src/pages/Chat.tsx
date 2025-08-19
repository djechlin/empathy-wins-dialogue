import type { Message } from '@/hooks/useChat';
import { useChat } from '@/hooks/useChat';
import { supabase } from '@/integrations/supabase/client';
import { WorkbenchRequest, WorkbenchResponse } from '@/types/edge-function-types';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Textarea } from '@/ui/textarea';
import { PromptBuilderData } from '@/utils/promptBuilder';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ChevronRight, MessageCircle, Send, User, Zap } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

type ChatMessage = {
  id: string;
  chat_id: string;
  created_at: string;
  message: string;
  persona: string;
};

interface ChatState {
  userTextInput: string;
  userSentQueue: string[];
  pendingPromiseResolve: ((value: string) => void) | null;
}

type ChatAction =
  | { type: 'SET_USER_TEXT_INPUT'; payload: string }
  | { type: 'SEND_USER_MESSAGE'; payload: string }
  | { type: 'SENT_USER_MESSAGE' }
  | { type: 'SET_PENDING_PROMISE'; payload: ((value: string) => void) | null };

function reducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_USER_TEXT_INPUT':
      return { ...state, userTextInput: action.payload };
    case 'SEND_USER_MESSAGE': {
      const newQueue = [...state.userSentQueue, action.payload];
      // Resolve any pending promise with the first message in queue
      if (state.pendingPromiseResolve && newQueue.length > 0) {
        state.pendingPromiseResolve(newQueue[0]);
        return {
          ...state,
          userTextInput: '',
          userSentQueue: newQueue.slice(1),
          pendingPromiseResolve: null,
        };
      }
      return { ...state, userTextInput: '', userSentQueue: newQueue };
    }
    case 'SENT_USER_MESSAGE':
      return { ...state, userSentQueue: state.userSentQueue.slice(1) };
    case 'SET_PENDING_PROMISE':
      return { ...state, pendingPromiseResolve: action.payload };
    default:
      return state;
  }
}
interface ChatStatus {
  started?: boolean;
  messageCount?: number;
  lastActivity?: Date;
}

interface ChatProps {
  attendeePb: PromptBuilderData;
  organizerPb?: PromptBuilderData;
  organizerId?: string;
  organizerMode: 'human' | 'ai';
  attendeeMode: 'human' | 'ai';
  controlStatus: 'ready' | 'started' | 'paused' | 'ended';
  onStatusUpdate: (updates: ChatStatus) => void;
  coaches?: PromptBuilderData[];
  scouts?: PromptBuilderData[];
  defaultOpen?: boolean;
  reuseChatsWithSameAIs?: boolean;
}

const AiThinking = ({ persona: participant }: { persona: 'organizer' | 'attendee' }) => (
  <div className={`flex ${participant === 'organizer' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-xs px-4 py-2 rounded-lg border border-gray-200 ${participant === 'organizer' ? 'bg-purple-100' : 'bg-orange-100'}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Bot size={12} className="text-gray-400" />
        <span className="text-xs text-gray-600">{participant === 'organizer' ? 'Organizer' : 'Attendee'} AI thinking...</span>
      </div>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

const CoachResults = ({
  coaches,
  messages,
  controlStatus,
}: {
  coaches: PromptBuilderData[];
  messages: Message[];
  controlStatus: 'ready' | 'started' | 'paused' | 'ended';
}) => {
  const [evaluations, setEvaluations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (controlStatus === 'ended' && coaches.length > 0 && messages.length > 0) {
      const getCoachEvaluations = async () => {
        setLoading(true);
        setError(null);

        const transcript = messages.map((msg) => `${msg.sender}: ${msg.content}`).join('\n\n');

        const newEvaluations: Record<string, string> = {};

        try {
          for (const coach of coaches) {
            const request: WorkbenchRequest = {
              coach: {
                transcript,
                coach: coach.system_prompt,
              },
            };

            const { data, error: supabaseError } = await supabase.functions.invoke('workbench', {
              body: request,
            });

            if (supabaseError) {
              throw new Error(`Failed to get evaluation for ${coach.name}: ${supabaseError.message}`);
            }

            const response = data as WorkbenchResponse;
            if (response?.error) {
              throw new Error(`Error from workbench: ${response.error}`);
            }

            let evaluation: string;
            if (response?.message) {
              evaluation = response.message;
            } else if (typeof data === 'string') {
              evaluation = data;
            } else {
              evaluation = 'No evaluation available';
            }

            newEvaluations[coach.id] = evaluation;
          }

          setEvaluations(newEvaluations);
        } catch (err) {
          console.error('Error getting coach evaluations:', err);
          setError(err instanceof Error ? err.message : 'Failed to get evaluations');
        } finally {
          setLoading(false);
        }
      };

      getCoachEvaluations();
    }
  }, [controlStatus, coaches, messages]);

  if (coaches.length === 0 || controlStatus === 'ready') {
    return null;
  }

  if (messages.length < 3) {
    return (
      <div className="border-t bg-gray-50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={16} className="text-gray-600" />
          <h4 className="font-medium text-gray-900">Coach Evaluations</h4>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <span className="text-sm text-gray-600 italic">Coach evaluation requires at least 3 messages in the conversation</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t bg-gray-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={16} className="text-red-600" />
        <h4 className="font-medium text-gray-900">Coach Evaluations</h4>
      </div>
      <div className="space-y-3">
        {coaches.map((coach) => {
          const evaluation = evaluations[coach.id];
          const { score, content } = evaluation ? parseScore(evaluation) : { score: null, content: '' };

          return (
            <div key={coach.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full" />
                  <span className="text-sm font-medium text-gray-900">{coach.name}</span>
                </div>
                {score !== null && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBadgeColor(score)}`}>{score}/5</span>
                )}
              </div>
              <div className="text-sm text-gray-600 bg-white p-2 rounded">
                {controlStatus !== 'ended' ? (
                  <span className="italic">Evaluation will appear here once conversation is complete</span>
                ) : loading ? (
                  <span className="italic">Getting evaluation...</span>
                ) : error ? (
                  <span className="text-red-600">Error: {error}</span>
                ) : evaluation ? (
                  <div className="whitespace-pre-wrap">{content || evaluation}</div>
                ) : (
                  <span className="italic">No evaluation available</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ScoutResults = ({
  scouts,
  messages,
  controlStatus,
}: {
  scouts: PromptBuilderData[];
  messages: Message[];
  controlStatus: 'ready' | 'started' | 'paused' | 'ended';
}) => {
  const [evaluations, setEvaluations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (controlStatus === 'ended' && scouts.length > 0 && messages.length > 0) {
      const getScoutEvaluations = async () => {
        setLoading(true);
        setError(null);

        const transcript = messages.map((msg) => `${msg.sender}: ${msg.content}`).join('\n\n');

        const newEvaluations: Record<string, string> = {};

        try {
          for (const scout of scouts) {
            // Combine the static system prompt with the scout's criteria
            const scoutSystemPrompt = "The attendee attended a Bernie Sanders' \"Fighting the Oligarchy\" rally and was re-contacted by an organizer. You will be given a transcript of that conversation as well as a list of user criteria. return a list where you rate the attendee according to each of the user criteria 1-5 as well as a brief, single sentence explaining your recommendation. you can use 3 for no signal and simply state 'No signal'. add a blank line and an overall 1-5 recommendation based on your findings, as well as a single one sentence summary.";
            
            const scoutPromptWithCriteria = `${scoutSystemPrompt}\n\nUser Criteria:\n${scout.system_prompt}`;
            
            const request: WorkbenchRequest = {
              coach: {
                transcript,
                coach: scoutPromptWithCriteria,
              },
            };

            const { data, error: supabaseError } = await supabase.functions.invoke('workbench', {
              body: request,
            });

            if (supabaseError) {
              throw new Error(`Failed to get evaluation for ${scout.name}: ${supabaseError.message}`);
            }

            const response = data as WorkbenchResponse;
            if (response?.error) {
              throw new Error(`Error from workbench: ${response.error}`);
            }

            let evaluation: string;
            if (response?.message) {
              evaluation = response.message;
            } else if (typeof data === 'string') {
              evaluation = data;
            } else {
              evaluation = 'No evaluation available';
            }

            newEvaluations[scout.id] = evaluation;
          }

          setEvaluations(newEvaluations);
        } catch (err) {
          console.error('Error getting scout evaluations:', err);
          setError(err instanceof Error ? err.message : 'Failed to get evaluations');
        } finally {
          setLoading(false);
        }
      };

      getScoutEvaluations();
    }
  }, [controlStatus, scouts, messages]);

  if (scouts.length === 0 || controlStatus === 'ready') {
    return null;
  }

  if (messages.length < 3) {
    return (
      <div className="border-t bg-gray-50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="font-medium text-gray-900">Scout Evaluations</h4>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <span className="text-sm text-gray-600 italic">Scout evaluation requires at least 3 messages in the conversation</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t bg-purple-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <h4 className="font-medium text-gray-900">Scout Evaluations</h4>
        {loading && <div className="text-sm text-purple-600">Evaluating...</div>}
      </div>

      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3">
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      <div className="space-y-3">
        {scouts.map((scout) => {
          const evaluation = evaluations[scout.id];
          const { score, content } = evaluation ? parseScore(evaluation) : { score: null, content: '' };

          return (
            <div key={scout.id} className="bg-white border border-purple-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Scout Evaluation</span>
                {score !== null && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getScoreBadgeColor(score)}`}>Score: {score}/5</span>
                )}
              </div>
              <h5 className="text-xs font-medium text-gray-600 mb-1">Scout Prompt:</h5>
              <p className="text-xs text-gray-500 mb-2 bg-gray-50 p-2 rounded border-l-2 border-purple-300">
                {scout.system_prompt || 'No prompt available'}
              </p>
              <div className="text-sm text-gray-700">
                {content ? <div className="whitespace-pre-wrap">{content}</div> : <span className="italic">No evaluation available</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Chat = ({
  attendeePb,
  organizerPb,
  organizerId,
  organizerMode,
  attendeeMode,
  controlStatus,
  onStatusUpdate,
  coaches = [],
  scouts = [],
  defaultOpen = true,
  reuseChatsWithSameAIs = false,
}: ChatProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [state, dispatch] = useReducer(reducer, {
    userTextInput: '',
    userSentQueue: [],
    pendingPromiseResolve: null,
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const findOrCreateChat = useCallback(
    async (
      organizerPrompt: string,
      attendeePrompt: string,
      organizerFirstMessage: string,
    ): Promise<string | { chatId: string; initialMessages: Message[] }> => {
      // Check if reuse is enabled and both participants are AI
      if (reuseChatsWithSameAIs && organizerMode === 'ai' && attendeeMode === 'ai') {
        try {
          const { data: existingChats, error } = await supabase
            .from('chats')
            .select('id, created_at')
            .eq('organizer_mode', 'ai')
            .eq('attendee_mode', 'ai')
            .eq('organizer_system_prompt', organizerPrompt)
            .eq('organizer_first_message', organizerFirstMessage)
            .eq('attendee_system_prompt', attendeePrompt)
            .order('created_at', { ascending: false })
            .limit(1);

          if (error) {
            console.error('Error finding existing chat:', error);
          } else if (existingChats && existingChats.length > 0) {
            const chatId = existingChats[0].id;
            console.log('Found existing chat, reusing with messages:', chatId);

            // Load existing messages
            const { data: messages, error: messagesError } = await supabase
              .from('chat_messages')
              .select('*')
              .eq('chat_id', chatId)
              .order('created_at', { ascending: true });
            
            console.log('Loaded', messages?.length, 'messages from database for chat', chatId);

            if (messagesError) {
              console.error('Error loading existing messages:', messagesError);
              return chatId; // Fall back to empty chat
            }

            // Convert database messages to chat engine format
            const initialMessages = (messages || []).map((msg: ChatMessage) => ({
              id: msg.id,
              senderIndex: (msg.persona === 'organizer' ? 0 : 1) as 0 | 1,
              sender: msg.persona as 'organizer' | 'attendee',
              content: msg.message,
              timestamp: new Date(msg.created_at),
            }));

            console.log('Rehydrating chat with', initialMessages.length, 'messages');
            console.log('Message IDs:', initialMessages.map(m => m.id));
            return { chatId, initialMessages };
          }
        } catch (error) {
          console.error('Error in findOrCreateChat:', error);
        }
      }

      // Create new chat if no existing chat found or reuse disabled
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          organizer_mode: 'ai',
          organizer_prompt_id: null,
          attendee_mode: 'ai',
          attendee_prompt_id: null,
          organizer_system_prompt: organizerPrompt,
          organizer_first_message: organizerFirstMessage,
          attendee_system_prompt: attendeePrompt,
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      return data.id;
    },
    [reuseChatsWithSameAIs, organizerMode, attendeeMode],
  );

  const getTextInput = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      if (state.userSentQueue.length > 0) {
        const message = state.userSentQueue[0];
        dispatch({ type: 'SENT_USER_MESSAGE' });
        resolve(message);
      } else {
        dispatch({ type: 'SET_PENDING_PROMISE', payload: resolve });
      }
    });
  }, [state.userSentQueue]);

  const chatEngine = useChat(
    [
      organizerPb?.firstMessage
        ? organizerMode === 'ai'
          ? {
              mode: 'ai' as const,
              organizerFirstMessage: organizerPb.firstMessage,
              systemPrompt: organizerPb.system_prompt,
              persona: 'organizer' as const,
              promptLocation: 'ui' as const,
            }
          : {
              mode: 'human' as const,
              organizerFirstMessage: organizerPb.firstMessage,
              systemPrompt: organizerPb.system_prompt,
              getTextInput,
              persona: 'organizer' as const,
            }
        : {
            mode: 'ai' as const,
            organizerFirstMessage: null,
            organizerId: organizerId!,
            systemPrompt: organizerPb?.system_prompt || '',
            persona: 'organizer' as const,
            promptLocation: 'database' as const,
          },
      attendeeMode === 'ai'
        ? {
            mode: 'ai' as const,
            systemPrompt: attendeePb.system_prompt,
            organizerFirstMessage: null,
            persona: 'attendee' as const,
            promptLocation: 'ui' as const,
          }
        : {
            mode: 'human' as const,
            systemPrompt: attendeePb.system_prompt,
            getTextInput,
            organizerFirstMessage: null,
            persona: 'attendee' as const,
          },
    ],
    // Only use findOrCreateChat for AI-only conversations
    organizerMode === 'ai' && attendeeMode === 'ai' ? findOrCreateChat : undefined,
  );

  const aiThinking = useMemo(() => chatEngine.thinking?.mode === 'ai', [chatEngine.thinking]);

  useEffect(() => {
    if (controlStatus === 'ended') {
      chatEngine.end();
    } else if (controlStatus === 'started') {
      chatEngine.start();
    } else if (controlStatus === 'paused') {
      chatEngine.pause();
    }
  }, [controlStatus, chatEngine]);

  useEffect(() => {
    if (chatEngine.history.length > 0) {
      onStatusUpdate({ messageCount: chatEngine.history.length, lastActivity: new Date() });
    }
  }, [chatEngine.history.length, onStatusUpdate]);

  // Notify parent when chat ends internally (e.g., due to {{DONE}})
  useEffect(() => {
    if (chatEngine.controlStatus === 'ended') {
      onStatusUpdate({ messageCount: chatEngine.history.length, lastActivity: new Date() });
    }
  }, [chatEngine.controlStatus, chatEngine.history.length, onStatusUpdate]);

  const sendHumanMessage = useCallback(() => {
    if (!state.userTextInput.trim() || chatEngine.thinking?.mode !== 'human') return;

    dispatch({ type: 'SEND_USER_MESSAGE', payload: state.userTextInput.trim() });
  }, [chatEngine.thinking, state.userTextInput]);

  const sendHumanMessageOnPressEnter = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendHumanMessage();
      }
    },
    [sendHumanMessage],
  );

  const lastMessage = chatEngine.history[chatEngine.history.length - 1];
  const chatStatus = useMemo(() => {
    // Check if chat engine itself has ended (e.g., due to {{DONE}})
    if (chatEngine.controlStatus === 'ended') return 'ended';
    // Otherwise, use parent control status
    if (controlStatus === 'ready') return 'ready';
    if (controlStatus === 'paused') return 'paused';
    if (controlStatus === 'ended') return 'ended';
    if (aiThinking) return 'ai-thinking';
    if (chatEngine.speaker.mode === 'human') return 'waiting-human';
    return 'active';
  }, [controlStatus, aiThinking, chatEngine.speaker, chatEngine.controlStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'ai-thinking':
        return 'bg-blue-500 animate-pulse';
      case 'waiting-human':
        return 'bg-yellow-500 animate-pulse';
      case 'paused':
        return 'bg-orange-500';
      case 'ended':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'ai-thinking':
        return 'AI thinking...';
      case 'waiting-human':
        return 'Waiting for human...';
      case 'paused':
        return 'Paused';
      case 'ended':
        return 'Ended';
      default:
        return 'Ready';
    }
  };

  return (
    <Card className="overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 hover:bg-gray-50 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </motion.div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                {attendeePb.name === 'Human' && <User size={16} className="text-blue-600" />}
                <h3 className="font-medium text-gray-900 font-sans">{attendeePb.name}</h3>
                {attendeePb.name === 'Human' && <span className="text-xs text-gray-500">(manual input)</span>}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(chatStatus)}`} />
                <span>{getStatusText(chatStatus)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            {chatEngine.history.length > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle size={14} />
                <span>{chatEngine.history.length} messages</span>
              </div>
            )}
            {lastMessage && (
              <div className="text-right max-w-48">
                <div className="text-xs text-gray-400">
                  {lastMessage.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  <span className="font-medium">{lastMessage.sender === 'organizer' ? 'Organizer' : 'Attendee'}:</span>{' '}
                  {lastMessage.content}
                </div>
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Expandable Chat Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
              opacity: { duration: 0.2 },
            }}
            className="overflow-hidden"
          >
            <div className="border-t">
              {/* Chat Messages Area */}
              <ScrollToBottom className="h-96 p-4 bg-gray-50" followButtonClassName="hidden">
                <div className="space-y-4">
                  {/* Chat messages */}
                  {chatEngine.history.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${message.sender === 'organizer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                          message.sender === 'organizer' ? 'bg-purple-200 text-gray-900' : 'bg-orange-200 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === 'organizer' ? <User size={12} /> : <Bot size={12} />}
                          <span className="text-xs opacity-75">{message.sender === 'organizer' ? 'Organizer' : 'Attendee'}</span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 text-gray-600">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Show waiting indicator for next expected response */}
                  {controlStatus === 'started' && chatEngine.speaker.mode === 'human' && !aiThinking && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${chatEngine.speaker.persona === 'organizer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg border-2 border-dashed ${
                          chatEngine.speaker.persona === 'organizer' ? 'border-purple-300 bg-purple-50' : 'border-orange-300 bg-orange-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <User size={12} className={chatEngine.speaker.persona === 'organizer' ? 'text-purple-400' : 'text-orange-400'} />
                          <span className="text-xs text-gray-500">
                            {chatEngine.speaker.persona === 'organizer' ? 'Organizer' : 'Attendee'}
                          </span>
                        </div>
                        <p className="text-sm italic text-gray-500">Waiting for human...</p>
                      </div>
                    </motion.div>
                  )}

                  {aiThinking && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <AiThinking persona={chatEngine.speaker.persona} />
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollToBottom>

              {/* Chat Input Area - Hidden in double AI mode */}
              {!(organizerMode === 'ai' && attendeeMode === 'ai') && (
                <div className="border-t p-4 bg-white">
                  <div className="flex space-x-2">
                    <Textarea
                      ref={inputRef}
                      value={state.userTextInput}
                      onChange={(e) => dispatch({ type: 'SET_USER_TEXT_INPUT', payload: e.target.value })}
                      onKeyPress={sendHumanMessageOnPressEnter}
                      placeholder={
                        controlStatus === 'paused'
                          ? 'Chat is paused'
                          : controlStatus === 'ended'
                            ? 'Chat has ended'
                            : chatEngine.speaker.persona === 'organizer'
                              ? 'Type your message as the organizer...'
                              : 'Type your message as the attendee...'
                      }
                      className={`flex-1 min-h-[40px] max-h-[120px] resize-none ${
                        controlStatus !== 'started' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
                      }`}
                      disabled={controlStatus !== 'started'}
                    />
                    <Button
                      onClick={sendHumanMessage}
                      disabled={controlStatus !== 'started' || !state.userTextInput.trim() || chatEngine.thinking?.mode !== 'human'}
                      className={`px-4 transition-colors duration-200 ${
                        controlStatus !== 'started'
                          ? 'bg-gray-400 cursor-not-allowed'
                          : chatEngine.speaker.persona === 'organizer'
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                      }`}
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              )}

              <CoachResults coaches={coaches} messages={chatEngine.history} controlStatus={controlStatus} />
              <ScoutResults scouts={scouts} messages={chatEngine.history} controlStatus={controlStatus} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default Chat;
