import { supabase } from '@/integrations/supabase/client';
import type { ChallengeStep, FeedbackId } from '@/types';

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
  rationale: string;
  type: 'person' | 'feeling' | 'perspective' | 'framing';
}

export interface ConversationCueResponse {
  action: 'keep' | 'clear' | 'new';
  cue?: ConversationCue;
}

export async function generateConversationCues(
  fullConversationTranscript: string,
  existingSuggestions: ConversationCue[] = [],
): Promise<ConversationCueResponse | null> {
  const existingSuggestionsText =
    existingSuggestions.length > 0
      ? `\n<existing_suggestions>\n${existingSuggestions.map((cue) => `- "${cue.text}" (${cue.type}) - ${cue.rationale}`).join('\n')}\n</existing_suggestions>\n`
      : '';

  // const oldPrompt = `
  //   Avoid going in the direction of opinions or politics.

  //   <bad_example>"What's your sense of how companies should balance making profit with making medicine affordable?"</bad_example>

  //   Don't prompt them to think about the issue itself. It is OK to prompt them to think about how the issue affects someone they care about.

  //   <bad_example> What comes to mind when you think about healthcare?"</bad_example>

  //   Don't ask permission to share something with the voter - just share it.
  //   <bad_example>"I started caring about this because of someone in my own life - would you like to hear about that?"</bad_example>

  //   The voter themselves does not count as a person.
  //   <bad_example>"Frank, what's your own experience been with healthcare?"</bad_example>
  // `

  const userMessage = `You are an on-screen assistant the user reads while roleplaying deep canvassing. Think of your role as a "noticer." You notice important emotional cues and details the canvasser might have missed, if the canvasser was in the flow of the conversation or beginning to delve into the issue too much. Brevity is of utmost important since user will be reading this while in the middle of a conversation. Suggestions should be direct and pointed. All context should go in the sub-field with the main field just containing the suggested action.

  You mainly want to notice people in the voter's life, and you want to notice times the voter shares a feeling or perspective that is really worth digging deeper into. Remember, we don't want to hash out politics, but we want to know and care where they come from.

  Additionally you will notice when the canvasser goes too much into facts, issues, and politics. Nudge them to bring it back to their relationships or the voter's relationships. This cue is quite harsh, so avoid giving it twice in a row.

  You will use your ability maybe 5 times in the whole 10 minute conversation, so feel free to reply with empty text "" and a description like "nothing new yet" many times.

<transcript>
${fullConversationTranscript}
</transcript>

${existingSuggestionsText}

Respond with JSON:
<json>{"person": "Sarah", "suggestedAction": "See if he shares more about Sarah.", "mention": "Frank mentioned Sarah helped him feed his dog when he was on vacation.", "type": "person"}</json>

type = "person", "feeling", or "canvasser" (for when the canvasser is going too much into facts, issues, and politics)

`;

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
    const parsedResponse = JSON.parse(jsonMatch[1].trim());
    return {
      action: 'new',
      cue: {
        text: parsedResponse.suggestedAction,
        rationale: parsedResponse.mention,
        type: parsedResponse.type,
      },
    } as ConversationCueResponse;
  } catch (error) {
    console.warn('Failed to parse conversation cues:', error);
    return null;
  }
}
