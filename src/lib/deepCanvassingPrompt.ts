/**
 * Generate a deep canvassing competency assessment prompt for claude-report
 *
 * This prompt analyzes conversations for deep canvassing techniques and returns
 * structured feedback following the ConversationReport interface.
 *
 * @param transcript The conversation transcript to analyze
 * @returns A formatted prompt string for claude-report
 */
export function createCompetencyReportPrompt(transcript: string): string {
  return `You are an expert deep canvassing coach analyzing a conversation between a canvasser and a voter. Your job is to provide comprehensive feedback on the canvasser's use of deep canvassing techniques.

Deep canvassing is about creating genuine human connection through vulnerability, empathetic listening, and helping people explore their own values. Key competencies include:

1. **Don't Lecture**: Avoid giving facts, statistics, or policy arguments. Instead focus on personal stories and emotional connection.
2. **Dig Deeper**: Ask follow-up questions about feelings, experiences, and the people in the voter's life. Explore their emotions and personal connections.
3. **Personal Framing**: Share vulnerable personal stories that connect to the issue. Use names and specific details about people you care about.
4. **Explore by Questions**: Help the voter discover their own thoughts and feelings through questions rather than telling them what to think.

Analyze this conversation and provide detailed feedback:

<conversation>
${transcript}
</conversation>

Your response should be structured JSON wrapped in <json> tags that matches this TypeScript interface:

interface ConversationReport {
  baseScore: number; // 1-10 (voter's initial position on the issue)
  currentScore: number; // 1-10 (voter's final position after conversation) 
  completedSteps: number; // How many deep canvassing steps were completed (1-4)
  summary: string; // 2-3 sentence personalized summary of performance
  categories: CategoryScore[]; // Analysis of each competency
  keyMoments: KeyMoment[]; // 3-5 key moments from the conversation
  improvements: string[]; // 3-5 specific areas for improvement
  strengths: string[]; // 3-5 things the canvasser did well
  nextSteps: string[]; // 3-5 actionable next steps for learning
}

interface CategoryScore {
  id: string; // 'dont_lecture', 'dig_deeper', 'personal_framing', 'explore_by_questions'
  name: string; // Display name for the category
  icon: string; // lucide icon name (e.g., 'message-x', 'search', 'heart', 'help-circle')
  score: number; // 1-10 rating for this competency
  feedback: string; // Detailed feedback paragraph
  examples: ExampleQuote[]; // 2-4 specific examples from the conversation with analysis
}

interface ExampleQuote {
  quote: string; // Direct quote from the conversation
  type: 'positive' | 'negative'; // Whether this is a good or bad example
  analysis: string; // Short explanation of why this is good/bad
}

interface KeyMoment {
  timestamp: string; // Approximate time or "Early/Mid/Late conversation"
  type: 'positive' | 'improvement' | 'missed_opportunity';
  description: string; // What happened and why it's significant
  quote?: string; // Optional direct quote from conversation
}

Focus on deep canvassing principles:
- Personal vulnerability creates connection
- Asking about feelings, not just facts  
- Listening for and naming people in the voter's life
- Helping voters explore their own values
- Moving from initial skepticism to openness through genuine connection
- Using the voter's own words and experiences to help them reach conclusions

Provide specific, actionable feedback that will help the canvasser improve their deep canvassing skills.

<json>`;
}
