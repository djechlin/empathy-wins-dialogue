import { useDialogue } from '@/features/dialogue';
import nlp from 'compromise';
import { useEffect, useState } from 'react';

export interface Person {
  text: string;
  rationale: string;
}

// Debug state that persists between renders
const debugState = {
  lastProcessedMessage: '',
  peopleDetected: [] as string[],
  nounsDetected: [] as string[],
  possessiveNounsDetected: [] as string[],
};

// Comprehensive list of relationship terms
const relationshipTerms = [
  // Family
  'mom',
  'mother',
  'ma',
  'mama',
  'mommy',
  'dad',
  'father',
  'pa',
  'papa',
  'daddy',
  'sister',
  'brother',
  'daughter',
  'son',
  'wife',
  'husband',
  'spouse',
  'partner',
  'aunt',
  'uncle',
  'niece',
  'nephew',
  'cousin',
  'grandma',
  'grandmother',
  'nana',
  'granny',
  'grandpa',
  'grandfather',
  'papa',
  'granddad',
  'mother-in-law',
  'father-in-law',
  'sister-in-law',
  'brother-in-law',
  'step-mom',
  'step-mother',
  'step-dad',
  'step-father',
  'step-sister',
  'step-brother',
  'half-sister',
  'half-brother',

  // Extended family
  'great-grandma',
  'great-grandmother',
  'great-grandpa',
  'great-grandfather',
  'great-aunt',
  'great-uncle',

  // Professional
  'boss',
  'manager',
  'supervisor',
  'coworker',
  'colleague',
  'workmate',
  'employee',
  'staff',
  'client',
  'customer',
  'mentor',
  'mentee',
  'teacher',
  'professor',
  'instructor',
  'student',
  'pupil',
  'doctor',
  'nurse',
  'therapist',
  'lawyer',
  'attorney',
  'coach',
  'trainer',

  // Social
  'friend',
  'buddy',
  'pal',
  'neighbor',
  'neighbour',
  'roommate',
  'housemate',
  'classmate',
  'schoolmate',
  'teammate',
  'teammate',
  'partner',
  'significant other',
  'boyfriend',
  'girlfriend',
  'fiancé',
  'fiancée',
  'ex',
  'former',

  // Community
  'pastor',
  'priest',
  'minister',
  'doctor',
  'nurse',
  'counselor',
  'counsellor',
  'therapist',
  'psychologist',
  'coach',
  'trainer',

  // Other
  'caregiver',
  'caretaker',
  'guardian',
  'ward',
  'godparent',
  'godmother',
  'godfather',
  'sponsor',
  'mentor',
  'pen pal',
  'penpal',
  'pen friend',
  'penfriend',
];

// Helper to trim punctuation from the end of a string
const trimPunctuation = (str: string): string => {
  return str.replace(/[.,;:!?]+$/, '');
};

// Helper to capitalize first word
const capitalizeFirstWord = (str: string): string => {
  return str
    .split(' ')
    .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
};

export function usePeople(): { people: Person[] } {
  const { messages } = useDialogue();
  const [people, setPeople] = useState<Person[]>([]);
  const [prevIndex, setPrevIndex] = useState(-1);

  useEffect(() => {
    const newMessages = messages.filter((m, index) => index > prevIndex);
    const hasNewMessage = newMessages.length > 0;
    if (!hasNewMessage || messages.length === 0) {
      return;
    }
    setPrevIndex(messages.length - 1);

    // Only process voter messages
    const voterMessages = newMessages.filter((msg) => msg.role === 'assistant');

    voterMessages.forEach((msg) => {
      try {
        const doc = nlp(msg.content);

        // Update debug state
        debugState.lastProcessedMessage = msg.content;
        debugState.peopleDetected = doc.people().out('array').map(trimPunctuation).map(capitalizeFirstWord);
        debugState.nounsDetected = doc.nouns().out('array').map(trimPunctuation).map(capitalizeFirstWord);

        // Only look for "my" + relationship terms
        const myMatches = doc.match('my #Noun').out('array').map(trimPunctuation).map(capitalizeFirstWord);
        debugState.possessiveNounsDetected = myMatches;

        // Combine all potential people mentions
        const allMentions = [
          ...debugState.peopleDetected,
          ...myMatches.filter((n) => relationshipTerms.some((term) => n.toLowerCase().includes(term))),
        ];

        if (allMentions.length > 0) {
          const newPeople = allMentions.map((person) => ({
            text: person,
            rationale: `Mentioned in conversation`,
          }));

          setPeople((prev) => {
            // Filter out duplicates
            const uniquePeople = newPeople.filter((newPerson) => !prev.some((p) => p.text.toLowerCase() === newPerson.text.toLowerCase()));
            return [...prev, ...uniquePeople];
          });
        }
      } catch (error) {
        console.error('Error processing text with compromise:', error);
      }
    });
  }, [messages, prevIndex]);

  return { people };
}

// Export debug state for UI access
export const getDebugState = () => debugState;
