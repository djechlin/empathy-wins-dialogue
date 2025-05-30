
export interface ConversationReport {
  overallScore: number; // 0-100
  conversationLength: string;
  completedSteps: number;
  totalSteps: number;
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
  score: number; // 0-100
  feedback: string;
  examples: string[];
}

export interface KeyMoment {
  timestamp: string;
  type: 'positive' | 'improvement' | 'missed_opportunity';
  description: string;
  quote?: string;
}
