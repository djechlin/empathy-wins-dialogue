// App-specific message types (no Hume types exposed)
export type DialogueMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotions?: Record<string, number>; // Simplified emotion scores
};

export type DialogueContext = {
  messages: DialogueMessage[];
  togglePause: (state?: boolean) => boolean;
  status: 'connected' | 'connecting' | 'not-started' | 'ended' | 'paused';
  connect: () => Promise<void>;
  disconnect: () => void;
  micFft: number[];
};
