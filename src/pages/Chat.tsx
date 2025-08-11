import { useParticipant } from '@/hooks/useParticipant';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Textarea } from '@/ui/textarea';
import { generateTimestampId } from '@/utils/id';
import { PromptBuilderData } from '@/utils/promptBuilder';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ChevronRight, MessageCircle, Send, User } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WorkbenchRequest, WorkbenchResponse } from '@/types/edge-function-types';

interface Message {
  id: string;
  sender: 'organizer' | 'attendee';
  content: string;
  timestamp: Date;
}

interface ChatState {
  history: Message[];
  speaker: 'organizer' | 'attendee';
  userTextInput: string;
  lastMessageIndexForResponse: number;
}

type ChatAction =
  | { type: 'SET_USER_TEXT_INPUT'; payload: string }
  | { type: 'SEND_MESSAGE'; payload: { sender: 'organizer' | 'attendee'; content: string } }
  | { type: 'MARK_MESSAGE_FOR_RESPONSE'; payload: { messageIndex: number } };

function reducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_USER_TEXT_INPUT':
      return { ...state, userTextInput: action.payload };

    case 'SEND_MESSAGE': {
      const newHistory = [...state.history, constructMessage(action.payload.sender, action.payload.content)];
      return {
        ...state,
        history: newHistory,
        userTextInput: action.payload.sender === state.speaker ? '' : state.userTextInput,
        speaker: action.payload.sender === 'organizer' ? 'attendee' : 'organizer',
      };
    }

    case 'MARK_MESSAGE_FOR_RESPONSE':
      return {
        ...state,
        lastMessageIndexForResponse: action.payload.messageIndex,
      };

    default:
      return state;
  }
}

function constructMessage(sender: 'organizer' | 'attendee', content: string) {
  return {
    id: generateTimestampId(sender),
    sender,
    content,
    timestamp: new Date(),
  };
}

interface ChatStatus {
  started?: boolean;
  messageCount?: number;
  lastActivity?: Date;
}

interface ChatProps {
  attendeeDisplayName: string;
  organizerPromptText: string;
  organizerFirstMessage: string;
  attendeeSystemPrompt: string;
  organizerMode: 'human' | 'ai';
  attendeeMode: 'human' | 'ai';
  controlStatus: 'ready' | 'started' | 'paused' | 'ended';
  onStatusUpdate: (updates: ChatStatus) => void;
  coaches?: PromptBuilderData[];
  defaultOpen?: boolean;
}

