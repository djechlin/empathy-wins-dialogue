import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qgwoqglzskblebqxlwgo.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnd29xZ2x6c2tibGVicXhsd2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0ODQzNDIsImV4cCI6MjA2MjA2MDM0Mn0.QvIzTYEsUH51Lr97ngQOdftND1j9OabWRWYVaamwToQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Function to create deep canvassing competency assessment prompt
function createCompetencyReportPrompt(transcript) {
  return `You are an expert deep canvassing coach analyzing a conversation between a canvasser and a voter. Your job is to provide comprehensive feedback on the canvasser's use of deep canvassing techniques.

Deep canvassing is about creating genuine human connection through vulnerability, empathetic listening, and helping people explore their own values. Key competencies include:

1. **Grabbed Attention**: How well did the canvasser engage the voter and maintain their interest?
2. **Vulnerability**: Did the canvasser share personal, vulnerable stories using the word "love" and connecting to someone they care about?
3. **Empathetic Listening**: How well did the canvasser listen, reflect, and ask follow-up questions about the voter's feelings and experiences?
4. **Issue Exploration**: Did the canvasser help the voter explore the issue through personal connection rather than facts or arguments?

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
  id: string; // 'attention', 'vulnerability', 'listening', 'exploration'
  name: string; // Display name for the category
  icon: string; // lucide icon name (e.g., 'target', 'heart', 'ear', 'compass')
  score: number; // 1-10 rating for this competency
  feedback: string; // Detailed feedback paragraph
  examples: string[]; // 2-3 specific examples from the conversation
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

// Sample conversation transcript for testing
const sampleTranscript = `
Canvasser: Hi there, I'm Sarah, and I'm here to talk about healthcare access. Can you tell me about someone close to you who really matters to you?

Voter: Well, my mother Linda is really important to me. She's been my rock my whole life.

Canvasser: That's wonderful. What makes Linda so special to you?

Voter: She raised three kids on her own after my dad passed away when I was 12. She worked two jobs to keep us fed and housed. She never complained, just kept going.

Canvasser: That sounds like an incredible woman. I can hear how much you love and respect her. My own mom Maria was similar - she immigrated here from Mexico and worked in factories to give me opportunities she never had. When I was in college, she got really sick but couldn't afford to see a doctor right away because she didn't have good insurance. How is Linda's health these days?

Voter: Actually, that's what worries me most. She's 68 now and has diabetes, but her Medicare doesn't cover all her medications. Sometimes she skips doses to make them last longer, which terrifies me.

Canvasser: That must be so scary for you, knowing she's having to make those impossible choices. It sounds like after everything Linda did for your family, you want to make sure she can get the care she needs without worry.

Voter: Exactly. I feel like it's my turn to take care of her, but the system makes it so hard. She shouldn't have to choose between her medicine and paying rent.

Canvasser: It really sounds like you understand how important healthcare access is for the people we love most. When you think about voting, does Linda cross your mind?

Voter: You know, I usually don't vote much - maybe just for president sometimes. But yeah, thinking about Linda and what she needs... maybe I should be voting for people who will actually help with healthcare costs.
`;

// Generate the prompt using our function
const competencyReportPrompt = createCompetencyReportPrompt(sampleTranscript);

async function testClaudeReport() {
  try {
    console.log('Testing claude-report function...');
    
    const { data, error } = await supabase.functions.invoke('claude-report', {
      body: {
        userMessage: competencyReportPrompt,
      },
    });

    if (error) {
      console.error('Error calling claude-report:', error);
      return;
    }

    console.log('Raw response:', data);

    // Extract JSON from response
    const jsonMatch = data.match(/<json>(.*?)<\/json>/s);
    if (!jsonMatch) {
      console.error('No <json> match in response');
      return;
    }

    try {
      const report = JSON.parse(jsonMatch[1]);
      console.log('\nParsed Report:');
      console.log(JSON.stringify(report, null, 2));
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.log('Raw JSON content:', jsonMatch[1]);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testClaudeReport();