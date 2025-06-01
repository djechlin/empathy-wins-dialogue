
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VoiceContextType, VoiceReadyState } from '@humeai/voice-react';

interface MockVoiceProviderProps {
  children: ReactNode;
  className?: string;
}

const mockMessages = [
  {
    type: 'assistant_message' as const,
    message: {
      role: 'assistant' as const,
      content: "Hi there! I understand you want to talk about healthcare policy. I'm honestly pretty skeptical about government expansion in healthcare. What's your take on this?"
    },
    models: {
      prosody: {
        scores: {
          curiosity: 0.7,
          uncertainty: 0.3
        }
      }
    },
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
        scores: {
          empathy: 0.8,
          curiosity: 0.9
        }
      }
    },
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
        scores: {
          concern: 0.8,
          frustration: 0.4
        }
      }
    },
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
        scores: {
          empathy: 0.9,
          interest: 0.8
        }
      }
    },
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
        scores: {
          sadness: 0.6,
          frustration: 0.7
        }
      }
    },
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
        scores: {
          empathy: 0.95,
          concern: 0.8
        }
      }
    },
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
        scores: {
          gratitude: 0.6,
          skepticism: 0.7
        }
      }
    },
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
        scores: {
          curiosity: 0.8,
          hope: 0.6
        }
      }
    },
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
        scores: {
          contemplation: 0.7,
          uncertainty: 0.6
        }
      }
    },
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
        scores: {
          respect: 0.8,
          curiosity: 0.7
        }
      }
    },
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
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // Simulate connection after a short delay
    const timer = setTimeout(() => {
      setIsConnected(true);
      setMessages(mockMessages);
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
    connect: () => setIsConnected(true),
    disconnect: () => {
      setIsConnected(false);
      setMessages([]);
    },
    readyState: isConnected ? VoiceReadyState.Open : VoiceReadyState.Connecting,
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