const AiThinking = ({ participant }: { participant: 'organizer' | 'attendee' }) => (
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

            // Handle response - could be in message property or directly as string
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

  if (coaches.length === 0 || messages.length === 0 || controlStatus === 'ready') {
    return null;
  }

  return (
    <div className="border-t bg-gray-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bot size={16} className="text-red-600" />
        <h4 className="font-medium text-gray-900">Coach Evaluations</h4>
      </div>
      <div className="space-y-3">
        {coaches.map((coach) => (
          <div key={coach.id} className="bg-white border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-200 rounded-full" />
              <span className="text-sm font-medium text-gray-900">{coach.name}</span>
            </div>
            <div className="text-sm text-gray-600 bg-red-50 p-2 rounded">
              {controlStatus !== 'ended' ? (
                <span className="italic">Evaluation will appear here once conversation is complete</span>
              ) : loading ? (
                <span className="italic">Getting evaluation...</span>
              ) : error ? (
                <span className="text-red-600">Error: {error}</span>
              ) : evaluations[coach.id] ? (
                <div className="whitespace-pre-wrap">{evaluations[coach.id]}</div>
              ) : (
                <span className="italic">No evaluation available</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Chat = ({
  attendeeDisplayName,
  organizerPromptText,
  organizerFirstMessage,
  attendeeSystemPrompt,
  organizerMode,
  attendeeMode,
  controlStatus,
  onStatusUpdate,
  coaches = [],
  defaultOpen = true,
}: ChatProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [state, dispatch] = useReducer(reducer, {
    history: [],
    speaker: 'organizer' as const,
    userTextInput: '',
    lastMessageIndexForResponse: -1,
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializationStarted = useRef(false);

  // Helper for getting human text input - memoized with useCallback to prevent useParticipant re-runs
  const getTextInput = useCallback((): Promise<string> => {
    return Promise.resolve(state.userTextInput);
  }, [state.userTextInput]);

  const organizerParticipant = useParticipant(organizerMode, organizerFirstMessage || null, organizerPromptText, getTextInput);
  const attendeeParticipant = useParticipant(attendeeMode, null, attendeeSystemPrompt, getTextInput);
  const participant = useMemo(
    () => (state.speaker === 'organizer' ? organizerParticipant : attendeeParticipant),
    [state.speaker, organizerParticipant, attendeeParticipant],
  );

  const speakerMode = useMemo(
    () => (state.speaker === 'organizer' ? organizerMode : attendeeMode),
    [state.speaker, organizerMode, attendeeMode],
  );

  const isAwaitingAiResponse = useMemo(() => state.history.length > 0 && speakerMode === 'ai', [state.history.length, speakerMode]);

  // If speaker is AI, request message in 1 tick
  useEffect(() => {
    if (
      state.history.length === 0 ||
      state.history[state.history.length - 1].sender === state.speaker ||
      controlStatus !== 'started' ||
      speakerMode === 'human' ||
      state.history.length - 1 <= state.lastMessageIndexForResponse
    ) {
      return;
    }

    console.log('start a timeout with ', state.history.length - 1);

    setTimeout(async () => {
      const lastMessage = state.history[state.history.length - 1];
      const currentMessageIndex = state.history.length - 1;

      // Mark this message as being processed before making the request
      dispatch({
        type: 'MARK_MESSAGE_FOR_RESPONSE',
        payload: { messageIndex: currentMessageIndex },
      });

      try {
        console.log('participant chat, from the big timeout: ', state.history.length - 1);
        const response = await participant.chat(lastMessage.content);
        dispatch({
          type: 'SEND_MESSAGE',
          payload: {
            sender: state.speaker,
            content: response,
          },
        });
      } catch (error) {
        console.error('Error in chat loop:', error);
      }
    }, 0);
  }, [state.history, state.speaker, controlStatus, speakerMode, participant, state.lastMessageIndexForResponse]);

  // Start chat when controlStatus changes to started
  useEffect(() => {
    if (
      controlStatus === 'started' &&
      state.history.length === 0 &&
      organizerMode === 'ai' &&
      state.lastMessageIndexForResponse === -1 &&
      !initializationStarted.current
    ) {
      console.log('Initializing chat with organizer first message');
      initializationStarted.current = true;
      onStatusUpdate({ started: true, lastActivity: new Date() });

      // Mark initialization as in progress to prevent duplicate calls
      dispatch({
        type: 'MARK_MESSAGE_FOR_RESPONSE',
        payload: { messageIndex: 0 },
      });

      organizerParticipant
        .chat(null)
        .then((firstMessage) => {
          console.log('Received organizer first message:', firstMessage);
          dispatch({ type: 'SEND_MESSAGE', payload: { sender: 'organizer', content: firstMessage } });
          onStatusUpdate({ messageCount: 1, lastActivity: new Date() });
        })
        .catch((error) => {
          console.error('Error starting chat:', error);
          initializationStarted.current = false; // Reset on error
        });
    }
  }, [controlStatus, state.history.length, organizerMode, state.lastMessageIndexForResponse, organizerParticipant, onStatusUpdate]);

  // Reset initialization flag when chat is reset
  useEffect(() => {
    if (controlStatus === 'ready') {
      initializationStarted.current = false;
    }
  }, [controlStatus]);

  // Update message count when history changes
  useEffect(() => {
    if (state.history.length > 0) {
      onStatusUpdate({ messageCount: state.history.length, lastActivity: new Date() });
    }
  }, [state.history.length, onStatusUpdate]);

  const sendHumanMessage = useCallback(() => {
    if (!state.userTextInput.trim() || speakerMode === 'ai' || controlStatus !== 'started') return;
    dispatch({ type: 'SEND_MESSAGE', payload: { sender: state.speaker, content: state.userTextInput } });
  }, [controlStatus, speakerMode, state.speaker, state.userTextInput]);

  const sendHumanMessageOnPressEnter = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendHumanMessage();
      }
    },
    [sendHumanMessage],
  );

  const lastMessage = state.history[state.history.length - 1];
  const chatStatus = useMemo(() => {
    if (controlStatus === 'ready') return 'ready';
    if (controlStatus === 'paused') return 'paused';
    if (controlStatus === 'ended') return 'ended';
    if (isAwaitingAiResponse) return 'ai-thinking';
    if (speakerMode === 'human') return 'waiting-human';
    return 'active';
  }, [controlStatus, isAwaitingAiResponse, speakerMode]);

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
      {/* Chat Header - Always Visible */}
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 hover:bg-gray-50 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </motion.div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900 font-sans">Chat with {attendeeDisplayName}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(chatStatus)}`} />
                <span>{getStatusText(chatStatus)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            {state.history.length > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle size={14} />
                <span>{state.history.length} messages</span>
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
              <div className="h-96 overflow-y-auto scroll-smooth p-4 space-y-4 bg-gray-50">
                {state.history.map((message) => (
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
                {controlStatus === 'started' && state.speaker && speakerMode === 'human' && !isAwaitingAiResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${state.speaker === 'organizer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg border-2 border-dashed ${
                        state.speaker === 'organizer' ? 'border-purple-300 bg-purple-50' : 'border-orange-300 bg-orange-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <User size={12} className={state.speaker === 'organizer' ? 'text-purple-400' : 'text-orange-400'} />
                        <span className="text-xs text-gray-500">{state.speaker === 'organizer' ? 'Organizer' : 'Attendee'}</span>
                      </div>
                      <p className="text-sm italic text-gray-500">Waiting for human...</p>
                    </div>
                  </motion.div>
                )}

                {isAwaitingAiResponse && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <AiThinking participant={state.speaker} />
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

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
                            : state.speaker === 'organizer'
                              ? 'Type your message as the organizer...'
                              : 'Type your message as the attendee...'
                      }
                      className={`flex-1 min-h-[40px] max-h-[120px] resize-none ${
                        controlStatus !== 'started' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
                      }`}
                      disabled={controlStatus !== 'started' || isAwaitingAiResponse}
                    />
                    <Button
                      onClick={sendHumanMessage}
                      disabled={controlStatus !== 'started' || !state.userTextInput.trim() || isAwaitingAiResponse}
                      className={`px-4 transition-colors duration-200 ${
                        controlStatus !== 'started'
                          ? 'bg-gray-400 cursor-not-allowed'
                          : state.speaker === 'organizer'
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                      }`}
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              )}

              <CoachResults coaches={coaches} messages={state.history} controlStatus={controlStatus} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default Chat;
