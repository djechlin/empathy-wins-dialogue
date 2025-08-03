import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Textarea } from '@/ui/textarea';
import { Dice6, PartyPopper, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AMERICAN_NAMES = [
  // European-origin names (80 total - 40M, 40F)
  { name: 'Michael', gender: 'M' },
  { name: 'David', gender: 'M' },
  { name: 'John', gender: 'M' },
  { name: 'James', gender: 'M' },
  { name: 'Robert', gender: 'M' },
  { name: 'William', gender: 'M' },
  { name: 'Richard', gender: 'M' },
  { name: 'Joseph', gender: 'M' },
  { name: 'Thomas', gender: 'M' },
  { name: 'Christopher', gender: 'M' },
  { name: 'Charles', gender: 'M' },
  { name: 'Daniel', gender: 'M' },
  { name: 'Matthew', gender: 'M' },
  { name: 'Anthony', gender: 'M' },
  { name: 'Mark', gender: 'M' },
  { name: 'Donald', gender: 'M' },
  { name: 'Steven', gender: 'M' },
  { name: 'Andrew', gender: 'M' },
  { name: 'Kenneth', gender: 'M' },
  { name: 'Paul', gender: 'M' },
  { name: 'Joshua', gender: 'M' },
  { name: 'Kevin', gender: 'M' },
  { name: 'Brian', gender: 'M' },
  { name: 'George', gender: 'M' },
  { name: 'Timothy', gender: 'M' },
  { name: 'Ronald', gender: 'M' },
  { name: 'Jason', gender: 'M' },
  { name: 'Edward', gender: 'M' },
  { name: 'Jeffrey', gender: 'M' },
  { name: 'Ryan', gender: 'M' },
  { name: 'Jacob', gender: 'M' },
  { name: 'Gary', gender: 'M' },
  { name: 'Nicholas', gender: 'M' },
  { name: 'Eric', gender: 'M' },
  { name: 'Jonathan', gender: 'M' },
  { name: 'Stephen', gender: 'M' },
  { name: 'Larry', gender: 'M' },
  { name: 'Justin', gender: 'M' },
  { name: 'Scott', gender: 'M' },
  { name: 'Brandon', gender: 'M' },
  { name: 'Mary', gender: 'F' },
  { name: 'Patricia', gender: 'F' },
  { name: 'Jennifer', gender: 'F' },
  { name: 'Linda', gender: 'F' },
  { name: 'Elizabeth', gender: 'F' },
  { name: 'Barbara', gender: 'F' },
  { name: 'Susan', gender: 'F' },
  { name: 'Jessica', gender: 'F' },
  { name: 'Sarah', gender: 'F' },
  { name: 'Karen', gender: 'F' },
  { name: 'Nancy', gender: 'F' },
  { name: 'Lisa', gender: 'F' },
  { name: 'Betty', gender: 'F' },
  { name: 'Helen', gender: 'F' },
  { name: 'Sandra', gender: 'F' },
  { name: 'Donna', gender: 'F' },
  { name: 'Carol', gender: 'F' },
  { name: 'Ruth', gender: 'F' },
  { name: 'Sharon', gender: 'F' },
  { name: 'Michelle', gender: 'F' },
  { name: 'Laura', gender: 'F' },
  { name: 'Sarah', gender: 'F' },
  { name: 'Kimberly', gender: 'F' },
  { name: 'Deborah', gender: 'F' },
  { name: 'Dorothy', gender: 'F' },
  { name: 'Amy', gender: 'F' },
  { name: 'Angela', gender: 'F' },
  { name: 'Ashley', gender: 'F' },
  { name: 'Brenda', gender: 'F' },
  { name: 'Emma', gender: 'F' },
  { name: 'Olivia', gender: 'F' },
  { name: 'Cynthia', gender: 'F' },
  { name: 'Marie', gender: 'F' },
  { name: 'Janet', gender: 'F' },
  { name: 'Catherine', gender: 'F' },
  { name: 'Frances', gender: 'F' },
  { name: 'Christine', gender: 'F' },
  { name: 'Samantha', gender: 'F' },
  { name: 'Debra', gender: 'F' },
  { name: 'Rachel', gender: 'F' },
  // Spanish names (10 total - 5M, 5F)
  { name: 'Carlos', gender: 'M' },
  { name: 'Jose', gender: 'M' },
  { name: 'Miguel', gender: 'M' },
  { name: 'Diego', gender: 'M' },
  { name: 'Luis', gender: 'M' },
  { name: 'Maria', gender: 'F' },
  { name: 'Ana', gender: 'F' },
  { name: 'Sofia', gender: 'F' },
  { name: 'Isabella', gender: 'F' },
  { name: 'Carmen', gender: 'F' },
  // Chinese names (Pinyin) (10 total - 5M, 5F)
  { name: 'Wei', gender: 'M' },
  { name: 'Chen', gender: 'M' },
  { name: 'Li', gender: 'M' },
  { name: 'Wang', gender: 'M' },
  { name: 'Zhang', gender: 'M' },
  { name: 'Mei', gender: 'F' },
  { name: 'Lin', gender: 'F' },
  { name: 'Yan', gender: 'F' },
  { name: 'Xin', gender: 'F' },
  { name: 'Yu', gender: 'F' },
];

// Utility function to generate normal distributed random number using Box-Muller transform
const generateNormalRandom = (mean: number, stdDev: number): number => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdDev + mean;
};

