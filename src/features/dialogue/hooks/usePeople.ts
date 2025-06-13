import { useDialogue } from '@/features/dialogue';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export interface Person {
  text: string;
  rationale: string;
  context: string;
}

export function usePeople(): { people: Person[] } {
  const { messages } = useDialogue();
  const [people, setPeople] = useState<Person[]>([]);
  const [prevIndex, setPrevIndex] = useState(-1);

  useEffect(() => {
    const newVoterMessages = messages.filter((m, index) => index > prevIndex && m.role === 'assistant');
    if (newVoterMessages.length === 0) {
      return;
    }
    setPrevIndex(messages.length - 1);

    // Only process the most recent voter message
    const latestMessage = newVoterMessages[newVoterMessages.length - 1];

    const userMessage = `You are an assistant that helps identify people mentioned in a conversation. Your job is to identify if the voter mentioned anyone they know, and if so, return a brief (<= 5 word) summary of what the voter said about them.

<message>
${latestMessage.content}
</message>

Respond with JSON, with your answer wrapped in <json> tags. If no people are mentioned, return an empty array:

Output example:
<json>[{"text": "my sister Sarah", "rationale": "struggles with childcare costs", "context": "my sister Sarah struggles with childcare costs"}]</json>`;

    supabase.functions
      .invoke('claude-report', {
        body: {
          userMessage,
        },
      })
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to generate people cues:', error);
          return;
        }

        const jsonMatch = data.match(/<json>(.*?)<\/json>/s);
        if (!jsonMatch) {
          console.error('No <json> match in response:', data);
          return;
        }

        try {
          const newPeople = JSON.parse(jsonMatch[1]) as Person[];
          setPeople((prev) => {
            // Filter out duplicates
            const uniquePeople = newPeople.filter((newPerson) => !prev.some((p) => p.text.toLowerCase() === newPerson.text.toLowerCase()));
            return [...prev, ...uniquePeople];
          });
        } catch (error) {
          console.error('Error parsing people response:', error);
        }
      });
  }, [messages, prevIndex]);

  return { people };
}
