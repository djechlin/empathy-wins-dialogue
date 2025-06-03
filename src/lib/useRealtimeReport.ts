import { useVoice } from "@humeai/voice-react";
import { useEffect, useState } from "react";
import { generateRealtimeFeedback, RealtimeFeedback } from "./generateRealtimeReport";
import { ChallengeStep } from "@/types";

const concatTranscript = (msgs) => {
    return msgs.filter(msg => msg.type === 'user_message' || msg.type === 'assistant_message').
    map(msg => {
        const role = msg.message.role === 'user' ? 'Canvasser' : 'Voter';
        return `${role}: ${msg.message.content}`;
    });

}

export function useRealtimeFeedback(stepId: ChallengeStep): RealtimeFeedback | null {
    const { messages } = useVoice();
    const [prevIndex, setPrevIndex] = useState(-1);
    const [realtimeFeedback, setRealtimeFeedback] = useState<RealtimeFeedback | null>(null);
    
    useEffect(() => {
        const newMessages = messages.filter((m, index) => index > prevIndex);
        const hasNewUserMessage = newMessages.filter(m => m.type === 'user_message').length > 0;
        if (!hasNewUserMessage) {
            return;
        }
        setPrevIndex(messages.length - 1);
        const allMessages = messages.filter(m => m.type === 'user_message' || m.type === 'assistant_message');

        generateRealtimeFeedback(concatTranscript(allMessages), concatTranscript(newMessages), stepId)
        .then(setRealtimeFeedback);

    }, [messages, stepId, prevIndex]);

    return realtimeFeedback;
}