// Generate age with normal distribution (mean 30, stddev 15) truncated to 16-100
const generateAge = (): number => {
  let age;
  do {
    age = Math.round(generateNormalRandom(30, 15));
  } while (age < 16 || age > 100);
  return age;
};

// Get generation based on age (as of 2024)
const getGeneration = (age: number): string => {
  if (age >= 10 && age <= 14) return 'gen-alpha'; // Born 2010-2014
  if (age >= 15 && age <= 27) return 'gen-z'; // Born 1997-2009
  if (age >= 28 && age <= 43) return 'millennial'; // Born 1981-1996
  if (age >= 44 && age <= 59) return 'gen-x'; // Born 1965-1980
  return 'boomer'; // Born 1946-1964 (60+)
};

// Generate Big Five personality traits (OCEAN)
const generateBig5 = () => ({
  openness: Math.random() > 0.5 ? 'high' : 'low',
  conscientiousness: Math.random() > 0.5 ? 'high' : 'low',
  extraversion: Math.random() > 0.5 ? 'high' : 'low',
  agreeableness: Math.random() > 0.5 ? 'high' : 'low',
  neuroticism: Math.random() > 0.5 ? 'high' : 'low',
});

// Generate difficulty level
const generateDifficulty = (): string => {
  const difficulties = ['persuadable', 'interested', 'skeptical', 'stubborn'];
  return difficulties[Math.floor(Math.random() * difficulties.length)];
};

// Format Big5 traits as OCEAN string
const formatOCEAN = (big5: {
  openness: string;
  conscientiousness: string;
  extraversion: string;
  agreeableness: string;
  neuroticism: string;
}): string => {
  const getSymbol = (trait: string) => (trait === 'high' ? '+' : '-');
  return `O${getSymbol(big5.openness)} | C${getSymbol(big5.conscientiousness)} | E${getSymbol(big5.extraversion)} | A${getSymbol(big5.agreeableness)} | N${getSymbol(big5.neuroticism)}`;
};

// Generate a complete person
const generatePerson = () => {
  const person = AMERICAN_NAMES[Math.floor(Math.random() * AMERICAN_NAMES.length)];
  const age = generateAge();
  const generation = getGeneration(age);
  const big5 = generateBig5();
  const difficulty = generateDifficulty();

  const personalityString = `<personality>
Name: ${person.name}
Gender: ${person.gender}
Age: ${age}
Generation: ${generation}
Openness: ${big5.openness}
Conscientiousness: ${big5.conscientiousness}
Extraversion: ${big5.extraversion}
Agreeableness: ${big5.agreeableness}
Neuroticism: ${big5.neuroticism}
Difficulty: ${difficulty}
</personality>`;

  return {
    name: person.name,
    gender: person.gender,
    age,
    generation,
    big5,
    difficulty,
    personalityString,
  };
};

