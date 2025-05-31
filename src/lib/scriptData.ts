export type Step = {
  name: string;
  description: Array<{ text: string; triggers?: string[]; isScript: boolean, hint?: string }>;
};

export type Script = Step[];

export type ScenarioId =
  | 'challenge-lgbt'
  | 'challenge-climate'
  | 'challenge-healthcare'
  | 'challenge-voting'
  | 'challenge-bikes'
  | 'deep-canvassing'
  | 'law-order-voter'
  | 'code-review-junior-feedback'
  | 'intro-canvassing'
  | 'busy-voter-libraries'
  | 'empathetic-listening'
  | 'love-list';

export const SCRIPT_TITLES: { [key in ScenarioId]: string } = {
  'challenge-lgbt': 'Script',
  'challenge-climate': 'Script',
  'challenge-healthcare': 'Script',
  'challenge-voting': 'Script',
  'challenge-bikes': 'Script',
  'deep-canvassing': 'Script',
  'law-order-voter': 'Law & Order Voter Script',
  'code-review-junior-feedback': 'Code Review Feedback Script',
  'intro-canvassing': 'Candidate Introduction Script',
  'busy-voter-libraries': 'Library Funding Script',
  'empathetic-listening': 'Empathetic Listening Script',
  'love-list': 'Love list'
};

export const HUME_PERSONAS: { [key in ScenarioId]: string } = {
    'challenge-lgbt': '2befee5d-0661-403a-98d7-65e515f05e22',
  'challenge-climate': '2befee5d-0661-403a-98d7-65e515f05e22',
  'challenge-healthcare': '2befee5d-0661-403a-98d7-65e515f05e22',
  'challenge-voting': '2befee5d-0661-403a-98d7-65e515f05e22',
  'challenge-bikes': '2befee5d-0661-403a-98d7-65e515f05e22',
  'deep-canvassing': 'ad21affc-6037-4af2-b7c0-95f04279169a',
  'law-order-voter': '419a04ee-8457-4f9b-8e2f-d5ae4f632597',
  'code-review-junior-feedback': 'ba08f302-361f-43fa-886b-4eacd2691fe3',
  'intro-canvassing': '8e875e6a-83f5-4f97-a5f8-dcddb4ba9b6c',
  'busy-voter-libraries': 'd3b113c7-3e87-49a2-b400-1b155b514d0a',
  'empathetic-listening': 'd3b113c7-3e87-49a2-b400-1b155b514d0a',
  'love-list': 'd3b113c7-3e87-49a2-b400-1b155b514d0a'
};

function challengeScript(hint: string): Script {
  return [
    {
      name: 'You knock on the door - they answer',
      description: [
        {
          text: 'Try to gauge their support for your issue early. Ask them how they feel on a scale of 1-10.',
          triggers: ['scale', '10', 'ten'],
          isScript: true
        }
      ]
    },
    {
      name: 'Try to persuade them'!,
      description: [
        {
          text: 'Persuade as you normally would. As you roleplay feel free to improvise any details about the issue or your background.',
          isScript: true
        },
        {
          text: 'Check for a hint',
          hint: hint,
          isScript: false
        }
      ]
    }
  ]
}

