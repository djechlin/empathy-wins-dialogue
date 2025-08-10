import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Textarea } from '@/ui/textarea';
import { Bot, Pause, Play, Send, User } from 'lucide-react';
import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { useParticipant } from '@/hooks/useParticipant';

interface Message {
  id: string;
  sender: 'organizer' | 'attendee';
  content: string;
  timestamp: Date;
}

interface ConversationState {
  conversationHistory: Message[];
  paused: boolean;
  speaker: 'organizer' | 'attendee';
  userTextInput: string;
  organizerHumanOrAi: 'human' | 'ai';
  attendeeHumanOrAi: 'human' | 'ai';
}

type ConversationAction =
  | { type: 'SET_USER_TEXT_INPUT'; payload: string }
  | { type: 'START_CONVERSATION'; payload: { firstMessage: string } }
  | { type: 'SEND_MESSAGE'; payload: { sender: 'organizer' | 'attendee'; content: string } }
  | { type: 'TOGGLE_MODE'; payload: { participant: 'organizer' | 'attendee'; mode: 'human' | 'ai' } }
  | { type: 'TOGGLE_PAUSE' };

function conversationReducer(state: ConversationState, action: ConversationAction): ConversationState {
  switch (action.type) {
    case 'SET_USER_TEXT_INPUT':
      return { ...state, userTextInput: action.payload };

    case 'START_CONVERSATION':
      return {
        ...state,
        conversationHistory: [...state.conversationHistory, constructMessage('organizer', action.payload.firstMessage)],
        speaker: 'attendee',
      };

    case 'SEND_MESSAGE':
      return {
        ...state,
        conversationHistory: [...state.conversationHistory, constructMessage(action.payload.sender, action.payload.content)],
        userTextInput: action.payload.sender === state.speaker ? '' : state.userTextInput,
        speaker: action.payload.sender === 'organizer' ? 'attendee' : 'organizer',
      };

    case 'TOGGLE_MODE':
      return {
        ...state,
        [action.payload.participant === 'organizer' ? 'organizerHumanOrAi' : 'attendeeHumanOrAi']: action.payload.mode,
      };

    case 'TOGGLE_PAUSE':
      return { ...state, paused: !state.paused };

    default:
      return state;
  }
}

function constructMessage(sender: 'organizer' | 'attendee', content: string) {
  return {
    id: `${sender}-${Date.now()}`,
    sender,
    content,
    timestamp: new Date(),
  };
}

