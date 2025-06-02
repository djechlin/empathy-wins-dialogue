import { supabase } from '@/integrations/supabase/client';
import type { FeedbackId, ChallengeStep } from '@/types';

export type RealtimeReport = string;

const feedbackCriteria: Record<string, FeedbackId[]> = {
    'framing': ['framing-introduced-your-name', 'framing-introduced-the-issue', 'framed-uplifting', 'framed-simple-language'],
    'listening': ['listened-asked-about-relationship', 'listened-dug-deeper', 'listened-shared-own-relationship', 'listened-got-vulnerable'],
    'exploring': ['explored-connected-issue', 'explored-stayed-calm']
};

const feedbackDescriptions: Record<FeedbackId, string> = {
    'framing-introduced-your-name': 'introduced yourself by name',
    'framing-introduced-the-issue': 'introduced the issue/topic',
    'framed-uplifting': 'framed the issue in an uplifting way (e.g. "so everyone can see a doctor" not "so people don\'t lose healthcare access")',
    'framed-simple-language': 'used simple, direct language (e.g. "see a doctor" instead of "access healthcare")',
    'listened-asked-about-relationship': 'asked about people close to the voter',
    'listened-dug-deeper': 'dug deeper to learn more about why someone close to the voter is special to them',
    'listened-shared-own-relationship': 'shared about your own loved one',
    'listened-got-vulnerable': 'got vulnerable by sharing a moment in time your loved one was there for you',
    'explored-connected-issue': 'connected the issue to loved ones discussed previously',
    'explored-stayed-calm': 'stayed calm and didn\'t lecture when the voter was exploring',
    'call-voter-called': 'The voter agreed to call their representative on the spot',
    'call-voter-interested': 'The voter sounded very positive about calling their rep but didn\'t agree to do it.'
};

export async function generateRealtimeReport(
    fullConversationTranscript: string,
    newMessagesTranscript: string,
    step: ChallengeStep
): Promise<RealtimeReport> {
    const criteriaForStep = feedbackCriteria[step];
    const criteriaDescriptions = criteriaForStep.map(id =>
        `${id}: ${feedbackDescriptions[id]}`
    ).join('\n');

    const userMessage = `You are evaluating a deep canvassing conversation. Focus your evaluation on the NEW MESSAGES since the last evaluation, but use the full conversation history for context.

<full_conversation_history>
${fullConversationTranscript}
</full_conversation_history>

<new_messages_since_last_evaluation>
${newMessagesTranscript}
</new_messages_since_last_evaluation>

Provide feedback primarily based on the NEW MESSAGES: a "!" if they made a mistake or need improvement, a "✓" if they did well, and a "?" if it's not clear yet or they haven't done it or tried it yet. Evaluate each of these criteria:

<requested_feedback>
${criteriaDescriptions}
</requested_feedback>

Your response should be a json object, wrapped in <json> like follows:

<json>
{
"${criteriaForStep[0]}": "!"
}
</json>`;

    const { data, error } = await supabase.functions.invoke('claude-report', {
        body: {
            userMessage
        }
    });

    console.warn('Supabase edge function response - claude-report:', { data, error, step });

    if (error) {
        throw new Error(`Failed to generate report: ${error.message}`);
    }

    return data as string;
}
