import React, { useState, useCallback, useReducer, useEffect, useRef } from 'react';
import Conversation from './Conversation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AttendeeData } from '@/components/PromptBuilderSuite';
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

interface ConversationSuiteProps {
  // Array of attendees
  attendees: AttendeeData[];

  // Organizer data
  organizerPromptText: string;
  organizerFirstMessage: string;
}

const ConversationSuite = ({
  attendees,
  organizerPromptText,
  organizerFirstMessage,
}: ConversationSuiteProps) => {
  const [state, dispatch] = useReducer(conversationReducer, {
    conversationHistory: [],
    paused: false,
    speaker: 'organizer' as const,
    userTextInput: '',
    organizerHumanOrAi: 'ai' as const,
    attendeeHumanOrAi: 'ai' as const,
  });

  const [openAttendees, setOpenAttendees] = useState<Record<string, boolean>>({
    [attendees[0]?.id || '1']: true,
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

  // For now, use the first attendee's data for the attendee participant
  const firstAttendee = attendees[0] || { systemPrompt: '', firstMessage: '', displayName: 'attendee' };
  const attendeeParticipant = useParticipant(
    state.attendeeHumanOrAi, 
    null, 
    firstAttendee.systemPrompt, 
    getTextInput
  );

  const otherSpeaker = state.speaker === 'organizer' ? 'attendee' : 'organizer';
  const currentSpeakerHumanOrAi = state.speaker === 'organizer' ? state.organizerHumanOrAi : state.attendeeHumanOrAi;
  const otherSpeakerHumanOrAi = state.speaker === 'organizer' ? state.attendeeHumanOrAi : state.organizerHumanOrAi;
  const isAwaitingAiResponse = state.conversationHistory.length > 0 && currentSpeakerHumanOrAi === 'ai';

  const hasStarted = () => state.conversationHistory.length > 0;

  const toggleAttendee = useCallback((attendeeId: string) => {
    setOpenAttendees((prev) => ({
      ...prev,
      [attendeeId]: !prev[attendeeId],
    }));
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    console.log('ConversationSuite: useEffect scrollIntoView triggered', {
      conversationHistoryLength: state.conversationHistory.length,
      isAwaitingAiResponse,
    });
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.conversationHistory, isAwaitingAiResponse]);

  // Conversation loop effect
  useEffect(() => {
    console.log('ConversationSuite: useEffect conversation loop triggered', {
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
      console.log('ConversationSuite: async conversation loop timeout called', { speaker: state.speaker });
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
    console.log('ConversationSuite: async sendHumanMessage() called', {
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
    <div className="space-y-4">
      <h3 className="font-semibold">Conversations</h3>

      {attendees.map((attendee) => (
        <Collapsible key={attendee.id} open={openAttendees[attendee.id] || false} onOpenChange={() => toggleAttendee(attendee.id)}>
          <CollapsibleTrigger asChild>
            <div className="w-full justify-start text-sm font-medium p-2 h-auto cursor-pointer hover:bg-gray-100 rounded-md flex items-center">
              <ChevronRight className={cn('h-4 w-4 mr-2 transition-transform', openAttendees[attendee.id] ? 'rotate-90' : '')} />
              Chat with {attendee.displayName}
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2">
            <Conversation
              attendeeDisplayName={attendee.displayName}
              conversationHistory={state.conversationHistory}
              paused={state.paused}
              organizerHumanOrAi={state.organizerHumanOrAi}
              attendeeHumanOrAi={state.attendeeHumanOrAi}
              speaker={state.speaker}
              userTextInput={state.userTextInput}
              isAwaitingAiResponse={isAwaitingAiResponse}
              onTogglePause={() => dispatch({ type: 'TOGGLE_PAUSE' })}
              onModeToggle={handleModeToggle}
              onStartConversation={startConversation}
              onUserTextInputChange={(value) => dispatch({ type: 'SET_USER_TEXT_INPUT', payload: value })}
              onKeyPress={handleKeyPress}
              onSendMessage={sendHumanMessage}
              inputRef={inputRef}
              messagesEndRef={messagesEndRef}
              hasStarted={hasStarted}
            />
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default ConversationSuite;
