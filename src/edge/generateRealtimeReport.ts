import { supabase } from '@/integrations/supabase/client';
import type { FeedbackId, ChallengeStep } from '@/types';

export type RealtimeReport = string;

export interface FeedbackItem {
  type: 'positive' | 'negative' | 'hint' | 'neutral';
  text: string;
  icon: string;
}

export interface RealtimeFeedback {
  [key: string]: FeedbackItem;
}

const feedbackCriteria: Record<string, FeedbackId[]> = {
  framing: ['framing-introduced-your-name', 'framing-named-issue-plainspoken', 'framed-uplifting'],
  listening: ['listened-asked-about-relationship', 'listened-dug-deeper', 'listened-shared-own-relationship', 'listened-got-vulnerable'],
  exploring: ['explored-connected-issue', 'explored-stayed-calm'],
};

const feedbackDescriptions: Record<FeedbackId, string> = {
  'framing-introduced-your-name': 'introduced yourself by name',
  'framing-named-issue-plainspoken':
    'named the issue using plainspoken words like "get sick", "see a doctor", "be healthy" but NOT words like "healthcare" or "health insurance"',
  'framed-uplifting':
    'framed the issue in an uplifting way (e.g. "so everyone can see a doctor" not "so people don\'t lose healthcare access")',
  'listened-asked-about-relationship': 'asked about people close to the voter',
  'listened-dug-deeper': 'dug deeper to learn more about why someone close to the voter is special to them',
  'listened-shared-own-relationship': 'shared about your own loved one',
  'listened-got-vulnerable': "shared a time they personally struggled (lost a job, lost a pet, couldn't see a doctor, etc.)",
  'explored-connected-issue': 'connected the issue to loved ones discussed previously',
  'explored-stayed-calm': "stayed calm and didn't lecture when the voter was exploring",
  'call-voter-called': 'The voter agreed to call their representative on the spot',
  'call-voter-interested': "The voter sounded very positive about calling their rep but didn't agree to do it.",
};

function parseFeedbackItem(text: string): FeedbackItem {
  if (text.startsWith('✓')) {
    return {
      type: 'positive',
      text: text.substring(1).trim(),
      icon: '✓',
    };
  } else if (text.startsWith('!')) {
    return {
      type: 'negative',
      text: text.substring(1).trim(),
      icon: '!',
    };
  } else if (text.startsWith('?')) {
    return {
      type: 'hint',
      text: text.substring(1).trim(),
      icon: '?',
    };
  } else {
    return {
      type: 'neutral',
      text: text.trim(),
      icon: '',
    };
  }
}

export async function generateRealtimeReport(
  fullConversationTranscript: string,
  newMessagesTranscript: string,
  step: ChallengeStep,
): Promise<RealtimeReport> {
  const criteriaForStep = feedbackCriteria[step];
  const criteriaDescriptions = criteriaForStep.map((id) => `${id}: ${feedbackDescriptions[id]}`).join('\n');

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
      userMessage,
    },
  });

  console.warn('Supabase edge function response - claude-report:', { data, error, step });

  if (error) {
    throw new Error(`Failed to generate report: ${error.message}`);
  }

  return data as string;
}

export async function generateRealtimeFeedback(
  fullConversationTranscript: string,
  newMessagesTranscript: string,
  step: ChallengeStep,
): Promise<RealtimeFeedback | null> {
  const rawReport = await generateRealtimeReport(fullConversationTranscript, newMessagesTranscript, step);

  const jsonMatch = rawReport && rawReport.match(/<json>(.*?)<\/json>/s);
  if (!jsonMatch) {
    return null;
  }

  try {
    const parsedFeedback = JSON.parse(jsonMatch[1].trim());
    const feedback: RealtimeFeedback = {};

    Object.entries(parsedFeedback).forEach(([key, value]) => {
      feedback[key] = parseFeedbackItem(value as string);
    });

    return feedback;
  } catch (error) {
    console.warn('Failed to parse realtime feedback:', error);
    return null;
  }
}

export interface ConversationCue {
  text: string;
  type: 'person' | 'feeling' | 'perspective';
}

export async function generateConversationCues(
  fullConversationTranscript: string,
): Promise<ConversationCue | null> {
  const userMessage = `Based on the new messages, give the user up to 1 cue for what to try saying next to the voter. Categorize it as about a person, feeling, or perspective.

<transcript>
${fullConversationTranscript}
</transcript>

Your response should be a json object with the cue text and type, wrapped in <json> like follows:

<json>
{
  "text": "Try asking about their family member mentioned earlier",
  "type": "person"
}
</json>

If there are no good cues to give, return an empty object: {}`;

  const { data, error } = await supabase.functions.invoke('claude-report', {
    body: {
      userMessage,
    },
  });

  console.warn('Supabase edge function response - conversation cues:', { data, error });

  if (error) {
    throw new Error(`Failed to generate conversation cues: ${error.message}`);
  }

  const jsonMatch = data && data.match(/<json>(.*?)<\/json>/s);
  if (!jsonMatch) {
    return null;
  }

  try {
    const parsedCue = JSON.parse(jsonMatch[1].trim());
    
    // If empty object, return null
    if (Object.keys(parsedCue).length === 0) {
      return null;
    }
    
    return parsedCue as ConversationCue;
  } catch (error) {
    console.warn('Failed to parse conversation cues:', error);
    return null;
  }
}
