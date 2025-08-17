export interface ConversationReport {
  baseScore: number; // 1-10 (starting score)
  currentScore: number; // 1-10 (current score after conversation)
  completedSteps: number;
  summary: string; // AI-generated personalized summary
  categories: CategoryScore[];
  keyMoments: KeyMoment[];
  improvements: string[];
  strengths: string[];
  nextSteps: string[];
}

export interface CategoryScore {
  id: string;
  name: string;
  icon: string; // lucide icon name
  score: number; // 1-10
  feedback: string;
  examples: ExampleQuote[];
}

export interface ExampleQuote {
  quote: string; // Direct quote from the conversation
  type: 'positive' | 'negative'; // Whether this is a good or bad example
  analysis: string; // Short explanation of why this is good/bad
}

export interface KeyMoment {
  timestamp: string;
  type: 'positive' | 'improvement' | 'missed_opportunity';
  description: string;
  quote?: string;
}