import { useDialogue } from '@/features/dialogue';
import { useEffect, useState } from 'react';
import { generateRealtimeFeedback, RealtimeFeedback } from '../../../edge/generateRealtimeReport';
import { ChallengeStep } from '@/types';
import { DialogueMessage } from '../types';

const concatTranscript = (msgs: DialogueMessage[]) => {
    return msgs.
    map(msg => {
        const role = msg.role === 'user' ? 'Canvasser' : 'Voter';
        return `${role}: ${msg.content}`;
    }).join('\n');

}

export function useRealtimeFeedback(stepId: ChallengeStep): RealtimeFeedback | null {
    const { messages } = useDialogue();
    const [prevIndex, setPrevIndex] = useState(-1);
    const [realtimeFeedback, setRealtimeFeedback] = useState<RealtimeFeedback | null>(null);

    useEffect(() => {
        const newMessages = messages.filter((m, index) => index > prevIndex);
        const hasNewUserMessage = newMessages.filter(m => m.role === 'user').length > 0;
        if (!hasNewUserMessage) {
            return;
        }
        setPrevIndex(messages.length - 1);
        generateRealtimeFeedback(concatTranscript(messages), concatTranscript(newMessages), stepId)
        .then(setRealtimeFeedback);

    }, [messages, stepId, prevIndex]);

    return realtimeFeedback;
}