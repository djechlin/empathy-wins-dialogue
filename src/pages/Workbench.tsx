import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { ChevronDown, ChevronUp, Play, Send, User, Bot } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/accordion';
import Navbar from '@/components/layout/Navbar';

interface Message {
  id: string;
  text: string;
  isOrganizer: boolean;
  timestamp: Date;
}

interface PromptConfig {
  organizerPrompt: string;
  attendeePrompt: string;
  variables: Record<string, string>;
  organizerHumanMode: boolean;
  attendeeHumanMode: boolean;
}

interface ParticipantVariable {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

// Default prompts
const DEFAULT_ORGANIZER_PROMPT = `You are an experienced political organizer reaching out to someone who attended a recent Bernie Sanders/AOC "Fight Oligarchy" event. Your goal is to follow up and try to get them more involved in future activism.

Be warm, personal, and persuasive. Build rapport and make a compelling case for why their continued involvement matters.`;

const DEFAULT_ATTENDEE_PROMPT = `You are someone who attended a Bernie Sanders/AOC "Fight Oligarchy" event. You're politically aware but not deeply engaged. You voted against Trump but aren't super active in politics.

You get that Trump is a problem but think protests are low impact. You're kind of bored and don't have much to do. You should be somewhat skeptical at first but can be convinced to get more involved with the right approach.`;

const DEFAULT_VARIABLES = {
  'Survey Questions': `1. How likely are you to attend another political event in the next month?
2. What issues are you most passionate about?
3. Would you be interested in volunteering for upcoming campaigns?`,
  'Event Context': 'Bernie Sanders/AOC "Fight Oligarchy" rally',
  'Target Outcome': 'Get attendee to volunteer for next campaign or attend another event',
};

// Utility function to convert variable name to XML tag
const nameToXmlTag = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};

// Generate XML tags for variables
const generateVariableTags = (variables: Record<string, string>): string => {
  return Object.entries(variables)
    .map(([name, value]) => `<${nameToXmlTag(name)}>${value}</${nameToXmlTag(name)}>`)
    .join('\n\n');
};