interface ConversationProps {
  attendeeDisplayName: string;
  organizerPromptText: string;
  organizerFirstMessage: string;
  attendeeSystemPrompt: string;
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

const Conversation = ({
  attendeeDisplayName,
  organizerPromptText,
  organizerFirstMessage,
  attendeeSystemPrompt,
}: ConversationProps) => {
  const [state, dispatch] = useReducer(conversationReducer, {
    conversationHistory: [],
    paused: false,
    speaker: 'organizer' as const,
    userTextInput: '',
    organizerHumanOrAi: 'ai' as const,
    attendeeHumanOrAi: 'ai' as const,
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper for getting human text input
  const getTextInput = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      resolve(state.userTextInput);
    });
  }, [state.userTextInput]);

  // Initialize participant hooks
  const organizerParticipant = useParticipant(
    state.organizerHumanOrAi,
    organizerFirstMessage || null,
    organizerPromptText,
    getTextInput,
  );

  const attendeeParticipant = useParticipant(
    state.attendeeHumanOrAi, 
    null, 
    attendeeSystemPrompt, 
    getTextInput
  );

  const otherSpeaker = state.speaker === 'organizer' ? 'attendee' : 'organizer';
  const currentSpeakerHumanOrAi = state.speaker === 'organizer' ? state.organizerHumanOrAi : state.attendeeHumanOrAi;
  const otherSpeakerHumanOrAi = state.speaker === 'organizer' ? state.attendeeHumanOrAi : state.organizerHumanOrAi;
  const isAwaitingAiResponse = state.conversationHistory.length > 0 && currentSpeakerHumanOrAi === 'ai';

  const hasStarted = () => state.conversationHistory.length > 0;

  // Auto-scroll effect
  useEffect(() => {
    console.log('Conversation: useEffect scrollIntoView triggered', {
      conversationHistoryLength: state.conversationHistory.length,
      isAwaitingAiResponse,
    });
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.conversationHistory, isAwaitingAiResponse]);

  // Conversation loop effect
  useEffect(() => {
    console.log('Conversation: useEffect conversation loop triggered', {
      conversationHistoryLength: state.conversationHistory.length,
      paused: state.paused,
      speaker: state.speaker,
      currentSpeakerHumanOrAi,
    });
    if (state.conversationHistory.length === 0) return;
    if (state.paused) return;
    if (currentSpeakerHumanOrAi === 'human') return;

    const lastMessage = state.conversationHistory[state.conversationHistory.length - 1];
    if (lastMessage.sender === state.speaker) return;

    setTimeout(async () => {
      console.log('Conversation: async conversation loop timeout called', { speaker: state.speaker });
      try {
        const currentParticipant = state.speaker === 'organizer' ? organizerParticipant : attendeeParticipant;
        const response = await currentParticipant.chat(lastMessage.content);

        dispatch({
          type: 'SEND_MESSAGE',
          payload: {
            sender: state.speaker,
            content: response,
          },
        });
      } catch (error) {
        console.error('Error in conversation loop:', error);
      }
    }, 0);
  }, [state.conversationHistory, state.speaker, state.paused, currentSpeakerHumanOrAi, organizerParticipant, attendeeParticipant]);

  const handleParticipantResponse = useCallback(
    async (participantId: 'organizer' | 'attendee', mode: 'human' | 'ai', message: string): Promise<string> => {
      if (mode === 'ai') {
        const participant = participantId === 'organizer' ? organizerParticipant : attendeeParticipant;
        return await participant.chat(message);
      } else {
        return await getTextInput();
      }
    },
    [organizerParticipant, attendeeParticipant, getTextInput],
  );

  const sendHumanMessage = useCallback(async () => {
    console.log('Conversation: async sendHumanMessage() called', {
      userTextInputLength: state.userTextInput.trim().length,
      currentSpeakerHumanOrAi,
      paused: state.paused,
    });
    if (!state.userTextInput.trim() || currentSpeakerHumanOrAi === 'ai' || state.paused) return;

    const userMessage = state.userTextInput;
    dispatch({ type: 'SEND_MESSAGE', payload: { sender: state.speaker, content: userMessage } });

    if (otherSpeakerHumanOrAi === 'ai') {
      try {
        const response = await handleParticipantResponse(otherSpeaker, 'ai', userMessage);
        dispatch({ type: 'SEND_MESSAGE', payload: { sender: otherSpeaker, content: response } });
      } catch (error) {
        console.error('Error getting AI response:', error);
      }
    }
  }, [
    state.userTextInput,
    currentSpeakerHumanOrAi,
    state.paused,
    state.speaker,
    otherSpeakerHumanOrAi,
    handleParticipantResponse,
    otherSpeaker,
  ]);

  const handleModeToggle = (participantId: 'organizer' | 'attendee', mode: 'human' | 'ai') => {
    if (state.conversationHistory.length > 0) return;
    dispatch({ type: 'TOGGLE_MODE', payload: { participant: participantId, mode } });
  };

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendHumanMessage();
      }
    },
    [sendHumanMessage],
  );

  const startConversation = async () => {
    if (state.conversationHistory.length > 0) return;

    try {
      if (state.organizerHumanOrAi === 'ai') {
        const firstMessage = await organizerParticipant.chat(null);
        dispatch({ type: 'START_CONVERSATION', payload: { firstMessage } });
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="border-b px-4 py-3 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Chat with {attendeeDisplayName}</h2>
          {hasStarted() && (
            <Button onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })} size="sm" variant={state.paused ? 'default' : 'outline'} className="text-xs px-3">
              {state.paused ? (
                <>
                  <Play size={12} className="mr-1" />
                  Resume
                </>
              ) : (
                <>
                  <Pause size={12} className="mr-1" />
                  Pause
                </>
              )}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Organizer:</span>
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (state.conversationHistory.length === 0) {
                    handleModeToggle('organizer', 'human');
                  }
                }}
                disabled={state.conversationHistory.length > 0}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                  state.conversationHistory.length > 0
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                    : state.organizerHumanOrAi === 'human'
                      ? 'bg-white text-gray-900 shadow-sm ring-2 ring-blue-500'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User size={12} />
                Human
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (state.conversationHistory.length === 0) {
                    handleModeToggle('organizer', 'ai');
                  }
                }}
                disabled={state.conversationHistory.length > 0}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                  state.conversationHistory.length > 0
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                    : state.organizerHumanOrAi === 'ai'
                      ? 'bg-white text-gray-900 shadow-sm ring-2 ring-blue-500'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Bot size={12} />
                AI
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Attendee:</span>
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (state.conversationHistory.length === 0) {
                    handleModeToggle('attendee', 'human');
                  }
                }}
                disabled={state.conversationHistory.length > 0}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                  state.conversationHistory.length > 0
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                    : state.attendeeHumanOrAi === 'human'
                      ? 'bg-white text-gray-900 shadow-sm ring-2 ring-blue-500'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User size={12} />
                Human
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (state.conversationHistory.length === 0) {
                    handleModeToggle('attendee', 'ai');
                  }
                }}
                disabled={state.conversationHistory.length > 0}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                  state.conversationHistory.length > 0
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                    : state.attendeeHumanOrAi === 'ai'
                      ? 'bg-white text-gray-900 shadow-sm ring-2 ring-blue-500'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Bot size={12} />
                AI
              </button>
            </div>
          </div>
        </div>

        {!hasStarted() && (
          <div className="mt-2">
            <Button onClick={startConversation} size="sm" className="px-4">
              <Play size={16} className="mr-2" />
              Start
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.conversationHistory.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'organizer' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
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
          </div>
        ))}

        {/* Show waiting indicator for next expected response */}
        {hasStarted() &&
          state.speaker &&
          currentSpeakerHumanOrAi === 'human' &&
          !isAwaitingAiResponse &&
          (() => {
            return (
              <div className={`flex ${state.speaker === 'organizer' ? 'justify-end' : 'justify-start'}`}>
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
              </div>
            );
          })()}

        {isAwaitingAiResponse && <AiThinking participant={state.speaker} />}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Textarea
            ref={inputRef}
            value={state.userTextInput}
            onChange={(e) => dispatch({ type: 'SET_USER_TEXT_INPUT', payload: e.target.value })}
            onKeyPress={handleKeyPress}
            placeholder={
              state.paused
                ? 'Conversation is paused'
                : state.organizerHumanOrAi === 'ai' && state.attendeeHumanOrAi === 'ai'
                  ? 'Both participants are in AI mode - conversation runs automatically'
                  : state.speaker === 'organizer'
                    ? 'Type your message as the organizer...'
                    : 'Type your message as the attendee...'
            }
            className={`flex-1 min-h-[40px] max-h-[120px] resize-none ${
              state.paused || (state.organizerHumanOrAi === 'ai' && state.attendeeHumanOrAi === 'ai') ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
            }`}
            disabled={state.paused || isAwaitingAiResponse || (state.organizerHumanOrAi === 'ai' && state.attendeeHumanOrAi === 'ai')}
          />
          <Button
            onClick={sendHumanMessage}
            disabled={
              state.paused || !state.userTextInput.trim() || isAwaitingAiResponse || (state.organizerHumanOrAi === 'ai' && state.attendeeHumanOrAi === 'ai')
            }
            className={`px-4 ${
              state.paused || (state.organizerHumanOrAi === 'ai' && state.attendeeHumanOrAi === 'ai')
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
    </Card>
  );
};

export default Conversation;
