import { useDialogue } from '@/features/dialogue';
import { useEffect, useState } from 'react';
import { generateConversationCues, ConversationCue } from '../../../edge/generateRealtimeReport';
import { DialogueMessage } from '../types';

const concatTranscript = (msgs: DialogueMessage[]) => {
  return msgs
    .map((msg) => {
      const role = msg.role === 'user' ? 'Canvasser' : 'Voter';
      return `${role}: ${msg.content}`;
    })
    .join('\n');
};

export function useConversationCues(): ConversationCue | null {
  const { messages } = useDialogue();
  const [prevIndex, setPrevIndex] = useState(-1);
  const [conversationCue, setConversationCue] = useState<ConversationCue | null>(null);

  useEffect(() => {
    const newMessages = messages.filter((m, index) => index > prevIndex);
    const hasNewMessage = newMessages.length > 0;
    if (!hasNewMessage || messages.length === 0) {
      return;
    }
    setPrevIndex(messages.length - 1);
    generateConversationCues(concatTranscript(messages)).then(setConversationCue);
  }, [messages, prevIndex]);

  return conversationCue;
}