import { supabase } from '@/integrations/supabase/client';
import { Cue } from './types';

interface ClaudeResponse {
  person?: string;
  event?: string;
  suggestedAction?: string;
  mention?: string;
  type?: Cue['type'];
}

export async function generateCues(transcript: string, cues: Cue[]): Promise<Cue[]> {
  const userMessage = `You are an on-screen assistant the user reads while roleplaying deep canvassing. Your job is to help the user notice people in the voter's life the voter mentions. The UI will just surface the name or relationship to the user.

  Return with an array of people and events the voter brings up. Most messages will have none in which case return [].
\
<transcript>
${transcript}
</transcript>

<cues>
${cues.map((cue) => `- ${cue.text} (${cue.type})`).join('\n')}
</cues>

Respond with JSON, with your answer wrapped in <json> tags:

Output example:
<json>[{"person": "my sister Sarah"}]</json>
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

  const parsedResponse = JSON.parse(jsonMatch[1]) as ClaudeResponse[];
  return parsedResponse
    .filter((cue) => cue.person)
    .map((cue) => ({
      text: cue.person,
      rationale: cue.mention,
      type: 'person',
    }));
}