export const SCRIPTS: { [key in ScenarioId]: Script } = {
  'challenge-bikes': challengeScript('Share a fond memory you have of your city, like your first date or a memorable day in the park. Describe the person you spent it with, if you can.'),
  'challenge-healthcare': challengeScript('Ask if they know anyone who has lost their job recently, or had trouble seeing a doctor.'),
  'challenge-climate': challengeScript('Ask who in their community was impacted by the recent weather event. Improvise a hurricane or wildfire.'),
  'challenge-lgbt': challengeScript('Ask if they know any LGBT people. Ask how they know them, what they\'re like, etc.'),
  'challenge-voting': challengeScript('This one\'s hard! But if you share a story of your loved one and ask them for a similar story, they may start thinking of how voting connects them to people around them.'),
  'love-list': [

  ],
  'empathetic-listening': [
    {
      name: '1. Practice empathetic listening',
      description: [
        {
          text: 'Practice using the HEAR method and empathetic listening techniques with a voter.',
          triggers: ['empathetic', 'listening', 'HEAR'],
          isScript: true,
        },
      ],
    },
  ],
  'intro-canvassing': [
    {
      name: '1. Introduce the candidate',
      description: [
        {
          text: 'Introduce yourself as a canvasser and talk about the candidate you represent. Explain briefly what makes your candidate special.',
          triggers: ['introducing', 'candidate', 'canvassing', 'represent'],
          isScript: true,
        },
      ],
    },
    {
      name: "2. Elicit about the voter's concerns",
      description: [
        {
          text: 'Learn what issues matter to the voter.',
          triggers: ['landlord', 'housing', 'rent', 'apartment'],
          isScript: true,
        },
      ],
    },
    {
      name: '3. Invite to campaign office',
      description: [
        {
          text: 'Ask the voter to swing by the campaign office. Give a specific day or time if possible.',
          triggers: ['campaign office', 'stop by', 'swing by', 'visit'],
          isScript: true,
        },
      ],
    },
  ],
  'code-review-junior-feedback': [
    {
      name: '1. Receiving feedback',
      description: [
        {
          text: "Your junior colleague is giving you feedback. They think you've been too nitpicky on code reviews. They'll be quite standoffish.",
          triggers: ['nitpicky', 'feedback', 'code reviews'],
          isScript: true,
        },
      ],
    },
    {
      name: '2. Finding solutions',
      description: [
        {
          text: 'Try to find a constructive solution to the feedback.',
          triggers: ['pair program', 'pair coding', 'work together'],
          isScript: false,
        },
      ],
    },
  ],
  'deep-canvassing': [
    {
      name: "1. Why you're here",
      description: [
        {
          text: '"Hi, I\'m [name], talking to voters today about expanding bike access in the city. How do you feel about that?"',
          triggers: ['bike', 'access', 'city'],
          isScript: true,
        },
        {
          text: '"Thanks for sharing that. And you know there\'s a primary election this June, on a scale of 1 to 10, how likely are you to vote?"',
          triggers: ['june', 'scale', '1 to 10', 'one to ten'],
          isScript: true,
        },
        {
          text: '"Gotcha. And why is that the right number for you?"',
          triggers: ['right number'],
          isScript: true,
        },
      ],
    },
    {
      name: '2. Share your story',
      description: [
        {
          text: '"Thanks so much. For me, voting isn\'t just political, it\'s also personal. I vote because I love [share your personal connection]..."',
          triggers: ["isn't just political", 'personal', 'love'],
          isScript: true,
        },
        {
          text: 'Use the word "love"! And say the person\'s name.',
          isScript: false,
        },
      ],
    },
    {
      name: '3. Elicit their personal story',
      description: [
        {
          text: '"Is there someone who comes to mind who you love?',
          triggers: ['comes to mind', 'who you love'],
          isScript: true,
        },
        {
          text: '[Idea 2] "Is there someone who\'s been there for you, or who you\'ve been there for?"',
          triggers: ['there for you', "you've been there for"],
          isScript: true,
        },
        {
          text: '[Idea 3]"Have there been any big changes in your life lately? Who was around when you were going through that?"',
          triggers: ['big changes', 'who was around'],
          isScript: true,
        },
        {
          text: "Don't give up, this part's hard. Make sure to ask their person's name.",
          isScript: false,
        },
      ],
    },
    {
      name: '4. Finish up',
      description: [
        {
          text: '"So the people we both love are very important to us. I want to ask, does that change how you think about voting at all?"',
          triggers: ['we both love', 'change how you think'],
          isScript: true,
        },
        {
          text: '"Now going back to that 1-10 scale, where would you say you are now?"',
          triggers: ['going back', 'you are now'],
          isScript: true,
        },
        {
          text: '"Is there anything about our conversation you thought was interesting?"',
          triggers: ['our conversation', 'was interesting'],
          isScript: true,
        },
        {
          text: 'Thanks so much! Have a great day.',
          triggers: ['have a great day'],
          isScript: true,
        },
      ],
    },
  ],
  'law-order-voter': [
    {
      name: '1. Introduce yourself and elicit',
      description: [
        {
          text: '"I\'m with Shashi, the Democratic candidate for mayor, in the neighborhood today to ask voters what issues matter most to them this fall. What\'s on your mind?"',
          triggers: ['shashi', 'democratic candidate', 'mayor', 'issues'],
          isScript: true,
        },
      ],
    },
    {
      name: '2. Discuss immigration and law enforcement',
      description: [
        {
          text: 'In this roleplay, the voter is looking for specific commitments from the Democratic candidate. Give a specific commitment with the word "enforce" for this step.',
          triggers: ['enforce', 'enforcement'],
          isScript: true,
        },
      ],
    },
    {
      name: '3. Ask about other issues',
      description: [
        {
          text: '"Are there any other issues on your mind today?"',
          triggers: ['other issues', 'on your mind'],
          isScript: true,
        },
        {
          text: 'For this roleplay, the voter is open to hearing about the Democrat after hearing about an immigration commitment. Share one more reason to vote for the Democrat here.',
          isScript: false,
        },
      ],
    },
  ],
  'busy-voter-libraries': [
    {
      name: 'Starting the conversation',
      description: [
        {
          text: '"My name\'s Jill, I\'m talking to voters about increase funding for our libraries, is this Adam?"',
          triggers: ['jill', 'increase funding', 'libraries', 'adam'],
          isScript: true,
        },
        {
          text: 'If the voter says they\'re busy, continue',
          isScript: false,
        },
        {
          text: '"Great, real quick on a scale of 1-10, where 1 means you\'re opposed and 10 means you definitely support increasing library funding, what number is right for you?"',
          triggers: ['scale', '1-10', 'opposed', 'support increasing', 'library funding', 'right for you'],
          isScript: true,
        },
      ],
    },
  ],
};

