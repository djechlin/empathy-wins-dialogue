import Navbar from '@/components/layout/Navbar';
import PromptBuilder, { type PromptBuilderRef } from '@/components/PromptBuilder';
import PromptBuilderSet from '@/components/PromptBuilderSet';
import { Accordion } from '@/ui/accordion';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Textarea } from '@/ui/textarea';
import { Bot, Play, Send, User } from 'lucide-react';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { type PromptBuilderData } from '@/utils/promptBuilder';
import { useAiParticipant } from '@/hooks/useAiParticipant';

// Default prompts
const DEFAULT_ORGANIZER_PROMPT = `You are an experienced political organizer reaching out to someone who attended a recent Bernie Sanders/AOC "Fight Oligarchy" event. Your goal is to follow up and try to get them more involved in future activism.

Be warm, personal, and persuasive. Build rapport and make a compelling case for why their continued involvement matters.`;

const DEFAULT_ATTENDEE_PROMPT = `You are someone who attended a Bernie Sanders/AOC "Fight Oligarchy" event. You're politically aware but not deeply engaged. You voted against Trump but aren't super active in politics.

You get that Trump is a problem but think protests are low impact. You're kind of bored and don't have much to do. You should be somewhat skeptical at first but can be convinced to get more involved with the right approach.`;

const DEFAULT_VARIABLES = {
  survey_questions: `1. How likely are you to attend another political event in the next month?
2. What issues are you most passionate about?
3. Would you be interested in volunteering for upcoming campaigns?`,
  'Event Context': 'Bernie Sanders/AOC "Fight Oligarchy" rally',
  'Target Outcome': 'Get attendee to volunteer for next campaign or attend another event',
};

type ParticipantId = 'organizer' | 'attendee';
type ParticipantMode = 'human' | 'ai';

interface Message {
  id: string;
  sender: ParticipantId;
  content: string;
  timestamp: Date;
}

