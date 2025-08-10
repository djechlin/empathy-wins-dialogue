import Navbar from '@/components/layout/Navbar';
import PromptBuilder, { type PromptBuilderRef } from '@/components/PromptBuilder';
import PromptBuilderSet from '@/components/PromptBuilderSet';
import { useParticipant } from '@/hooks/useParticipant';
import { Accordion } from '@/ui/accordion';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Textarea } from '@/ui/textarea';
import { type PromptBuilderData } from '@/utils/promptBuilder';
import { Bot, Play, Send, User } from 'lucide-react';
import React, { useEffect, useReducer, useRef } from 'react';

type ParticipantMode = 'human' | 'ai';

interface Message {
  id: string;
  sender: 'organizer' | 'attendee';
  content: string;
  timestamp: Date;
}

interface WorkbenchState {
  userTextInput: string;
  showPromptSets: boolean;
  organizerPrompt: PromptBuilderData | null;
  attendeePrompt: PromptBuilderData | null;
  organizerHumanOrAi: 'human' | 'ai';
  attendeeHumanOrAi: 'human' | 'ai';
  speaker: 'organizer' | 'attendee';
  conversationHistory: Message[];
}

type WorkbenchAction =
  | { type: 'SET_USER_TEXT_INPUT'; payload: string }
  | { type: 'START_CONVERSATION'; payload: { firstMessage: string } }
  | { type: 'SEND_MESSAGE'; payload: { sender: 'organizer' | 'attendee'; content: string; switchSpeaker?: boolean } }
  | { type: 'TOGGLE_MODE'; payload: { participant: 'organizer' | 'attendee'; mode: 'human' | 'ai' } }
  | { type: 'SELECT_PROMPT'; payload: { participant: 'organizer' | 'attendee'; prompt: PromptBuilderData | null } }
  | { type: 'TOGGLE_PROMPT_SETS' };

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
        speaker: action.payload.switchSpeaker ? (action.payload.sender === 'organizer' ? 'attendee' : 'organizer') : state.speaker,
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
        showPromptSets: false,
      };

    case 'TOGGLE_PROMPT_SETS':
      return { ...state, showPromptSets: !state.showPromptSets };

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

