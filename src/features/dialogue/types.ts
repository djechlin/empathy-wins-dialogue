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
  isPaused: boolean;
  togglePause: (state?: boolean) => boolean;
  status: { value: string };
  connect: () => Promise<void>;
  disconnect: () => void;
  isMuted: boolean;
  micFft: number[];
};
