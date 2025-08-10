import Navbar from '@/components/layout/Navbar';
import PromptBuilder, { type PromptBuilderRef } from '@/components/PromptBuilder';
import PromptBuilderSuite, { type AttendeeData, type PromptBuilderSuiteRef } from '@/components/PromptBuilderSuite';
import { useParticipant } from '@/hooks/useParticipant';
import { type PromptBuilderData } from '@/utils/promptBuilder';
import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import ConversationSuite from './ConversationSuite';

type ParticipantMode = 'human' | 'ai';

interface Message {
  id: string;
  sender: 'organizer' | 'attendee';
  content: string;
  timestamp: Date;
}

interface WorkbenchState {
  userTextInput: string;
  organizerPrompt: PromptBuilderData | null;
  attendeePrompt: PromptBuilderData | null;
  organizerPromptText: string;
  attendeePromptText: string;
  organizerFirstMessage: string;
  attendeeData: { systemPrompt: string; firstMessage: string; displayName: string };
  attendees: AttendeeData[];
  organizerHumanOrAi: 'human' | 'ai';
  attendeeHumanOrAi: 'human' | 'ai';
  speaker: 'organizer' | 'attendee';
  conversationHistory: Message[];
  paused: boolean;
}

type WorkbenchAction =
  | { type: 'SET_USER_TEXT_INPUT'; payload: string }
  | { type: 'START_CONVERSATION'; payload: { firstMessage: string } }
  | { type: 'SEND_MESSAGE'; payload: { sender: 'organizer' | 'attendee'; content: string } }
  | { type: 'TOGGLE_MODE'; payload: { participant: 'organizer' | 'attendee'; mode: 'human' | 'ai' } }
  | { type: 'SELECT_PROMPT'; payload: { participant: 'organizer' | 'attendee'; prompt: PromptBuilderData | null } }
  | { type: 'UPDATE_PROMPT'; payload: { participant: 'organizer' | 'attendee'; promptText: string } }
  | { type: 'UPDATE_ORGANIZER_DATA'; payload: { systemPrompt: string; firstMessage: string } }
  | { type: 'UPDATE_ATTENDEES'; payload: AttendeeData[] }
  | { type: 'TOGGLE_PAUSE' };

function workbenchReducer(state: WorkbenchState, action: WorkbenchAction): WorkbenchState {
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

    case 'SELECT_PROMPT':
      return {
        ...state,
        [action.payload.participant === 'organizer' ? 'organizerPrompt' : 'attendeePrompt']: action.payload.prompt,
      };

    case 'UPDATE_PROMPT':
      return {
        ...state,
        [action.payload.participant === 'organizer' ? 'organizerPromptText' : 'attendeePromptText']: action.payload.promptText,
      };

    case 'UPDATE_ORGANIZER_DATA':
      return {
        ...state,
        organizerPromptText: action.payload.systemPrompt,
        organizerFirstMessage: action.payload.firstMessage,
      };

    case 'UPDATE_ATTENDEES':
      return {
        ...state,
        attendees: action.payload,
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

const Workbench = () => {
  const [state, dispatch] = useReducer(workbenchReducer, {
    userTextInput: '',
    organizerPrompt: null,
    attendeePrompt: null,
    organizerPromptText: '',
    attendeePromptText: '',
    organizerFirstMessage: '',
    attendeeData: { systemPrompt: '', firstMessage: '', displayName: 'attendee' },
    attendees: [{ id: '1', displayName: 'attendee', systemPrompt: '', firstMessage: '' }],
    organizerHumanOrAi: 'ai',
    attendeeHumanOrAi: 'ai',
    speaker: 'organizer',
    conversationHistory: [],
    paused: false,
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const organizerRef = useRef<PromptBuilderRef>(null);
  const attendeeRef = useRef<PromptBuilderSuiteRef>(null);

  // Helper for getting human text input
  const getTextInput = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      // TODO: Implement proper human input handling
      resolve(state.userTextInput);
    });
  }, [state.userTextInput]);

  // Initialize participant hooks
  const organizerParticipant = useParticipant(
    state.organizerHumanOrAi,
    state.organizerFirstMessage || null,
    state.organizerPromptText,
    getTextInput,
  );
  const attendeeParticipant = useParticipant(state.attendeeHumanOrAi, null, state.attendeePromptText, getTextInput);

  const otherSpeaker = state.speaker === 'organizer' ? 'attendee' : 'organizer';
  const currentSpeakerHumanOrAi = state.speaker === 'organizer' ? state.organizerHumanOrAi : state.attendeeHumanOrAi;
  const otherSpeakerHumanOrAi = state.speaker === 'organizer' ? state.attendeeHumanOrAi : state.organizerHumanOrAi;
  const isAwaitingAiResponse = state.conversationHistory.length > 0 && currentSpeakerHumanOrAi === 'ai';

  const hasStarted = () => state.conversationHistory.length > 0;

  useEffect(() => {
    console.log('Workbench: useEffect scrollIntoView triggered', {
      conversationHistoryLength: state.conversationHistory.length,
      isAwaitingAiResponse,
    });
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.conversationHistory, isAwaitingAiResponse]);

  useEffect(() => {
    console.log('Workbench: useEffect conversation loop triggered', {
      conversationHistoryLength: state.conversationHistory.length,
      paused: state.paused,
      speaker: state.speaker,
      currentSpeakerHumanOrAi,
    });
    if (state.conversationHistory.length === 0) return; // No conversation yet
    if (state.paused) return; // Conversation is paused
    if (currentSpeakerHumanOrAi === 'human') return; // Don't auto-respond for human speakers

    const lastMessage = state.conversationHistory[state.conversationHistory.length - 1];
    // Don't respond if the last message was from the current speaker (avoid self-response loop)
    if (lastMessage.sender === state.speaker) return;

    setTimeout(async () => {
      console.log('Workbench: async conversation loop timeout called', { speaker: state.speaker });
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

  // Helper method for handling participant responses
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
    console.log('Workbench: async sendHumanMessage() called', {
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

  const handleModeToggle = (participantId: 'organizer' | 'attendee', mode: ParticipantMode) => {
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

  const handleOrganizerPromptChange = useCallback((data: { systemPrompt: string; firstMessage: string }) => {
    dispatch({ type: 'UPDATE_ORGANIZER_DATA', payload: data });
  }, []);

  const handleAttendeesChange = useCallback((attendees: AttendeeData[]) => {
    dispatch({ type: 'UPDATE_ATTENDEES', payload: attendees });
  }, []);

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
    <div className="min-h-screen bg-gray-50">
      <Navbar pageTitle="Workbench" pageSummary="Develop AI organizer prompts" />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ height: 'calc(100vh - 120px)' }}>
            {/* Participants Column */}
            <div className="space-y-4 h-full overflow-y-auto">
              <h2 className="font-semibold mb-4">Participants</h2>
              <div className="w-full space-y-4">
                <PromptBuilder
                  ref={organizerRef}
                  persona="organizer"
                  color="bg-purple-200"
                  defaultOpen={true}
                  onDataChange={handleOrganizerPromptChange}
                />

                <PromptBuilderSuite
                  ref={attendeeRef}
                  name="attendee"
                  color="bg-orange-200"
                  defaultOpen={true}
                  onAttendeesChange={handleAttendeesChange}
                />
              </div>
            </div>

            {/* Conversation Column */}
            <div className="space-y-4 h-full">
              <ConversationSuite
                organizerHumanOrAi={state.organizerHumanOrAi}
                attendees={state.attendees}
                conversationHistory={state.conversationHistory}
                paused={state.paused}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workbench;