const AiThinking = () => (
  <div className="flex justify-start">
    <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-100 border border-gray-200">
      <div className="flex items-center gap-2 mb-1">
        <Bot size={12} className="text-gray-400" />
        <span className="text-xs text-gray-600">AI thinking...</span>
      </div>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

const Workbench = () => {
  const [state, dispatch] = useReducer(workbenchReducer, {
    userTextInput: '',
    showPromptSets: false,
    organizerPrompt: null,
    attendeePrompt: null,
    organizerHumanOrAi: 'ai',
    attendeeHumanOrAi: 'ai',
    speaker: 'organizer',
    conversationHistory: [],
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const organizerRef = useRef<PromptBuilderRef>(null);
  const attendeeRef = useRef<PromptBuilderRef>(null);

  // Helper for getting human text input
  const getTextInput = (): Promise<string> => {
    return new Promise((resolve) => {
      // TODO: Implement proper human input handling
      resolve(state.userTextInput);
    });
  };

  // Initialize participant hooks
  const organizerParticipant = useParticipant(
    state.organizerHumanOrAi,
    organizerRef.current?.getFirstMessage() || null,
    organizerRef.current?.getFullPrompt() || '',
    getTextInput,
  );
  const attendeeParticipant = useParticipant(state.attendeeHumanOrAi, null, attendeeRef.current?.getFullPrompt() || '', getTextInput);

  const otherSpeaker = state.speaker === 'organizer' ? 'attendee' : 'organizer';
  const currentSpeakerHumanOrAi = state.speaker === 'organizer' ? state.organizerHumanOrAi : state.attendeeHumanOrAi;
  const otherSpeakerHumanOrAi = state.speaker === 'organizer' ? state.attendeeHumanOrAi : state.organizerHumanOrAi;
  const isAwaitingAiResponse = state.conversationHistory.length > 0 && currentSpeakerHumanOrAi === 'ai';

  const hasStarted = () => state.conversationHistory.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.conversationHistory, isAwaitingAiResponse]);

  const sendHumanMessage = async () => {
    if (!state.userTextInput.trim() || currentSpeakerHumanOrAi === 'ai') return;

    const userMessage = state.userTextInput;
    dispatch({ type: 'SEND_MESSAGE', payload: { sender: state.speaker, content: userMessage, switchSpeaker: true } });

    if (otherSpeakerHumanOrAi === 'ai') {
      try {
        const response = await handleParticipantResponse(otherSpeaker, 'ai', userMessage);
        dispatch({ type: 'SEND_MESSAGE', payload: { sender: otherSpeaker, content: response } });
      } catch (error) {
        console.error('Error getting AI response:', error);
      }
    }
  };

  // Helper method for handling participant responses
  const handleParticipantResponse = async (
    participantId: 'organizer' | 'attendee',
    mode: 'human' | 'ai',
    message: string,
  ): Promise<string> => {
    if (mode === 'ai') {
      const participant = participantId === 'organizer' ? organizerParticipant : attendeeParticipant;
      return await participant.chat(message);
    } else {
      return await getTextInput();
    }
  };

  const handleModeToggle = (participantId: 'organizer' | 'attendee', mode: ParticipantMode) => {
    if (state.conversationHistory.length > 0) return;

    dispatch({ type: 'TOGGLE_MODE', payload: { participant: participantId, mode } });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendHumanMessage();
    }
  };

  const handleSelectOrganizerPrompt = (prompt: PromptBuilderData) => {
    dispatch({ type: 'SELECT_PROMPT', payload: { participant: 'organizer', prompt } });
  };

  const handleSelectAttendeePrompt = (prompt: PromptBuilderData) => {
    dispatch({ type: 'SELECT_PROMPT', payload: { participant: 'attendee', prompt } });
  };

  const handleCreateNewOrganizer = () => {
    dispatch({ type: 'SELECT_PROMPT', payload: { participant: 'organizer', prompt: null } });
  };

  const handleCreateNewAttendee = () => {
    dispatch({ type: 'SELECT_PROMPT', payload: { participant: 'attendee', prompt: null } });
  };

  const startConversation = async () => {
    if (state.conversationHistory.length > 0) return;

    try {
      if (state.organizerHumanOrAi === 'ai' && organizerRef.current) {
        const firstMessage = organizerRef.current.getFirstMessage() || "Let's start this conversation.";

        dispatch({ type: 'START_CONVERSATION', payload: { firstMessage } });

        if (state.attendeeHumanOrAi === 'ai') {
          const attendeeResponse = await attendeeParticipant.chat(firstMessage);
          dispatch({ type: 'SEND_MESSAGE', payload: { sender: 'attendee', content: attendeeResponse, switchSpeaker: true } });

          const organizerResponse = await organizerParticipant.chat(attendeeResponse);
          dispatch({ type: 'SEND_MESSAGE', payload: { sender: 'organizer', content: organizerResponse, switchSpeaker: true } });
        }
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Participants</h2>
                <Button onClick={() => dispatch({ type: 'TOGGLE_PROMPT_SETS' })} size="sm" variant="outline" className="text-xs">
                  {state.showPromptSets ? 'Edit Current' : 'Browse All'}
                </Button>
              </div>

              {state.showPromptSets ? (
                <div className="space-y-4">
                  <PromptBuilderSet
                    persona="organizer"
                    color="bg-purple-200"
                    onSelectPrompt={handleSelectOrganizerPrompt}
                    onCreateNew={handleCreateNewOrganizer}
                  />
                  <PromptBuilderSet
                    persona="attendee"
                    color="bg-orange-200"
                    onSelectPrompt={handleSelectAttendeePrompt}
                    onCreateNew={handleCreateNewAttendee}
                  />
                </div>
              ) : (
                <Accordion type="multiple" defaultValue={['organizer', 'attendee']} className="w-full space-y-4">
                  <PromptBuilder
                    ref={organizerRef}
                    name="organizer"
                    color="bg-purple-200"
                    showFirstMessage={true}
                  />

                  <PromptBuilder
                    ref={attendeeRef}
                    name="attendee"
                    color="bg-orange-200"
                  />
                </Accordion>
              )}
            </div>

            {/* Conversation Column */}
            <div className="space-y-4 h-full">
              <Card className="h-full flex flex-col">
                <div className="border-b px-4 py-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold">Conversation</h2>
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

                  {isAwaitingAiResponse && <AiThinking />}
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
                        state.organizerHumanOrAi === 'ai' && state.attendeeHumanOrAi === 'ai'
                          ? 'Both participants are in AI mode - conversation runs automatically'
                          : state.speaker === 'organizer'
                            ? 'Type your message as the organizer...'
                            : 'Type your message as the attendee...'
                      }
                      className={`flex-1 min-h-[40px] max-h-[120px] resize-none ${
                        state.organizerHumanOrAi === 'ai' && state.attendeeHumanOrAi === 'ai'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : ''
                      }`}
                      disabled={isAwaitingAiResponse || (state.organizerHumanOrAi === 'ai' && state.attendeeHumanOrAi === 'ai')}
                    />
                    <Button
                      onClick={sendHumanMessage}
                      disabled={
                        !state.userTextInput.trim() ||
                        isAwaitingAiResponse ||
                        (state.organizerHumanOrAi === 'ai' && state.attendeeHumanOrAi === 'ai')
                      }
                      className={`px-4 ${
                        state.organizerHumanOrAi === 'ai' && state.attendeeHumanOrAi === 'ai'
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workbench;
