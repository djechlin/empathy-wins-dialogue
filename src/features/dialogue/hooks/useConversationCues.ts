import { useDialogue } from '@/features/dialogue';
import { useEffect, useState } from 'react';
import { generateCues } from '../../../edge/generateConversationCues';
import { Cue } from '../../../edge/types';
import { DialogueMessage } from '../types';

const concatTranscript = (msgs: DialogueMessage[]) => {
  return msgs
    .map((msg) => {
      if (msg.role === 'voter_narrator') {
        return `Narrator: ${msg.content}`;
      }
      const role = msg.role === 'user' ? 'Canvasser' : 'Voter';
      return `${role}: ${msg.content}`;
    })
    .join('\n');
};

export interface CueManagementResult {
  activeCues: Cue[];
}

export function useCues(initialCue?: { organization: string; plainLanguage: string }): CueManagementResult {
  const { messages } = useDialogue();
  const [prevIndex, setPrevIndex] = useState(-1);

  // Initialize with opening script if provided
  const [activeCues, setActiveCues] = useState<Cue[]>(() => {
    if (initialCue) {
      return [
        {
          text: `My name is [your name], I'm here with ${initialCue.organization} to talk about ${initialCue.plainLanguage}.`,
          rationale: 'Opening script to introduce yourself and the issue',
          type: 'framing',
        },
      ];
    }
    return [];
  });

  // Handle conversation cues
  useEffect(() => {
    const newMessages = messages.filter((m, index) => index > prevIndex);
    const hasNewMessage = newMessages.length > 0;
    if (!hasNewMessage || messages.length === 0) {
      return;
    }
    setPrevIndex(messages.length - 1);

    generateCues(concatTranscript(messages), activeCues).then((cue) => {
      if (cue) {
        setActiveCues((prev) => [...prev, cue]);
      }
    });
  }, [messages, activeCues, prevIndex]);

  return { activeCues };
}
