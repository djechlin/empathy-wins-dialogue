import { useDialogue } from '@/features/dialogue';
import { useEffect, useState } from 'react';
import { generateConversationCues, ConversationCue, ConversationCueResponse } from '../../../edge/generateRealtimeReport';
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
  newCue: ConversationCue | null;
}

export function useConversationCues(): CueManagementResult {
  const { messages } = useDialogue();
  const [prevIndex, setPrevIndex] = useState(-1);
  const [activeCues, setActiveCues] = useState<ConversationCue[]>([]);
  const [newCue, setNewCue] = useState<ConversationCue | null>(null);

  useEffect(() => {
    const newMessages = messages.filter((m, index) => index > prevIndex);
    const hasNewMessage = newMessages.length > 0;
    if (!hasNewMessage || messages.length === 0) {
      return;
    }
    setPrevIndex(messages.length - 1);

    // Capture current activeCues at the time of the API call to avoid stale closure
    setActiveCues(currentActiveCues => {
      generateConversationCues(concatTranscript(messages), currentActiveCues).then((response: ConversationCueResponse | null) => {
        if (!response) return;

        switch (response.action) {
          case 'keep':
            // Keep existing cues, no new cue
            setNewCue(null);
            break;
          case 'clear':
            // Clear all existing cues, no new cue
            setActiveCues([]);
            setNewCue(null);
            break;
          case 'new':
            // Add new cue to active cues
            if (response.cue) {
              setActiveCues(prev => [...prev, response.cue!]);
              setNewCue(response.cue);
            }
            break;
        }
      });
      
      return currentActiveCues; // Return unchanged state
    });
  }, [messages, prevIndex]);

  return { activeCues, newCue };
}
