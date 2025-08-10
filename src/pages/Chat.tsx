import { useParticipant } from '@/hooks/useParticipant';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Textarea } from '@/ui/textarea';
import { generateTimestampId } from '@/utils/id';
import { Bot, Send, User } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

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
  | { type: 'START_CHAT'; payload: { firstMessage: string } }
  | { type: 'SEND_MESSAGE'; payload: { sender: 'organizer' | 'attendee'; content: string } };

function reducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_USER_TEXT_INPUT':
      return { ...state, userTextInput: action.payload };

    case 'START_CHAT':
      return {
        ...state,
        history: [...state.history, constructMessage('organizer', action.payload.firstMessage)],
        speaker: 'attendee',
      };

    case 'SEND_MESSAGE':
      return {
        ...state,
        history: [...state.history, constructMessage(action.payload.sender, action.payload.content)],
        userTextInput: action.payload.sender === state.speaker ? '' : state.userTextInput,
        speaker: action.payload.sender === 'organizer' ? 'attendee' : 'organizer',
        lastMessageIndexForResponse: state.history.length,
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
  paused: boolean;
  hasStarted: boolean;
  onStatusUpdate: (updates: ChatStatus) => void;
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

const Chat = ({
  attendeeDisplayName,
  organizerPromptText,
  organizerFirstMessage,
  attendeeSystemPrompt,
  organizerMode,
  attendeeMode,
  paused,
  hasStarted,
  onStatusUpdate,
}: ChatProps) => {
  const [state, dispatch] = useReducer(reducer, {
    history: [],
    speaker: 'organizer' as const,
    userTextInput: '',
    lastMessageIndexForResponse: -1,
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper for getting human text input
  const getTextInput = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      resolve(state.userTextInput);
    });
  }, [state.userTextInput]);

  const organizerParticipant = useParticipant(organizerMode, organizerFirstMessage || null, organizerPromptText, getTextInput);
  const attendeeParticipant = useParticipant(attendeeMode, null, attendeeSystemPrompt, getTextInput);
  const participant = useMemo(
    () => (state.speaker === 'organizer' ? organizerParticipant : attendeeParticipant),
    [state.speaker, organizerParticipant, attendeeParticipant],
  );

  const speakerMode = state.speaker === 'organizer' ? organizerMode : attendeeMode;
  const isAwaitingAiResponse = state.history.length > 0 && speakerMode === 'ai';

  // If speaker is AI, request message in 1 tick
  useEffect(() => {
    const currentMessageIndex = state.history.length - 1;
    if (
      state.history.length === 0 ||
      state.history[state.history.length - 1].sender === state.speaker ||
      paused ||
      speakerMode === 'human' ||
      currentMessageIndex <= state.lastMessageIndexForResponse
    ) {
      return;
    }

    setTimeout(async () => {
      const lastMessage = state.history[state.history.length - 1];
      try {
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
  }, [state.history, state.speaker, paused, speakerMode, participant, state.lastMessageIndexForResponse]);

  // Start chat when hasStarted prop changes to true
  useEffect(() => {
    if (hasStarted && state.history.length === 0 && organizerMode === 'ai' && state.lastMessageIndexForResponse === -1) {
      onStatusUpdate({ started: true, lastActivity: new Date() });
      organizerParticipant
        .chat(null)
        .then((firstMessage) => {
          dispatch({ type: 'START_CHAT', payload: { firstMessage } });
          onStatusUpdate({ messageCount: 1, lastActivity: new Date() });
        })
        .catch((error) => {
          console.error('Error starting chat:', error);
        });
    }
  }, [hasStarted, state.history.length, organizerMode, organizerParticipant, onStatusUpdate, state.lastMessageIndexForResponse]);

  // Update message count when history changes
  useEffect(() => {
    if (state.history.length > 0) {
      onStatusUpdate({ messageCount: state.history.length, lastActivity: new Date() });
    }
  }, [state.history.length, onStatusUpdate]);

  const sendHumanMessage = useCallback(() => {
    if (!state.userTextInput.trim() || speakerMode === 'ai' || paused) return;
    dispatch({ type: 'SEND_MESSAGE', payload: { sender: state.speaker, content: state.userTextInput } });
  }, [paused, speakerMode, state.speaker, state.userTextInput]);

  const sendHumanMessageOnPressEnter = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendHumanMessage();
      }
    },
    [sendHumanMessage],
  );

  return (
    <Card className="h-full flex flex-col">
      <div className="border-b px-2 py-2 bg-gray-50">
        <h2 className="font-semibold text-center">Chat with {attendeeDisplayName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto scroll-smooth p-4 space-y-4">
        {state.history.map((message) => (
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
        {hasStarted &&
          state.speaker &&
          speakerMode === 'human' &&
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
            onKeyPress={sendHumanMessageOnPressEnter}
            placeholder={
              paused
                ? 'Chat is paused'
                : organizerMode === 'ai' && attendeeMode === 'ai'
                  ? 'Both participants are in AI mode - chat runs automatically'
                  : state.speaker === 'organizer'
                    ? 'Type your message as the organizer...'
                    : 'Type your message as the attendee...'
            }
            className={`flex-1 min-h-[40px] max-h-[120px] resize-none ${
              paused || (organizerMode === 'ai' && attendeeMode === 'ai') ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
            }`}
            disabled={paused || isAwaitingAiResponse || (organizerMode === 'ai' && attendeeMode === 'ai')}
          />
          <Button
            onClick={sendHumanMessage}
            disabled={paused || !state.userTextInput.trim() || isAwaitingAiResponse || (organizerMode === 'ai' && attendeeMode === 'ai')}
            className={`px-4 ${
              paused || (organizerMode === 'ai' && attendeeMode === 'ai')
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

export default Chat;
