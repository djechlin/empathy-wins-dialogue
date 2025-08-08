import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Textarea } from '@/ui/textarea';
import { Play, Send, User, Bot } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Accordion } from '@/ui/accordion';
import Navbar from '@/components/layout/Navbar';
import PromptBuilder, { type PromptBuilderRef } from '@/components/PromptBuilder';
import { savePromptBuilder, fetchMostRecentPromptBuilders } from '@/utils/promptBuilder';
import { type WorkbenchRequest, type WorkbenchResponse } from '@/integrations/supabase/types';

interface Message {
  id: string;
  text: string;
  isOrganizer: boolean;
  timestamp: Date;
}

interface PromptConfig {
  organizerPrompt: string;
  attendeePrompt: string;
  organizerFirstMessage: string;
  variables: Record<string, string>;
  organizerHumanMode: boolean;
  attendeeHumanMode: boolean;
}

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

// Generate XML tags for variables
const generateVariableTags = (variables: Record<string, string>): string => {
  const nameToXmlTag = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  };

  return Object.entries(variables)
    .map(([name, value]) => `<${nameToXmlTag(name)}>${value}</${nameToXmlTag(name)}>`)
    .join('\n\n');
};

const Workbench = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<PromptConfig>({
    organizerPrompt: DEFAULT_ORGANIZER_PROMPT,
    attendeePrompt: DEFAULT_ATTENDEE_PROMPT,
    organizerFirstMessage:
      'Hi! I saw you at the Bernie/AOC event last week. Thanks for coming out! I wanted to follow up about some upcoming opportunities to stay involved.',
    variables: DEFAULT_VARIABLES,
    organizerHumanMode: true,
    attendeeHumanMode: false,
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const organizerRef = useRef<PromptBuilderRef>(null);
  const attendeeRef = useRef<PromptBuilderRef>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load saved prompt builders on page load
  useEffect(() => {
    const loadSavedPromptBuilders = async () => {
      const savedPromptBuilders = await fetchMostRecentPromptBuilders();

      if (savedPromptBuilders) {
        setConfig((prev) => ({
          ...prev,
          organizerPrompt: savedPromptBuilders.organizer?.prompt || prev.organizerPrompt,
          attendeePrompt: savedPromptBuilders.attendee?.prompt || prev.attendeePrompt,
          organizerFirstMessage: savedPromptBuilders.organizer?.firstMessage || prev.organizerFirstMessage,
          variables: savedPromptBuilders.organizer?.variables || prev.variables,
        }));
      }
    };

    loadSavedPromptBuilders();
  }, []);

  const getFullPrompt = () => {
    const variableTags = generateVariableTags(config.variables);
    return `${config.organizerPrompt}\n\n${variableTags}`;
  };

  const addVariable = (name: string) => {
    if (!name.trim() || config.variables[name]) return;
    setConfig((prev) => ({
      ...prev,
      variables: { ...prev.variables, [name]: '' },
    }));
  };

  const removeVariable = (name: string) => {
    setConfig((prev) => {
      const newVariables = { ...prev.variables };
      delete newVariables[name];
      return { ...prev, variables: newVariables };
    });
  };

  const reorderVariables = (fromIndex: number, toIndex: number) => {
    setConfig((prev) => {
      const entries = Object.entries(prev.variables);
      const [removed] = entries.splice(fromIndex, 1);
      entries.splice(toIndex, 0, removed);
      const newVariables = Object.fromEntries(entries);
      return { ...prev, variables: newVariables };
    });
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const messageText = inputValue;

    // Determine who is sending based on whose turn it is
    const isOrganizerTurn = messages.length === 0 || !messages[messages.length - 1].isOrganizer;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isOrganizer: isOrganizerTurn,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Get AI response from the other participant if they're in auto mode
    if (isOrganizerTurn && !config.attendeeHumanMode) {
      await handleAIResponse(messageText);
    } else if (!isOrganizerTurn && !config.organizerHumanMode) {
      await handleOrganizerAIResponse(messageText);
    } else {
      setIsLoading(false);
    }
  };

  const handleAIResponse = async (messageText: string) => {
    try {
      const conversationHistory = messages.map((m) => `${m.isOrganizer ? 'Organizer' : 'Attendee'}: ${m.text}`).join('\n');

      const requestBody: WorkbenchRequest = {
        messages: [
          {
            role: 'user',
            content: `Previous conversation:
${conversationHistory}

Organizer: ${messageText}

Respond as the attendee would, keeping responses brief and realistic for texting.`,
          },
        ],
        systemPrompt: config.attendeePrompt,
      };

      const { data, error } = await supabase.functions.invoke<WorkbenchResponse>('workbench', {
        body: requestBody,
      });

      if (error) {
        throw error;
      }

      const response = data?.message || 'Sorry, I had trouble responding. Can you try again?';

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isOrganizer: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);

      // If organizer is also in auto mode, continue the conversation
      if (!config.organizerHumanMode) {
        setTimeout(() => handleOrganizerAIResponse(response), 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, something went wrong. Try again?',
        isOrganizer: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrganizerAIResponse = async (attendeeMessage: string) => {
    setIsLoading(true);
    try {
      const conversationHistory = messages.map((m) => `${m.isOrganizer ? 'Organizer' : 'Attendee'}: ${m.text}`).join('\n');

      const requestBody: WorkbenchRequest = {
        messages: [
          {
            role: 'user',
            content: `Previous conversation:
${conversationHistory}

Attendee: ${attendeeMessage}

Respond as the organizer would, keeping responses brief and focused on getting the attendee more involved.`,
          },
        ],
        systemPrompt: getFullPrompt(),
      };

      const { data, error } = await supabase.functions.invoke<WorkbenchResponse>('workbench', {
        body: requestBody,
      });

      if (error) {
        throw error;
      }

      const response = data?.message || 'Sorry, I had trouble responding. Can you try again?';

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isOrganizer: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);

      // Continue with attendee response if both are in auto mode
      if (!config.attendeeHumanMode) {
        setTimeout(() => handleAIResponse(response), 1000);
      }
    } catch (error) {
      console.error('Error sending organizer message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startAutoConversation = async () => {
    // Save both prompt builders before starting conversation
    try {
      const organizerSaveResult = await organizerRef.current?.save();
      const attendeeSaveResult = await attendeeRef.current?.save();

      if (organizerSaveResult === false || attendeeSaveResult === false) {
        console.error('Failed to save one or more prompt builders');
        // Continue anyway, but log the error
      }
    } catch (error) {
      console.error('Error saving prompt builders:', error);
    }

    // Always start with organizer's first message regardless of human/AI mode
    const initialMessage = config.organizerFirstMessage;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: initialMessage,
      isOrganizer: true,
      timestamp: new Date(),
    };

    setMessages([userMessage]);

    // Only auto-respond if attendee is in AI mode
    if (!config.attendeeHumanMode) {
      await handleAIResponse(initialMessage);
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
              <Accordion type="multiple" defaultValue={['organizer', 'attendee']} className="w-full space-y-4">
                <PromptBuilder
                  ref={organizerRef}
                  name="organizer"
                  color="bg-purple-200"
                  prompt={config.organizerPrompt}
                  onPromptChange={(value) => setConfig((prev) => ({ ...prev, organizerPrompt: value }))}
                  variables={Object.entries(config.variables).map(([name, value]) => ({
                    name,
                    value,
                    onChange: (newValue) =>
                      setConfig((prev) => ({
                        ...prev,
                        variables: { ...prev.variables, [name]: newValue },
                      })),
                  }))}
                  onAddVariable={addVariable}
                  onRemoveVariable={removeVariable}
                  onReorderVariables={reorderVariables}
                  firstMessage={config.organizerFirstMessage}
                  onFirstMessageChange={(value) => setConfig((prev) => ({ ...prev, organizerFirstMessage: value }))}
                  showFirstMessage={true}
                  onSave={async () => {
                    return await savePromptBuilder({
                      name: 'organizer',
                      prompt: config.organizerPrompt,
                      firstMessage: config.organizerFirstMessage,
                      variables: config.variables,
                    });
                  }}
                />

                <PromptBuilder
                  ref={attendeeRef}
                  name="attendee"
                  color="bg-orange-200"
                  prompt={config.attendeePrompt}
                  onPromptChange={(value) => setConfig((prev) => ({ ...prev, attendeePrompt: value }))}
                  variables={[]}
                  onAddVariable={addVariable}
                  onRemoveVariable={removeVariable}
                  onReorderVariables={reorderVariables}
                  onSave={async () => {
                    return await savePromptBuilder({
                      name: 'attendee',
                      prompt: config.attendeePrompt,
                      variables: {},
                    });
                  }}
                />
              </Accordion>
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
                            setConfig((prev) => ({ ...prev, organizerHumanMode: true }));
                          }}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                            config.organizerHumanMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <User size={12} />
                          Human
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfig((prev) => ({ ...prev, organizerHumanMode: false }));
                          }}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                            !config.organizerHumanMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
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
                            setConfig((prev) => ({ ...prev, attendeeHumanMode: true }));
                          }}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                            config.attendeeHumanMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <User size={12} />
                          Human
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfig((prev) => ({ ...prev, attendeeHumanMode: false }));
                          }}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                            !config.attendeeHumanMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Bot size={12} />
                          AI
                        </button>
                      </div>
                    </div>
                  </div>

                  {messages.length === 0 && (
                    <div className="mt-2">
                      <Button onClick={startAutoConversation} size="sm" className="px-4">
                        <Play size={16} className="mr-2" />
                        Start
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isOrganizer ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOrganizer ? 'bg-purple-200 text-gray-900' : 'bg-orange-200 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.isOrganizer ? <User size={12} /> : <Bot size={12} />}
                          <span className="text-xs opacity-75">{message.isOrganizer ? 'Organizer' : 'Attendee'}</span>
                        </div>
                        <p className="text-sm">{message.text}</p>
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
                  {messages.length > 0 &&
                    !isLoading &&
                    (() => {
                      const lastMessage = messages[messages.length - 1];
                      const waitingForOrganizer = !lastMessage.isOrganizer;
                      const waitingForAttendee = lastMessage.isOrganizer;

                      // Show waiting indicator if someone needs to respond
                      if ((waitingForOrganizer && config.organizerHumanMode) || (waitingForAttendee && config.attendeeHumanMode)) {
                        return (
                          <div className={`flex ${waitingForOrganizer ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`max-w-xs px-4 py-2 rounded-lg border-2 border-dashed ${
                                waitingForOrganizer ? 'border-purple-300 bg-purple-50' : 'border-orange-300 bg-orange-50'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                {waitingForOrganizer ? (
                                  <User size={12} className="text-purple-400" />
                                ) : (
                                  <Bot size={12} className="text-orange-400" />
                                )}
                                <span className="text-xs text-gray-500">{waitingForOrganizer ? 'Organizer' : 'Attendee'}</span>
                              </div>
                              <p className="text-sm italic text-gray-500">Waiting for human...</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-xs px-4 py-2 rounded-lg bg-orange-100 border border-orange-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Bot size={12} className="text-orange-400" />
                          <span className="text-xs text-gray-600">Attendee</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {(config.organizerHumanMode || config.attendeeHumanMode) && (
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={
                          messages.length === 0 || messages[messages.length - 1].isOrganizer
                            ? config.attendeeHumanMode
                              ? 'Type your message as the attendee...'
                              : 'Type your message as the organizer...'
                            : config.organizerHumanMode
                              ? 'Type your message as the organizer...'
                              : 'Type your message as the attendee...'
                        }
                        className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className={`px-4 ${
                          messages.length === 0 || messages[messages.length - 1].isOrganizer
                            ? config.attendeeHumanMode
                              ? 'bg-orange-600 hover:bg-orange-700 text-white'
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                            : config.organizerHumanMode
                              ? 'bg-purple-600 hover:bg-purple-700 text-white'
                              : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                      >
                        <Send size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workbench;
