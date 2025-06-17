import { ConversationReport } from '@/types/conversationReport';

export const sampleReport: ConversationReport = {
  baseScore: 3,
  currentScore: 6,
  completedSteps: 3,
  summary:
    "Great progress! You successfully moved this voter from a 3 to a 6 - that's meaningful change. Your vulnerability when sharing about Karen was powerful and created real connection. To deepen your impact even further, focus on drawing more explicit parallels between your stories and asking for names of the people voters mention. These approaches will help you create even stronger bonds and drive greater persuasion.",
  categories: [
    {
      id: 'attention',
      name: 'Grabbed Attention',
      icon: 'target',
      score: 8,
      feedback:
        "Excellent opening! You introduced yourself and the issue clearly, then immediately moved to the 1-10 question. This is exactly what deep canvassing recommends - no 'exit phrases' or small talk, just straight to the point.",
      examples: [
        {
          quote: "hey I'm here to talk about expanding bike lane access!",
          type: 'positive',
          analysis: 'Direct, clear introduction without small talk',
        },
        { quote: 'Immediate 1-10 question without delays', type: 'positive', analysis: 'Got straight to the point efficiently' },
      ],
    },
    {
      id: 'vulnerability',
      name: 'Vulnerability',
      icon: 'heart',
      score: 4,
      feedback:
        'You started to share personal details about Karen and your first date, which was a good beginning. However, the vulnerability felt surface-level. Deep canvassing asks you to name someone you love, say what you love about them, and describe a moment they were really there for you. Your story stayed at the facts level rather than showing deep emotional connection.',
      examples: [
        {
          quote: 'Mentioned Karen and your first date at the wine bar',
          type: 'negative',
          analysis: "Stayed at surface level, didn't share what you love about her",
        },
        {
          quote: "Shared that you've been married for a year",
          type: 'negative',
          analysis: 'Gave facts instead of vulnerable emotional connection',
        },
      ],
    },
    {
      id: 'listening',
      name: 'Empathic Listening',
      icon: 'ear',
      score: 7,
      feedback:
        "Great job practicing reflection and picking up on the voter's interests! You noticed their love for the neighborhood, walking downtown, and the farmers market. You used their words back to them and built on their interests. This created genuine connection.",
      examples: [
        {
          quote: 'Asked about what they enjoy in the neighborhood',
          type: 'positive',
          analysis: 'Good question to understand their connection to place',
        },
        {
          quote: 'Reflected their concerns about parking and restaurant closures',
          type: 'positive',
          analysis: 'Showed you were listening to their specific concerns',
        },
        { quote: 'Built on their mention of the park and exercise', type: 'positive', analysis: 'Connected to their interests and values' },
      ],
    },
    {
      id: 'exploration',
      name: 'Issue Exploration',
      icon: 'compass',
      score: 6,
      feedback:
        'You did well avoiding fact-dumping and political jargon. You kept the conversation personal and connected to their experience. However, you could have asked more probing questions about their feelings and experiences rather than mostly sharing your own perspective.',
      examples: [
        {
          quote: 'Connected bike lanes to their restaurant experiences',
          type: 'positive',
          analysis: 'Made the issue personally relevant to their life',
        },
        {
          quote: 'Avoided political terminology and statistics',
          type: 'positive',
          analysis: 'Kept conversation personal rather than policy-focused',
        },
        {
          quote: 'Let them draw their own conclusions about community benefits',
          type: 'positive',
          analysis: 'Guided discovery rather than lecturing',
        },
      ],
    },
  ],
  keyMoments: [
    {
      timestamp: 'Early conversation',
      type: 'positive',
      description: 'Perfect opening technique - direct introduction and immediate 1-10 question',
      quote:
        "hey I'm here to talk about expanding bike lane access! I want to ask real quick, when you think of your support for bike lanes on a scale of 1 to 10...",
    },
    {
      timestamp: 'Mid conversation',
      type: 'missed_opportunity',
      description:
        'When sharing about Karen, you could have gone deeper into vulnerability by describing what you love about her or a moment she was there for you',
      quote: "my first date was with a woman Karen and we're still together, we got married just a year ago",
    },
    {
      timestamp: 'Mid conversation',
      type: 'positive',
      description: 'Excellent reflection and connection to their interests in the neighborhood',
      quote: 'I was just wondering what have you enjoyed doing around the neighborhood lately?',
    },
    {
      timestamp: 'Late conversation',
      type: 'improvement',
      description: 'Good conclusion with second 1-10 ask, but could have explored their feelings more deeply before moving to close',
      quote: "I guess you're thinking of it a bit differently now, if I ask you on a 1 to 10 where would you place yourself?",
    },
  ],
  improvements: [
    'Deepen your vulnerability by sharing what you love about Karen and a specific moment she was there for you',
    "Ask more questions about the voter's feelings and experiences rather than sharing your own perspective",
    'When they share something personal (like their anniversary at the wine bar), dig deeper with follow-up questions',
    'Explore their initial skepticism more - ask what specifically concerns them about bike lanes',
  ],
  strengths: [
    'Excellent opening technique - direct and efficient',
    'Great use of reflection and active listening',
    'Successfully avoided political jargon and fact-dumping',
    'Built genuine connection around shared neighborhood experiences',
    'Helped the voter reach their own conclusions organically',
  ],
  nextSteps: [
    'Practice sharing a vulnerable story about someone you love - include what you love about them and a moment they supported you',
    "Work on asking more probing questions about the voter's feelings and experiences",
    'Practice the pause - give voters more space to share after you ask questions',
    "Focus on exploring the voter's initial concerns more deeply before sharing your perspective",
  ],
};