const Workbench = () => {
  const [inputValue, setInputValue] = useState('');
  const [showPromptSets, setShowPromptSets] = useState(false);
  const [currentOrganizerPrompt, setCurrentOrganizerPrompt] = useState<PromptBuilderData | null>(null);
  const [currentAttendeePrompt, setCurrentAttendeePrompt] = useState<PromptBuilderData | null>(null);
  const [organizerMode, setOrganizerMode] = useState<ParticipantMode>('ai');
  const [attendeeMode, setAttendeeMode] = useState<ParticipantMode>('ai');
  const [currentSpeaker, setCurrentSpeaker] = useState<ParticipantId>('organizer');
  const [combinedMessages, setCombinedMessages] = useState<Message[]>([]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const organizerRef = useRef<PromptBuilderRef>(null);
  const attendeeRef = useRef<PromptBuilderRef>(null);

  // Initialize participant hooks
  const organizerAi = useAiParticipant();
  const attendeeAi = useAiParticipant();

  // Computed state
  const hasStarted = () => combinedMessages.length > 0;
  const getParticipantMode = (participantId: ParticipantId) => {
    return participantId === 'organizer' ? organizerMode : attendeeMode;
  };
  const isAwaitingAiResponse = useMemo(
    () => getParticipantMode(currentSpeaker) === 'ai' && hasStarted(),
    [currentSpeaker, organizerMode, attendeeMode, combinedMessages.length],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [combinedMessages, isAwaitingAiResponse]);

  const addMessage = (sender: ParticipantId, content: string) => {
    const message: Message = {
      id: `${sender}-${Date.now()}`,
      sender,
      content,
      timestamp: new Date(),
    };
    setCombinedMessages((prev) => [...prev, message]);
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const speaker = currentSpeaker;
    const speakerMode = speaker === 'organizer' ? organizerMode : attendeeMode;

    if (speakerMode !== 'human') return;

    // Add human message
    addMessage(speaker, inputValue);
    const messageToSend = inputValue;
    setInputValue('');

    // Get response from other participant if they're AI
    const otherSpeaker = speaker === 'organizer' ? 'attendee' : 'organizer';
    const otherMode = otherSpeaker === 'organizer' ? organizerMode : attendeeMode;

    if (otherMode === 'ai') {
      try {
        const participant = otherSpeaker === 'organizer' ? organizerAi : attendeeAi;
        const promptBuilder = otherSpeaker === 'organizer' ? organizerRef.current : attendeeRef.current;
        const response = await participant.chat(messageToSend, promptBuilder);
        addMessage(otherSpeaker, response);
      } catch (error) {
        console.error('Error getting AI response:', error);
      }
    }

    // Switch speakers
    setCurrentSpeaker(otherSpeaker);
  };

  // Mode toggle handlers
  const handleModeToggle = (participantId: ParticipantId, mode: ParticipantMode) => {
    if (combinedMessages.length > 0) return; // Can't change after conversation starts

    if (participantId === 'organizer') {
      setOrganizerMode(mode);
    } else {
      setAttendeeMode(mode);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSelectOrganizerPrompt = (prompt: PromptBuilderData) => {
    setCurrentOrganizerPrompt(prompt);
    setShowPromptSets(false);
  };

  const handleSelectAttendeePrompt = (prompt: PromptBuilderData) => {
    setCurrentAttendeePrompt(prompt);
    setShowPromptSets(false);
  };

  const handleCreateNewOrganizer = () => {
    setCurrentOrganizerPrompt(null);
    setShowPromptSets(false);
  };

  const handleCreateNewAttendee = () => {
    setCurrentAttendeePrompt(null);
    setShowPromptSets(false);
  };

  const startAutoConversation = async () => {
    if (combinedMessages.length > 0) return;

    try {
      // Start with organizer if they're AI
      if (organizerMode === 'ai' && organizerRef.current) {
        const firstMessage = organizerRef.current.getFirstMessage();
        const startMessage = firstMessage || "Let's start this conversation.";

        // Display the first message directly
        addMessage('organizer', startMessage);
        setCurrentSpeaker('attendee');

        // If attendee is also AI, continue the conversation
        if (attendeeMode === 'ai') {
          const attendeeResponse = await attendeeAi.chat(startMessage, attendeeRef.current);
          addMessage('attendee', attendeeResponse);
          setCurrentSpeaker('organizer');

          // Continue AI/AI conversation with organizer's response
          const organizerResponse = await organizerAi.chat(attendeeResponse, organizerRef.current);
          addMessage('organizer', organizerResponse);
          setCurrentSpeaker('attendee');
        }
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const hasStarted = () => combinedMessages.length > 0;
  const getParticipantMode = (participantId: ParticipantId) => {
    return participantId === 'organizer' ? organizerMode : attendeeMode;
  };
  const isAwaitingAiResponse = useMemo(
    () => getParticipantMode(currentSpeaker) === 'ai' && hasStarted(),
    [currentSpeaker, organizerMode, attendeeMode, combinedMessages.length],
  );

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
                <Button onClick={() => setShowPromptSets(!showPromptSets)} size="sm" variant="outline" className="text-xs">
                  {showPromptSets ? 'Edit Current' : 'Browse All'}
                </Button>
              </div>

              {showPromptSets ? (
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
                    initialPrompt={currentOrganizerPrompt?.system_prompt || DEFAULT_ORGANIZER_PROMPT}
                    initialVariables={currentOrganizerPrompt?.variables || DEFAULT_VARIABLES}
                    showFirstMessage={true}
                  />

                  <PromptBuilder
                    ref={attendeeRef}
                    name="attendee"
                    color="bg-orange-200"
                    initialPrompt={currentAttendeePrompt?.system_prompt || DEFAULT_ATTENDEE_PROMPT}
                    initialVariables={currentAttendeePrompt?.variables || {}}
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
                            if (combinedMessages.length === 0) {
                              handleModeToggle('organizer', 'human');
                            }
                          }}
                          disabled={combinedMessages.length > 0}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                            combinedMessages.length > 0
                              ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                              : getParticipantMode('organizer') === 'human'
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
                            if (combinedMessages.length === 0) {
                              handleModeToggle('organizer', 'ai');
                            }
                          }}
                          disabled={combinedMessages.length > 0}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                            combinedMessages.length > 0
                              ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                              : getParticipantMode('organizer') === 'ai'
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
                            if (combinedMessages.length === 0) {
                              handleModeToggle('attendee', 'human');
                            }
                          }}
                          disabled={combinedMessages.length > 0}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                            combinedMessages.length > 0
                              ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                              : getParticipantMode('attendee') === 'human'
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
                            if (combinedMessages.length === 0) {
                              handleModeToggle('attendee', 'ai');
                            }
                          }}
                          disabled={combinedMessages.length > 0}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                            combinedMessages.length > 0
                              ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                              : getParticipantMode('attendee') === 'ai'
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
                      <Button onClick={startAutoConversation} size="sm" className="px-4">
                        <Play size={16} className="mr-2" />
                        Start
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {combinedMessages.map((message) => (
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
                    currentSpeaker &&
                    getParticipantMode(currentSpeaker) === 'human' &&
                    !isAwaitingAiResponse &&
                    (() => {
                      const waitingFor = currentSpeaker;
                      const waitingForOrganizer = waitingFor === 'organizer';

                      return (
                        <div className={`flex ${waitingForOrganizer ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg border-2 border-dashed ${
                              waitingForOrganizer ? 'border-purple-300 bg-purple-50' : 'border-orange-300 bg-orange-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <User size={12} className={waitingForOrganizer ? 'text-purple-400' : 'text-orange-400'} />
                              <span className="text-xs text-gray-500">{waitingForOrganizer ? 'Organizer' : 'Attendee'}</span>
                            </div>
                            <p className="text-sm italic text-gray-500">Waiting for human...</p>
                          </div>
                        </div>
                      );
                    })()}

                  {isAwaitingAiResponse && (
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
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        getParticipantMode('organizer') === 'ai' && getParticipantMode('attendee') === 'ai'
                          ? 'Both participants are in AI mode - conversation runs automatically'
                          : currentSpeaker === 'organizer'
                            ? 'Type your message as the organizer...'
                            : 'Type your message as the attendee...'
                      }
                      className={`flex-1 min-h-[40px] max-h-[120px] resize-none ${
                        getParticipantMode('organizer') === 'ai' && getParticipantMode('attendee') === 'ai'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : ''
                      }`}
                      disabled={
                        isAwaitingAiResponse || (getParticipantMode('organizer') === 'ai' && getParticipantMode('attendee') === 'ai')
                      }
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={
                        !inputValue.trim() ||
                        isAwaitingAiResponse ||
                        (getParticipantMode('organizer') === 'ai' && getParticipantMode('attendee') === 'ai')
                      }
                      className={`px-4 ${
                        getParticipantMode('organizer') === 'ai' && getParticipantMode('attendee') === 'ai'
                          ? 'bg-gray-400 cursor-not-allowed'
                          : currentSpeaker === 'organizer'
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
