import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Label } from '@/ui/label';
import { Switch } from '@/ui/switch';
import { Textarea } from '@/ui/textarea';
import { Eye, Play, Send, User, Bot } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
  surveyQuestions: string;
  organizerHumanMode: boolean;
  attendeeHumanMode: boolean;
}

// Default prompts
const DEFAULT_ORGANIZER_PROMPT = `You are an experienced political organizer reaching out to someone who attended a recent Bernie Sanders/AOC "Fight Oligarchy" event. Your goal is to follow up and try to get them more involved in future activism.

Be warm, personal, and persuasive. Build rapport and make a compelling case for why their continued involvement matters.`;

const DEFAULT_ATTENDEE_PROMPT = `You are someone who attended a Bernie Sanders/AOC "Fight Oligarchy" event. You're politically aware but not deeply engaged. You voted against Trump but aren't super active in politics.

You get that Trump is a problem but think protests are low impact. You're kind of bored and don't have much to do. You should be somewhat skeptical at first but can be convinced to get more involved with the right approach.`;

const DEFAULT_SURVEY_QUESTIONS = `1. How likely are you to attend another political event in the next month?
2. What issues are you most passionate about?
3. Would you be interested in volunteering for upcoming campaigns?`;

const Workbench = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [config, setConfig] = useState<PromptConfig>({
    organizerPrompt: DEFAULT_ORGANIZER_PROMPT,
    attendeePrompt: DEFAULT_ATTENDEE_PROMPT,
    surveyQuestions: DEFAULT_SURVEY_QUESTIONS,
    organizerHumanMode: true,
    attendeeHumanMode: false,
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getFullPrompt = () => {
    return `${config.organizerPrompt}\n\n<survey_questions>${config.surveyQuestions}</survey_questions>`;
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const messageText = inputValue;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isOrganizer: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // If attendee is in auto mode, get AI response
    if (!config.attendeeHumanMode) {
      await handleAIResponse(messageText);
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
      <Navbar />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Workbench</h1>
            <p className="text-gray-600">Anthropic-style dev console for dialogue testing</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
            {/* Organizer Column */}
            <div className="space-y-4">
              <Card className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <Label className="font-medium flex items-center gap-2">
                    <User size={16} />
                    Organizer
                  </Label>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="organizer-human" className="text-sm">
                      Human
                    </Label>
                    <Switch
                      id="organizer-human"
                      checked={config.organizerHumanMode}
                      onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, organizerHumanMode: checked }))}
                    />
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">System Prompt</Label>
                    <Textarea
                      value={config.organizerPrompt}
                      onChange={(e) => setConfig((prev) => ({ ...prev, organizerPrompt: e.target.value }))}
                      placeholder="Enter organizer system prompt..."
                      className="min-h-[200px] text-sm flex-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">Survey Questions</Label>
                    <Textarea
                      value={config.surveyQuestions}
                      onChange={(e) => setConfig((prev) => ({ ...prev, surveyQuestions: e.target.value }))}
                      placeholder="Enter survey questions..."
                      className="min-h-[100px] text-sm"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <Button
                      onClick={() => setShowFullPrompt(!showFullPrompt)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Eye size={16} className="mr-2" />
                      {showFullPrompt ? 'Hide' : 'Show'} Full Prompt
                    </Button>

                    {!config.organizerHumanMode && !config.attendeeHumanMode && (
                      <Button onClick={startAutoConversation} size="sm" className="w-full">
                        <Play size={16} className="mr-2" />
                        Start Auto Conversation
                      </Button>
                    )}
                  </div>

                  {showFullPrompt && (
                    <Card className="p-3 bg-gray-50 max-h-[150px] overflow-y-auto">
                      <pre className="text-xs whitespace-pre-wrap text-gray-700">{getFullPrompt()}</pre>
                    </Card>
                  )}
                </div>
              </Card>
            </div>

            {/* Attendee Column */}
            <div className="space-y-4">
              <Card className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <Label className="font-medium flex items-center gap-2">
                    <Bot size={16} />
                    Attendee
                  </Label>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="attendee-human" className="text-sm">
                      Human
                    </Label>
                    <Switch
                      id="attendee-human"
                      checked={config.attendeeHumanMode}
                      onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, attendeeHumanMode: checked }))}
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <Label className="text-sm text-gray-600 mb-2 block">System Prompt</Label>
                  <Textarea
                    value={config.attendeePrompt}
                    onChange={(e) => setConfig((prev) => ({ ...prev, attendeePrompt: e.target.value }))}
                    placeholder="Enter attendee system prompt..."
                    className="h-full text-sm resize-none"
                  />
                </div>
              </Card>
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
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isOrganizer ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOrganizer ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.isOrganizer ? <User size={12} /> : <Bot size={12} />}
                          <span className="text-xs opacity-75">{message.isOrganizer ? 'Organizer' : 'Attendee'}</span>
                        </div>
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 opacity-75`}>
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Bot size={12} />
                          <span className="text-xs text-gray-600">Attendee</span>
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

                {config.organizerHumanMode && (
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message as the organizer..."
                        className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                        disabled={isLoading}
                      />
                      <Button onClick={sendMessage} disabled={!inputValue.trim() || isLoading} className="px-4">
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