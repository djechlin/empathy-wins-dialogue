
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VoiceContextType, VoiceReadyState, UserTranscriptMessage, AssistantTranscriptMessage } from '@humeai/voice-react';

interface MockVoiceProviderProps {
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
    triumph: 0.2
}

const mockMessages: Array<UserTranscriptMessage | AssistantTranscriptMessage> = [
  {
    type: 'assistant_message' as const,
    message: {
      role: 'assistant' as const,
      content: "Hi there! I understand you want to talk about healthcare policy. I'm honestly pretty skeptical about government expansion in healthcare. What's your take on this?"
    },
    models: {
      prosody: {
        scores: baseScores
      }
    },
    fromText: false,
    id: 'msg-1',
    receivedAt: new Date()
  },
  {
    type: 'user_message' as const,
    message: {
      role: 'user' as const,
      content: "I appreciate you sharing that perspective. Can you tell me a bit about what makes you feel skeptical about it?"
    },
    models: {
      prosody: {
                scores: baseScores

      }
    },
    fromText: false,
    interim: false,
    time: { begin: 1000, end: 5000 },
    receivedAt: new Date()
  },
  {
    type: 'assistant_message' as const,
    message: {
      role: 'assistant' as const,
      content: "Well, I just worry about costs and efficiency. Government programs tend to be expensive and bureaucratic. I've had bad experiences with government services before."
    },
    models: {
      prosody: {
                scores: baseScores

      }
    },
    fromText: false,
    id: 'msg-2',
    receivedAt: new Date()
  },
  {
    type: 'user_message' as const,
    message: {
      role: 'user' as const,
      content: "That sounds really frustrating. Can you share more about those experiences you mentioned?"
    },
    models: {
      prosody: {
                scores: baseScores

      }
    },
    fromText: false,
    interim: false,
    time: { begin: 6000, end: 10000 },
    receivedAt: new Date()
  },
  {
    type: 'assistant_message' as const,
    message: {
      role: 'assistant' as const,
      content: "Yeah, when my mom needed Medicare help, it took months of paperwork and phone calls. It was such a hassle when she was already sick."
    },
    models: {
      prosody: {
               scores: baseScores

      }
    },
    fromText: false,
    id: 'msg-3',
    receivedAt: new Date()
  },
  {
    type: 'user_message' as const,
    message: {
      role: 'user' as const,
      content: "I'm so sorry you and your mom went through that. That must have been incredibly stressful during an already difficult time."
    },
    models: {
      prosody: {
               scores: baseScores

      }
    },
    fromText: false,
    interim: false,
    time: { begin: 11000, end: 16000 },
    receivedAt: new Date()
  },
  {
    type: 'assistant_message' as const,
    message: {
      role: 'assistant' as const,
      content: "Thanks for saying that. It really was tough. I guess I just don't trust that expanding healthcare will make things better."
    },
    models: {
      prosody: {
               scores: baseScores

      }
    },
    fromText: false,
    id: 'msg-4',
    receivedAt: new Date()
  },
  {
    type: 'user_message' as const,
    message: {
      role: 'user' as const,
      content: "I understand that concern completely. What if there were ways to expand access while also improving the experience you had?"
    },
    models: {
      prosody: {
               scores: baseScores

      }
    },
    fromText: false,
    interim: false,
    time: { begin: 17000, end: 22000 },
    receivedAt: new Date()
  },
  {
    type: 'assistant_message' as const,
    message: {
      role: 'assistant' as const,
      content: "Hmm, I suppose if they could actually streamline things and make it less bureaucratic... but I'm still not sure it would work."
    },
    models: {
      prosody: {
               scores: baseScores

      }
    },
    fromText: false,
    id: 'msg-5',
    receivedAt: new Date()
  },
  {
    type: 'user_message' as const,
    message: {
      role: 'user' as const,
      content: "That makes total sense. Would you be open to hearing about some specific aspects of this proposal that might address those concerns?"
    },
    models: {
      prosody: {
               scores: baseScores

      }
    },
    fromText: false,
    interim: false,
    time: { begin: 23000, end: 28000 },
    receivedAt: new Date()
  }
];

const MockVoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useMockVoice = () => {
  const context = useContext(MockVoiceContext);
  if (!context) {
    throw new Error('useMockVoice must be used within a MockVoiceProvider');
  }
  return context;
};

export function MockVoiceProvider({ children, className }: MockVoiceProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<(UserTranscriptMessage | AssistantTranscriptMessage)[]>([]);

  useEffect(() => {
    // Simulate connection after a short delay
    const timer = setTimeout(() => {
      setIsConnected(true);
      setMessages(mockMessages as unknown as (UserTranscriptMessage | AssistantTranscriptMessage)[]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const mockContext: VoiceContextType = {
    messages,
    status: {
      value: isConnected ? 'connected' : 'disconnected'
    },
    isMuted: false,
    unmute: async () => {},
    mute: async () => {},
    connect: async () => setIsConnected(true),
    disconnect: () => {
      setIsConnected(false);
      setMessages([]);
    },
    fft: [3,4,5],
    muteAudio: async() => {},
    unmuteAudio: async () => {},
    error: null,
    isSocketError: false,
    callDurationTimestamp: '2025-01-01',
    toolStatusStore: null,
    isError: false,
    playerQueueLength: 0,
    isMicrophoneError: false,
    isPaused: false,
    volume: 3,
    setVolume: () => {},
    chatMetadata: null,
    lastUserMessage: mockMessages[mockMessages.length - 1] as UserTranscriptMessage,
    isAudioMuted: false,
    isAudioError: false,
    readyState: isConnected ? VoiceReadyState.OPEN : VoiceReadyState.CONNECTING,
    micFft: Array.from(new Uint8Array(0)),
    sendAssistantInput: () => {},
    sendUserInput: () => {},
    sendSessionSettings: () => {},
    sendToolMessage: () => {},
    clearMessages: () => setMessages([]),
    lastVoiceMessage: null,
    isPlaying: false,
    pauseAssistant: () => {},
    resumeAssistant: () => {}
  };

  return (
    <div className={className}>
      <MockVoiceContext.Provider value={mockContext}>
        {children}
      </MockVoiceContext.Provider>
    </div>
  );
}