export const EXAMPLE_STORY = `"I think of my husband Jim. We were barely making ends meet back in the 90s - still had teen band posters but didn't know how to make rent. That first Christmas together, I was determined to get him a present.

I remember standing in that dusty record shop, hands shaking a little as I slid my rare vinyl across the counter. 'You sure about this?' the dealer asked, eyebrows raised. I nodded, thinking of Jim's face when he'd open the guitar case I'd bought with that money. The leather smell of that handcrafted strap, how perfectly it would match his uncle's vintage guitar. Worth it.

Christmas Eve came, and Jim handed me a wrapped package. Inside was a record by the same band I'd just sold. His eyes sparkled as he told me he'd been secretly giving guitar lessons on weekends to save up. I burst out laughing right there - couldn't help it. And you know, we felt pretty good that Christmas. It was just the two of us, like we wanted it. We didn't have much, but I loved him and I really knew he loved me."`;

export type Scenario = {
  title: string;
  description: string[];
};

export const SCENARIOS: { [key in ScenarioId]: Scenario } = {
  'love-list': {
    title: 'Love list',
    description: ['Love list exercise']
  },
  'empathetic-listening': {
    title: 'Practice Empathetic Listening',
    description: [
      'Practice using the HEAR method and empathetic listening techniques.',
      'Focus on noticing clues, asking about people in their life, and using reflection.',
    ],
  },
  'deep-canvassing': {
    title: 'Practice Deep Canvassing',
    description: [
      'You will talk with a voice assistant roleplaying a low-turnout voter and follow a deep canvassing script.',
      'The script emphasizes telling a personal story about a loved one, then eliciting a story from the voter.',
    ],
  },
  'law-order-voter': {
    title: 'Persuade a Law & Order Voter',
    description: [
      'You will talk to a voice assistant roleplaying a swing voter who is conservative on immigration, but undecided.',
      'The script emphasizes eliciting with questions, then finding common ground.',
    ],
  },
  'code-review-junior-feedback': {
    title: 'Handle Junior Colleague Feedback',
    description: [
      "You will talk with a junior colleague who thinks you've been too nitpicky on code reviews.",
      'Practice receiving feedback professionally and finding constructive solutions.',
    ],
  },
  'intro-canvassing': {
    title: 'Introduce a Candidate',
    description: [
      'Practice a canvassing conversation where you introduce a candidate, share your personal story, and invite the voter to the campaign office.',
      'This script focuses on making a personal connection and effective invitations.',
    ],
  },
  'busy-voter-libraries': {
    title: 'Engage a Busy Voter - Library Funding',
    description: [
      'Practice engaging with a voter who mentions being busy while discussing library funding.',
      'Apply the "door is open" principle - if they keep talking, they\'re still engaged in the conversation.',
    ],
  },
};