const RallyFollowup = () => {
  const [currentPerson, setCurrentPerson] = useState(() => generatePerson());
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [showPersona, setShowPersona] = useState(false);
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

  const regeneratePerson = () => {
    setCurrentPerson(generatePerson());
    // Reset conversation
    setMessages([]);
    setIsComplete(false);
    setInputValue('');
    // Keep showPersona state - don't reset it
  };

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


  const handleAIResponse = async (messageText: string) => {
    try {
      const conversationHistory = messages.map((m) => `${m.isUser ? 'User' : currentPerson.name}: ${m.text}`).join('\n');

      const fullPrompt = `${currentPerson.personalityString}

You are ${currentPerson.name}, a friend who voted against Trump but is not very politically engaged. You get Trump is a problem, but think protests are low impact but are kind of bored and don't have anything to do. For the purpose of this roleplay, you should converge toward going to the protest relatively quickly. The whole exercise is meant to take at most 5 messages, and resolve in ${currentPerson.name} going. ${currentPerson.name}'s messages should be brief like in real texting, so about 1 or 2 sentences max.

Use language and communication style appropriate for your generation and personality traits. If you're high in extraversion, be more outgoing and social. If you're high in agreeableness, be more cooperative. If you're high in neuroticism, show more anxiety or emotional responses. Match your difficulty level - if you're "persuadable" be easily convinced, if "stubborn" require more convincing.

Previous conversation:
${conversationHistory}

User: ${messageText}

You must respond with EXACTLY this format:
${currentPerson.name.toUpperCase()}: [${currentPerson.name}'s response here]
COMPLETE: [true/false - true only if ${currentPerson.name} has definitively agreed to attend the protest]

COMPLETE should be true only when ${currentPerson.name} has clearly and definitively agreed to attend whatever protest the user is trying to convince them about. Don't mark it complete for maybe/considering - only for clear agreement.`;

      const { data, error } = await supabase.functions.invoke('rally-followup', {
        body: {
          userMessage: fullPrompt,
        },
      });

      if (error) {
        throw error;
      }

      const fullResponse = data?.response || data?.content || data || 'Sorry, I had trouble responding. Can you try again?';

      const personMatch = fullResponse.match(new RegExp(`${currentPerson.name.toUpperCase()}:\\s*(.*?)(?=\\nCOMPLETE:|$)`, 's'));
      const completeMatch = fullResponse.match(/COMPLETE:\s*(.*?)$/s);

      const personMessage = personMatch ? personMatch[1].trim() : fullResponse;
      const complete = completeMatch ? completeMatch[1].trim().toLowerCase() === 'true' : false;

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: personMessage,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);

      if (complete) {
        setIsComplete(true);
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <div className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{currentPerson.name.charAt(0)}</span>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">{currentPerson.name}</h1>
                <p className="text-sm text-green-500">Online</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex flex-col gap-1">
                <Button onClick={regeneratePerson} size="sm" variant="outline">
                  <Dice6 size={16} className="mr-1" />
                  New Person
                </Button>
                <Button onClick={() => setShowPersona(!showPersona)} size="sm" variant="ghost" className="text-xs">
                  {showPersona ? 'Hide' : 'Show'} Persona
                </Button>
              </div>
              {showPersona && (
                <div className="text-xs text-gray-600 mt-2 text-right">
                  <div>
                    {currentPerson.age}y {currentPerson.generation} {currentPerson.gender}
                  </div>
                  <div>{currentPerson.difficulty}</div>
                  <div className="font-mono">{formatOCEAN(currentPerson.big5)}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {showFullPrompt && (
          <Card className="mx-4 mt-2 mb-2 p-3 bg-gray-50 border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-700">AI Prompt Preview</h3>
              <Button onClick={() => setShowFullPrompt(false)} size="sm" variant="ghost">
                ✕
              </Button>
            </div>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono bg-white p-2 rounded border overflow-x-auto">
              {messages.length > 0
                ? `${currentPerson.personalityString}

You are ${currentPerson.name}, a friend who voted against Trump but is not very politically engaged...`
                : 'Send a message to see the full prompt'}
            </pre>
          </Card>
        )}

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
          <div className="flex items-center justify-between mb-2">
            <Button onClick={() => setShowFullPrompt(!showFullPrompt)} size="sm" variant="ghost" className="text-xs">
              {showFullPrompt ? 'Hide' : 'Show'} AI Prompt
            </Button>
            <div className="text-xs text-gray-500">{messages.length === 0 ? 'Start the conversation!' : `${messages.length} messages`}</div>
          </div>
          <div className="flex space-x-2">
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isComplete
                  ? `${currentPerson.name} agreed to go! 🎉`
                  : messages.length === 0
                    ? `Say hi to ${currentPerson.name}...`
                    : 'Type a message...'
              }
              className="flex-1 min-h-[40px] max-h-[120px] resize-none"
              disabled={isLoading || isComplete}
            />
            <Button onClick={sendMessage} disabled={!inputValue.trim() || isLoading || isComplete} className="px-4">
              <Send size={16} />
            </Button>
          </div>
        </div>
      </Card>

      {isComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-8 text-center max-w-md mx-4 bg-white">
            <div className="mb-4">
              <PartyPopper className="mx-auto h-16 w-16 text-green-500 animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Success! 🎉</h2>
            <p className="text-gray-600 mb-4">{currentPerson.name} agreed to attend the Good Trouble Lives On protest on July 17th!</p>
            <p className="text-sm text-gray-500">Great job convincing your friend to take action for democracy!</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RallyFollowup;
