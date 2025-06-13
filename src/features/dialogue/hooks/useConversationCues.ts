import { useDialogue } from '@/features/dialogue';
import { useEffect, useState } from 'react';
import { ConversationCue, generateConversationCues } from '../../../edge/generateRealtimeReport';
import { DialogueMessage } from '../types';

const concatTranscript = (msgs: DialogueMessage[]) => {
  return msgs
    .map((msg) => {
      const role = msg.role === 'user' ? 'Canvasser' : 'Voter';
      return `${role}: ${msg.content}`;
    })
    .join('\n');
};

export interface CueManagementResult {
  activeCues: ConversationCue[];
}

export function useConversationCues(initialCue?: { organization: string; plainLanguage: string }): CueManagementResult {
  const { messages } = useDialogue();
  const [prevIndex, setPrevIndex] = useState(-1);

  // Initialize with opening script if provided
  const [activeCues, setActiveCues] = useState<ConversationCue[]>(() => {
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

    generateConversationCues(concatTranscript(messages), activeCues).then((response) => {
      if (response?.action === 'new' && response.cue && response.cue.text) {
        setActiveCues((prev) => [...prev, response.cue]);
      }
    });
  }, [messages, prevIndex, activeCues]);

  return { activeCues };
}
