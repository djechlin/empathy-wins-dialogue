import { supabase } from '@/integrations/supabase/client';
import { Cue } from './types';

export async function generateCues(transcript: string, cues: Cue[]): Promise<Cue> {
  const userMessage = `You are an on-screen assistant the user reads while roleplaying deep canvassing. Think of your role as a "noticer." You notice important emotional cues and details the canvasser might have missed, if the canvasser was in the flow of the conversation or beginning to delve into the issue too much. Brevity is of utmost important since user will be reading this while in the middle of a conversation. Suggestions should be direct and pointed. All context should go in the sub-field with the main field just containing the suggested action.

  You mainly want to notice people in the voter's life, and you want to notice times the voter shares a feeling or perspective that is really worth digging deeper into. Remember, we don't want to hash out politics, but we want to know and care where they come from.

  Additionally you will notice when the canvasser goes too much into facts, issues, and politics. Nudge them to bring it back to their relationships or the voter's relationships. This cue is quite harsh, so avoid giving it twice in a row.

  You will use your ability maybe 5 times in the whole 10 minute conversation, so feel free to reply with empty text "" and a description like "nothing new yet" many times.

<transcript>
${transcript}
</transcript>

<cues>
${cues.map((cue) => `- ${cue.text} (${cue.type})`).join('\n')}
</cues>

Respond with JSON, with your answer wrapped in <json> tags:

Output example:
<json>{"person": "Sarah", "suggestedAction": "See if he shares more about Sarah.", "mention": "Frank mentioned Sarah helped him feed his dog when he was on vacation.", "type": "person"}</json>

type = "person", "feeling", or "canvasser" (for when the canvasser is going too much into facts, issues, and politics)

`;

  const { data, error } = await supabase.functions.invoke('claude-report', {
    body: {
      userMessage,
    },
  });

  if (error) {
    throw new Error('Failed to generate cues');
  }

  const jsonMatch = data.match(/<json>(.*?)<\/json>/s);
  if (!jsonMatch) {
    throw new Error(`No <json> match in response: ${data}`);
  }

  const parsedResponse = JSON.parse(jsonMatch[1]);
  return {
    text: parsedResponse.suggestedAction,
    rationale: parsedResponse.mention,
    type: parsedResponse.type,
  };
}
