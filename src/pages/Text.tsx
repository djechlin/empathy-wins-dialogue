import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Label } from '@/ui/label';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { Textarea } from '@/ui/textarea';
import { PartyPopper, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/layout/Navbar';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Text = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "yo what's good bestie? ✨",
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alexGeneration, setAlexGeneration] = useState('genz');
  const [currentSuggestion, setCurrentSuggestion] = useState<string>('bestie the tea is HOT today ☕🔥');
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isComplete) return;

    const messageText = inputValue;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    await handleAIResponse(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = () => {
    if (currentSuggestion && !isLoading && !isComplete) {
      const suggestionToSend = currentSuggestion;
      setInputValue(suggestionToSend);
      setCurrentSuggestion('');

      // Auto-send the suggestion with the captured value
      setTimeout(() => {
        // Create and send the message directly with the suggestion text
        const userMessage: Message = {
          id: Date.now().toString(),
          text: suggestionToSend,
          isUser: true,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Continue with the AI response logic
        handleAIResponse(suggestionToSend);
      }, 100);
    }
  };

  const handleAIResponse = async (messageText: string) => {
    try {
      const conversationHistory = messages.map((m) => `${m.isUser ? 'User' : 'Alex'}: ${m.text}`).join('\n');

      const generationPrompts = {
        genz: "You are Alex, a Gen Z friend (born 1997-2012). Use heavy Gen Z slang like 'no cap', 'fr fr', 'periodt', 'slaps', 'hits different', 'bussin', 'slay', 'it's giving...', 'main character energy', 'understood the assignment', 'lowkey/highkey', 'bet', 'say less', 'that's so valid', 'we love to see it', 'this ain't it chief'. Use lots of emojis and abbreviations. Be very casual with punctuation and caps.",
        millennial:
          "You are Alex, a Millennial friend (born 1981-1996). Use Millennial slang like 'lit', 'fam', 'squad', 'salty', 'basic', 'extra', 'ghosting', 'adulting', 'I can't even', 'goals', 'mood', 'same', 'yas queen', 'living my best life', 'it's a vibe', 'sending good vibes', 'that's fire', 'no shade', 'thirsty'. Reference pop culture from the 2000s-2010s.",
        genx: "You are Alex, a Gen X friend (born 1965-1980). Use Gen X slang like 'whatever', 'as if', 'talk to the hand', 'phat', 'tight', 'dope', 'wicked', 'rad', 'tubular', 'gnarly', 'bogus', 'my bad', 'all that and a bag of chips', 'don't go there', 'psych!', 'what's the 411?', 'that's so random'. Be somewhat cynical and sarcastic.",
        boomer:
          "You are Alex, a Baby Boomer friend (born 1946-1964). Be mildly tech illiterate with unnaturally proper punctuation and capitalization. Use phrases like 'How do you do?', 'That sounds wonderful.', 'I will have to check my calendar', 'Please let me know', 'Thank you kindly', 'I appreciate your patience.', 'God bless.', 'Take care now'. Sometimes add unnecessary periods and formal language. Occasionally misuse modern slang or ask what abbreviations mean.",
      };

      const fullPrompt = `${generationPrompts[alexGeneration as keyof typeof generationPrompts]} You are Alex, a friend who voted against Trump but is not very politically engaged. You get Trump is a problem, but think protests are low impact but are kind of bored and don't have anything to do. For the purpose of this roleplay, you should converge toward going to the protest relatively quickly. The whole exercise is meant to take at most 5 messages, and resolve in Alex going. Alex's messages should be brief like in real texting, so about 1 or 2 sentences max.

Previous conversation:
${conversationHistory}

User: ${messageText}

You must respond with EXACTLY this format:
ALEX: [Alex's response here]
SUGGESTION: [A suggestion for the user - a brief text that will nudge Alex to go to the protest]
COMPLETE: [true/false - true only if Alex has definitively agreed to attend the protest]

The suggestion should be a complete, ready-to-send message that would work well given Alex's current state of mind. Write it as if the user is typing it - make it conversational and natural. Try to match the user's communication style and voice based on their previous messages.

COMPLETE should be true only when Alex has clearly and definitively agreed to attend whatever protest the user is trying to convince them about. Don't mark it complete for maybe/considering - only for clear agreement.`;

      const { data, error } = await supabase.functions.invoke('text-friend', {
        body: {
          userMessage: fullPrompt,
        },
      });

      if (error) {
        throw error;
      }

      const fullResponse = data?.response || data?.content || data || 'Sorry, I had trouble responding. Can you try again?';

      const alexMatch = fullResponse.match(/ALEX:\s*(.*?)(?=\nSUGGESTION:|$)/s);
      const suggestionMatch = fullResponse.match(/SUGGESTION:\s*(.*?)(?=\nCOMPLETE:|$)/s);
      const completeMatch = fullResponse.match(/COMPLETE:\s*(.*?)$/s);

      const alexMessage = alexMatch ? alexMatch[1].trim() : fullResponse;
      const suggestion = suggestionMatch ? suggestionMatch[1].trim() : '';
      const complete = completeMatch ? completeMatch[1].trim().toLowerCase() === 'true' : false;

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: alexMessage,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setCurrentSuggestion(suggestion);

      if (complete) {
        setIsComplete(true);
        setCurrentSuggestion(''); // Clear suggestion when complete
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, something went wrong. Try again?',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center p-4 pt-20">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <div className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Alex</h1>
                <p className="text-sm text-green-500">Online</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Alex vibes as</p>
              <RadioGroup value={alexGeneration} onValueChange={setAlexGeneration} className="flex space-x-2">
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="genz" id="genz" className="w-3 h-3" />
                  <Label htmlFor="genz" className="text-xs">
                    Gen Z
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="millennial" id="millennial" className="w-3 h-3" />
                  <Label htmlFor="millennial" className="text-xs">
                    Millennial
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="genx" id="genx" className="w-3 h-3" />
                  <Label htmlFor="genx" className="text-xs">
                    Gen X
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="boomer" id="boomer" className="w-3 h-3" />
                  <Label htmlFor="boomer" className="text-xs">
                    Boomer
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <Card className={`max-w-xs p-3 ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </Card>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <Card className="max-w-xs p-3 bg-gray-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </Card>
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
              placeholder={isComplete ? 'Alex agreed to go! 🎉' : 'Type a message...'}
              className="flex-1 min-h-[40px] max-h-[120px] resize-none"
              disabled={isLoading || isComplete}
            />
            <Button onClick={sendMessage} disabled={!inputValue.trim() || isLoading || isComplete} className="px-4">
              <Send size={16} />
            </Button>
          </div>
          {currentSuggestion && (
            <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded text-sm text-purple-700">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <span className="font-medium">💬 Suggestion: </span>
                  {currentSuggestion}
                </div>
                <Button onClick={handleSuggestionClick} size="sm" className="px-3 py-1 text-xs" disabled={isLoading || isComplete}>
                  <Send size={12} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {isComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-8 text-center max-w-md mx-4 bg-white">
            <div className="mb-4">
              <PartyPopper className="mx-auto h-16 w-16 text-green-500 animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Success! 🎉</h2>
            <p className="text-gray-600 mb-4">Alex agreed to attend the Good Trouble Lives On protest on July 17th!</p>
            <p className="text-sm text-gray-500">Great job convincing your friend to take action for democracy!</p>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
};

export default Text;
