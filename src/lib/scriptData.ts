import {Script, Step, Scenario, ScenarioId} from '@/types';

export const SCRIPT_TITLES: { [key in ScenarioId]: string } = {
  'deep-canvassing': 'Script',
  'law-order-voter': 'Law & Order Voter Script',
  'code-review-junior-feedback': 'Code Review Feedback Script',
  'intro-canvassing': 'Candidate Introduction Script',
  'busy-voter-libraries': 'Library Funding Script',
  'empathetic-listening': 'Empathetic Listening Script',
  'love-list': 'Love list'
};

export const HUME_PERSONAS: { [key in ScenarioId]: string } = {
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
      items: [
        {
          text: 'Try to gauge their support for your issue early. Ask them how they feel on a scale of 1-10.',
          triggers: ['scale', '10', 'ten'],
        }
      ]
    },
    {
      name: 'Try to persuade them'!,
      items: [
        {
          text: 'Persuade as you normally would. As you roleplay feel free to improvise any details about the issue or your background.',
        },
        {
          text: 'Click for a hint',
          hint: hint,
        }
      ]
    },
    {
      name: 'End the conversation when you\'re ready',
      items: [
        {
          text: 'The roleplayer won\'t hang up, so you have to. Before you go, ask them how they feel about the issue on that 1-10 scale again and see if they\'ve changed their mind at all.',
        }
      ]
    }
  ]
}