// Generate participant name with timestamp
const generateParticipantName = (type: string): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${type}-${month}/${date}-${hours}:${minutes}:${seconds}`;
};

// Header component for participant with toggles always visible
const ParticipantHeader: React.FC<{
  type: 'organizer' | 'attendee';
  isHumanMode: boolean;
  onModeChange: (isHuman: boolean) => void;
  participantName: string;
}> = ({ type, isHumanMode, onModeChange, participantName }) => {
  const IconComponent = isHumanMode ? User : Bot;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <IconComponent size={16} />
        <div className="flex flex-col">
          <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          <span className="text-xs text-gray-500 font-mono">{participantName}</span>
        </div>
      </div>
      <div className="flex items-center">
        <Button
          variant={isHumanMode ? 'default' : 'outline'}
          size="sm"
          className="rounded-r-none px-3 h-8 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onModeChange(true);
          }}
        >
          Human
        </Button>
        <Button
          variant={!isHumanMode ? 'default' : 'outline'}
          size="sm"
          className="rounded-l-none px-3 h-8 text-xs border-l-0"
          onClick={(e) => {
            e.stopPropagation();
            onModeChange(false);
          }}
        >
          AI
        </Button>
      </div>
    </div>
  );
};

// Content component for participant details
const ParticipantContent: React.FC<{
  prompt: string;
  onPromptChange: (value: string) => void;
  isHumanMode: boolean;
  type: 'organizer' | 'attendee';
  variables: ParticipantVariable[];
  showFullPrompt: boolean;
  onToggleFullPrompt: () => void;
  getFullPrompt: () => string;
  onAddVariable?: (name: string) => void;
  onRemoveVariable?: (name: string) => void;
}> = ({
  prompt,
  onPromptChange,
  isHumanMode,
  type,
  variables,
  showFullPrompt,
  onToggleFullPrompt,
  getFullPrompt,
  onAddVariable,
  onRemoveVariable,
}) => {
  const [newVariableName, setNewVariableName] = useState('');
  return (
    <div className="space-y-4 pt-4">
      <div>
        <Label className={`text-sm mb-2 block ${isHumanMode ? 'text-gray-400' : 'text-gray-600'}`}>System Prompt</Label>
        <Textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={`Enter ${type} system prompt...`}
          className={`min-h-[200px] text-sm flex-1 ${isHumanMode ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
          disabled={isHumanMode}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className={`text-sm ${isHumanMode ? 'text-gray-400' : 'text-gray-600'}`}>Variables</Label>
          {onAddVariable && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newVariableName}
                onChange={(e) => setNewVariableName(e.target.value)}
                placeholder="Variable name"
                className="px-2 py-1 text-xs border rounded"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newVariableName.trim()) {
                    onAddVariable(newVariableName.trim());
                    setNewVariableName('');
                  }
                }}
                disabled={isHumanMode}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  if (newVariableName.trim()) {
                    onAddVariable(newVariableName.trim());
                    setNewVariableName('');
                  }
                }}
                disabled={isHumanMode || !newVariableName.trim()}
                className="text-xs px-2 py-1 h-auto"
              >
                Add
              </Button>
            </div>
          )}
        </div>

        {variables.map((variable) => (
          <div key={variable.name} className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <Label className={`text-sm ${isHumanMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {variable.name} <code className="text-xs text-gray-500">{'<' + nameToXmlTag(variable.name) + '>'}</code>
              </Label>
              {onRemoveVariable && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onRemoveVariable(variable.name)}
                  disabled={isHumanMode}
                  className="text-xs px-2 py-1 h-auto"
                >
                  Remove
                </Button>
              )}
            </div>
            <Textarea
              value={variable.value}
              onChange={(e) => variable.onChange(e.target.value)}
              placeholder={`Enter ${variable.name.toLowerCase()}...`}
              className={`min-h-[100px] text-sm ${isHumanMode ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
              disabled={isHumanMode}
            />
          </div>
        ))}
      </div>

      {variables.length > 0 && (
        <div className="space-y-2 pt-2">
          <Button onClick={onToggleFullPrompt} variant="outline" size="sm" className="w-full flex items-center justify-between">
            <span className="flex items-center">Full Prompt</span>
            {showFullPrompt ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>

          <AnimatePresence>
            {showFullPrompt && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <Card className="p-3 bg-gray-50 max-h-[150px] overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap text-gray-700">{getFullPrompt()}</pre>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const Workbench = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [config, setConfig] = useState<PromptConfig>({
    organizerPrompt: DEFAULT_ORGANIZER_PROMPT,
    attendeePrompt: DEFAULT_ATTENDEE_PROMPT,
    variables: DEFAULT_VARIABLES,
    organizerHumanMode: true,
    attendeeHumanMode: false,
  });

  // Generate participant names once on component mount
  const [participantNames] = useState(() => ({
    organizer: generateParticipantName('organizer'),
    attendee: generateParticipantName('attendee'),
  }));

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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

      const fullPrompt = `${config.attendeePrompt}

Previous conversation:
${conversationHistory}

Organizer: ${messageText}

Respond as the attendee would, keeping responses brief and realistic for texting.`;

      const { data, error } = await supabase.functions.invoke('workbench', {
        body: {
          prompt: fullPrompt,
        },
      });

      if (error) {
        throw error;
      }

      const response = data?.response || data?.content || data || 'Sorry, I had trouble responding. Can you try again?';

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

      const fullPrompt = `${getFullPrompt()}

Previous conversation:
${conversationHistory}

Attendee: ${attendeeMessage}

Respond as the organizer would, keeping responses brief and focused on getting the attendee more involved.`;

      const { data, error } = await supabase.functions.invoke('workbench', {
        body: {
          prompt: fullPrompt,
        },
      });

      if (error) {
        throw error;
      }

      const response = data?.response || data?.content || data || 'Sorry, I had trouble responding. Can you try again?';

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
    if (config.organizerHumanMode || config.attendeeHumanMode) return;

    // Start with organizer message
    const initialMessage =
      'Hi! I saw you at the Bernie/AOC event last week. Thanks for coming out! I wanted to follow up about some upcoming opportunities to stay involved.';

    const userMessage: Message = {
      id: Date.now().toString(),
      text: initialMessage,
      isOrganizer: true,
      timestamp: new Date(),
    };

    setMessages([userMessage]);
    await handleAIResponse(initialMessage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar pageTitle="Workbench" pageSummary="Develop AI organizer prompts" />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
            {/* Participants Column */}
            <div className="space-y-4">
              <Accordion type="multiple" defaultValue={['organizer', 'attendee']} className="w-full space-y-4">
                {/* Organizer Accordion */}
                <AccordionItem value="organizer" className="border-0">
                  <div className="bg-purple-200 rounded-lg p-4">
                    <AccordionTrigger className="hover:no-underline p-0">
                      <ParticipantHeader
                        type="organizer"
                        isHumanMode={config.organizerHumanMode}
                        onModeChange={(isHuman) => setConfig((prev) => ({ ...prev, organizerHumanMode: isHuman }))}
                        participantName={participantNames.organizer}
                      />
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <ParticipantContent
                        prompt={config.organizerPrompt}
                        onPromptChange={(value) => setConfig((prev) => ({ ...prev, organizerPrompt: value }))}
                        isHumanMode={config.organizerHumanMode}
                        type="organizer"
                        variables={Object.entries(config.variables).map(([name, value]) => ({
                          name,
                          value,
                          onChange: (newValue) =>
                            setConfig((prev) => ({
                              ...prev,
                              variables: { ...prev.variables, [name]: newValue },
                            })),
                        }))}
                        showFullPrompt={showFullPrompt}
                        onToggleFullPrompt={() => setShowFullPrompt(!showFullPrompt)}
                        getFullPrompt={getFullPrompt}
                        onAddVariable={addVariable}
                        onRemoveVariable={removeVariable}
                      />
                    </AccordionContent>
                  </div>
                </AccordionItem>

                {/* Attendee Accordion */}
                <AccordionItem value="attendee" className="border-0">
                  <div className="bg-orange-200 rounded-lg p-4">
                    <AccordionTrigger className="hover:no-underline p-0">
                      <ParticipantHeader
                        type="attendee"
                        isHumanMode={config.attendeeHumanMode}
                        onModeChange={(isHuman) => setConfig((prev) => ({ ...prev, attendeeHumanMode: isHuman }))}
                        participantName={participantNames.attendee}
                      />
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <ParticipantContent
                        prompt={config.attendeePrompt}
                        onPromptChange={(value) => setConfig((prev) => ({ ...prev, attendeePrompt: value }))}
                        isHumanMode={config.attendeeHumanMode}
                        type="attendee"
                        variables={[]}
                        showFullPrompt={showFullPrompt}
                        onToggleFullPrompt={() => setShowFullPrompt(!showFullPrompt)}
                        getFullPrompt={getFullPrompt}
                        onAddVariable={addVariable}
                        onRemoveVariable={removeVariable}
                      />
                    </AccordionContent>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Conversation Column */}
            <div className="space-y-4">
              <Card className="h-full flex flex-col">
                <div className="border-b px-4 py-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">Conversation</h2>
                    <div className="text-sm text-gray-500">
                      Organizer: {config.organizerHumanMode ? 'Human' : 'AI'} | Attendee: {config.attendeeHumanMode ? 'Human' : 'AI'}
                    </div>
                  </div>
                  {!config.organizerHumanMode && !config.attendeeHumanMode && (
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
