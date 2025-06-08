import { ReactNode, useEffect, useMemo, useState } from 'react';
import { DialogueContext, DialogueMessage } from '../types';
import { DialogueContextObject } from './dialogueContext';

interface MockDialogueProviderProps {
  children: ReactNode;
  className?: string;
}

const baseScores = {
  admiration: 0.2,
  adoration: 0.2,
  aestheticAppreciation: 0.2,
  amusement: 0.2,
  anger: 0.2,
  anxiety: 0.2,
  awe: 0.2,
  awkwardness: 0.2,
  boredom: 0.2,
  calmness: 0.25,
  concentration: 0.2,
  confusion: 0.2,
  contemplation: 0.2,
  contempt: 0.2,
  contentment: 0.2,
  craving: 0.2,
  desire: 0.2,
  determination: 0.2,
  disappointment: 0.2,
  disgust: 0.2,
  distress: 0.2,
  doubt: 0.3,
  ecstasy: 0.2,
  embarrassment: 0.2,
  empathicPain: 0.2,
  entrancement: 0.2,
  envy: 0.2,
  excitement: 0.2,
  fear: 0.2,
  guilt: 0.2,
  horror: 0.2,
  interest: 0.4,
  joy: 0.2,
  love: 0.2,
  nostalgia: 0.2,
  pain: 0.2,
  pride: 0.2,
  realization: 0.2,
  relief: 0.2,
  romance: 0.2,
  sadness: 0.2,
  satisfaction: 0.2,
  shame: 0.2,
  surpriseNegative: 0.2,
  surprisePositive: 0.2,
  sympathy: 0.2,
  tiredness: 0.2,
  triumph: 0.2,
};

const MOCK_MESSAGES: DialogueMessage[] = [
  {
    role: 'assistant' as const,
    content:
      "Hi there! I understand you want to talk about healthcare policy. I'm honestly pretty skeptical about government expansion in healthcare. What's your take on this?",
    emotions: baseScores,
    id: 'msg-1',
    timestamp: new Date(),
  },
  {
    role: 'user' as const,
    content: 'I appreciate you sharing that perspective. Can you tell me a bit about what makes you feel skeptical about it?',
    emotions: baseScores,
    id: 'msg-2',
    timestamp: new Date(),
  },
  {
    role: 'assistant' as const,
    content:
      "Well, I just worry about costs and efficiency. Government programs tend to be expensive and bureaucratic. I've had bad experiences with government services before.",
    emotions: baseScores,
    id: 'msg-3',
    timestamp: new Date(),
  },
  {
    role: 'user' as const,
    content: 'That sounds really frustrating. Can you share more about those experiences you mentioned?',
    emotions: baseScores,
    id: 'msg-4',
    timestamp: new Date(),
  },
  {
    role: 'assistant' as const,
    content:
      'Yeah, when my mom needed Medicare help, it took months of paperwork and phone calls. It was such a hassle when she was already sick.',
    emotions: baseScores,
    id: 'msg-5',
    timestamp: new Date(),
  },
  {
    role: 'user' as const,
    content: "I'm so sorry you and your mom went through that. That must have been incredibly stressful during an already difficult time.",
    emotions: baseScores,
    id: 'msg-6',
    timestamp: new Date(),
  },
  {
    role: 'assistant' as const,
    content: "Thanks for saying that. It really was tough. I guess I just don't trust that expanding healthcare will make things better.",
    emotions: baseScores,
    id: 'msg-7',
    timestamp: new Date(),
  },
  {
    role: 'user' as const,
    content: 'I understand that concern completely. What if there were ways to expand access while also improving the experience you had?',
    emotions: baseScores,
    id: 'msg-8',
    timestamp: new Date(),
  },
  {
    role: 'assistant' as const,
    content:
      "Hmm, I suppose if they could actually streamline things and make it less bureaucratic... but I'm still not sure it would work.",
    emotions: baseScores,
    id: 'msg-9',
    timestamp: new Date(),
  },
  {
    role: 'user' as const,
    content:
      'That makes total sense. Would you be open to hearing about some specific aspects of this proposal that might address those concerns?',
    emotions: baseScores,
    id: 'msg-10',
    timestamp: new Date(),
  },
];

export function MockDialogueProvider({ children, className }: MockDialogueProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<DialogueMessage[]>([]);

  useEffect(() => {
    // Simulate connection after a short delay
    const timer = setTimeout(() => {
      setIsConnected(true);
      setMessages(MOCK_MESSAGES);
    }, 1000);

    return () => clearTimeout(timer);
  }, [messages]);

  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const mockContext: DialogueContext = useMemo(
    () => ({
      messages,
      isPaused,
      togglePause: (state?: boolean) => {
        const newState = state !== undefined ? state : !isPaused;
        setIsPaused(newState);
        return newState;
      },
      status: {
        value: isConnected ? 'connected' : 'connecting',
      },
      connect: async () => {
        setIsConnected(true);
      },
      disconnect: () => {
        setIsConnected(false);
      },
      isMuted,
      mute: () => setIsMuted(true),
      unmute: () => setIsMuted(false),
      micFft: Array(32)
        .fill(0)
        .map(() => Math.random() * 0.5),
    }),
    [messages, isConnected, isPaused, isMuted],
  );

  return (
    <div className={className}>
      <DialogueContextObject.Provider value={mockContext}>{children}</DialogueContextObject.Provider>
    </div>
  );
}
