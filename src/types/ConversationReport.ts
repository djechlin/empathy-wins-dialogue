
export interface ConversationReport {
  id: string;
  timestamp: string;
  duration: number;
  participantCount: number;
  issue: string;
  overallScore: number;
  scores: {
    connection: number;
    empathy: number;
    storytelling: number;
    exploration: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    keyMoments: string[];
  };
  transcript: TranscriptEntry[];
}

export interface TranscriptEntry {
  timestamp: string;
  speaker: 'user' | 'participant';
  text: string;
  emotions?: string[];
}

export interface ScoreBreakdown {
  category: string;
  score: number;
  maxScore: number;
  feedback: string;
}
