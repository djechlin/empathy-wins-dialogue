
import { ConversationReport } from '@/types/conversationReport';

export const mockConversationReport: ConversationReport = {
  overallScore: 72,
  conversationLength: "8m 32s",
  completedSteps: 3,
  totalSteps: 4,
  categories: {
    grabbedAttention: {
      score: 75,
      feedback: "Successfully grabbed their attention and kept them engaged throughout the conversation.",
      examples: [
        "Asked about voting likelihood on 1-10 scale",
        "Successfully elicited their story about their father"
      ]
    },
    storyTelling: {
      score: 85,
      feedback: "Excellent use of vulnerable storytelling! You shared a personal connection and used the word 'love' effectively.",
      examples: [
        "I vote because I love my daughter and want her to have good healthcare",
        "That reminds me of when my mom was sick and couldn't afford her medication"
      ]
    },
    empathicListening: {
      score: 68,
      feedback: "Good listening skills, but could have asked more follow-up questions about their personal experiences.",
      examples: [
        "That sounds really difficult for you",
        "Tell me more about that situation"
      ]
    },
    exploredIssueTogether: {
      score: 60,
      feedback: "Made some personal connections but could have drawn more explicit parallels between your stories.",
      examples: [
        "We both have family members we care about",
        "It sounds like family is important to both of us"
      ]
    }
  },
  keyMoments: [
    {
      timestamp: "2:15",
      type: "positive",
      description: "Successfully shared vulnerable story about loved one",
      quote: "I vote because I love my daughter and want her to have access to good healthcare when she needs it"
    },
    {
      timestamp: "4:22",
      type: "positive", 
      description: "Voter opened up about their father's health struggles",
      quote: "My dad has been dealing with diabetes and the costs are just overwhelming"
    },
    {
      timestamp: "5:45",
      type: "improvement",
      description: "Missed opportunity to ask for the father's name to deepen connection"
    },
    {
      timestamp: "6:30",
      type: "missed_opportunity",
      description: "Could have drawn explicit connection between both caring for family health",
      quote: "Yeah, healthcare is definitely important"
    },
    {
      timestamp: "7:18",
      type: "positive",
      description: "Successfully asked about change in voting likelihood",
      quote: "Does that change how you think about voting at all?"
    }
  ],
  improvements: [
    "Ask for names of people mentioned to create deeper personal connections",
    "Draw more explicit parallels between your story and theirs",
    "Use more reflective listening techniques (\"What I'm hearing is...\")",
    "Allow for longer pauses to let the voter process and share more",
    "Ask follow-up questions about emotions, not just facts"
  ],
  strengths: [
    "Shared vulnerable personal story effectively using the word 'love'",
    "Successfully elicited a personal story from the voter",
    "Maintained empathetic tone throughout the conversation",
    "Asked about voting likelihood and followed script structure",
    "Made the voter feel heard and understood"
  ],
  nextSteps: [
    "Practice asking for names of loved ones mentioned in conversations",
    "Work on reflective listening techniques in the Empathetic Listening module",
    "Try the conversation again focusing on drawing explicit connections between stories",
    "Practice allowing comfortable silences for voters to share more deeply"
  ]
};