export const SCRIPTS: { [key in ScenarioId]: Script } = {
  'love-list': [

  ],
  'empathetic-listening': [
    {
      name: '1. Practice empathetic listening',
      items: [
        {
          text: 'Practice using the HEAR method and empathetic listening techniques with a voter.',
          triggers: ['empathetic', 'listening', 'HEAR'],
        },
      ],
    },
  ],
  'intro-canvassing': [
    {
      name: '1. Introduce the candidate',
      items: [
        {
          text: 'Introduce yourself as a canvasser and talk about the candidate you represent. Explain briefly what makes your candidate special.',
          triggers: ['introducing', 'candidate', 'canvassing', 'represent'],
        },
      ],
    },
    {
      name: "2. Elicit about the voter's concerns",
      items: [
        {
          text: 'Learn what issues matter to the voter.',
          triggers: ['landlord', 'housing', 'rent', 'apartment'],
          hint: 'Ask about her landlord situation to hear her personal housing story.'
        },
      ],
    },
    {
      name: '3. Invite to campaign office',
      items: [
        {
          text: 'Ask the voter to swing by the campaign office. Give a specific day or time if possible.',
          triggers: ['campaign office', 'stop by', 'swing by', 'visit'],
        },
      ],
    },
  ],
  'code-review-junior-feedback': [
    {
      name: '1. Receiving feedback',
      items: [
        {
          text: "Your junior colleague is giving you feedback. They think you've been too nitpicky on code reviews. They'll be quite standoffish.",
          triggers: ['nitpicky', 'feedback', 'code reviews'],
        },
      ],
    },
    {
      name: '2. Finding solutions',
      items: [
        {
          text: 'Try to find a constructive solution to the feedback.',
          triggers: ['pair program', 'pair coding', 'work together'],
          hint: 'When you offer to pair program the junior colleague will be happy.'
        },
      ],
    },
  ],
  'deep-canvassing': [
    {
      name: "1. Why you're here",
      items: [
        {
          text: '"Hi, I\'m [name], talking to voters today about expanding bike access in the city. How do you feel about that?"',
          triggers: ['bike', 'access', 'city'],

        },
        {
          text: '"Thanks for sharing that. And you know there\'s a primary election this June, on a scale of 1 to 10, how likely are you to vote?"',
          triggers: ['june', 'scale', '1 to 10', 'one to ten'],

        },
        {
          text: '"Gotcha. And why is that the right number for you?"',
          triggers: ['right number'],
        },
      ],
    },
    {
      name: '2. Share your story',
      items: [
        {
          text: '"Thanks so much. For me, voting isn\'t just political, it\'s also personal. I vote because I love [share your personal connection]..."',
          triggers: ["isn't just political", 'personal', 'love'],
        },
        {
          text: 'Use the word "love"! And say the person\'s name.',

          hint: `Here's an example story:

"I think of my husband Jim. We were barely making ends meet back in the 90s - still had teen band posters but didn't know how to make rent. That first Christmas together, I was determined to get him a present.

I remember standing in that dusty record shop, hands shaking a little as I slid my rare vinyl across the counter. 'You sure about this?' the dealer asked, eyebrows raised. I nodded, thinking of Jim's face when he'd open the guitar case I'd bought with that money. The leather smell of that handcrafted strap, how perfectly it would match his uncle's vintage guitar. Worth it.

Christmas Eve came, and Jim handed me a wrapped package. Inside was a record by the same band I'd just sold. His eyes sparkled as he told me he'd been secretly giving guitar lessons on weekends to save up. I burst out laughing right there - couldn't help it. And you know, we felt pretty good that Christmas. It was just the two of us, like we wanted it. We didn't have much, but I loved him and I really knew he loved me."`
        },
      ],
    },
    {
      name: '3. Elicit their personal story',
      items: [
        {
          text: '"Is there someone who comes to mind who you love?',
          triggers: ['comes to mind', 'who you love'],
        },
        {
          text: '[Idea 2] "Is there someone who\'s been there for you, or who you\'ve been there for?"',
          triggers: ['there for you', "you've been there for"],
        },
        {
          text: '[Idea 3]"Have there been any big changes in your life lately? Who was around when you were going through that?"',
          triggers: ['big changes', 'who was around'],
        },
        {
          text: "Don't give up, this part's hard. Make sure to ask their person's name.",
        },
      ],
    },
    {
      name: '4. Finish up',
      items: [
        {
          text: '"So the people we both love are very important to us. I want to ask, does that change how you think about voting at all?"',
          triggers: ['we both love', 'change how you think'],
        },
        {
          text: '"Now going back to that 1-10 scale, where would you say you are now?"',
          triggers: ['going back', 'you are now'],
        },
        {
          text: '"Is there anything about our conversation you thought was interesting?"',
          triggers: ['our conversation', 'was interesting'],
        },
        {
          text: 'Thanks so much! Have a great day.',
          triggers: ['have a great day'],
        },
      ],
    },
  ],
  'law-order-voter': [
    {
      name: '1. Introduce yourself and elicit',
      items: [
        {
          text: '"I\'m with Shashi, the Democratic candidate for mayor, in the neighborhood today to ask voters what issues matter most to them this fall. What\'s on your mind?"',
          triggers: ['shashi', 'democratic candidate', 'mayor', 'issues'],
        },
      ],
    },
    {
      name: '2. Discuss immigration and law enforcement',
      items: [
        {
          text: 'In this roleplay, the voter is looking for specific commitments from the Democratic candidate. Give a specific commitment with the word "enforce" for this step.',
          triggers: ['enforce', 'enforcement'],
        },
      ],
    },
    {
      name: '3. Ask about other issues',
      items: [
        {
          text: '"Are there any other issues on your mind today?"',
          triggers: ['other issues', 'on your mind'],
        },
        {
          text: 'For this roleplay, the voter is open to hearing about the Democrat after hearing about an immigration commitment. Share one more reason to vote for the Democrat here.',
        },
      ],
    },
  ],
  'busy-voter-libraries': [
    {
      name: 'Starting the conversation',
      items: [
        {
          text: '"My name\'s Jill, I\'m talking to voters about increase funding for our libraries, is this Adam?"',
          triggers: ['jill', 'increase funding', 'libraries', 'adam'],
        },
        {
          text: 'If the voter says they\'re busy, continue',
        },
        {
          text: '"Great, real quick on a scale of 1-10, where 1 means you\'re opposed and 10 means you definitely support increasing library funding, what number is right for you?"',
          triggers: ['scale', '1-10', 'opposed', 'support increasing', 'library funding', 'right for you'],
        },
      ],
    },
  ],
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
