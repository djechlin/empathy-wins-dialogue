import { ConversationReport } from '@/types/conversationReport';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: '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', // In practice, use process.env.ANTHROPIC_API_KEY
});

export async function generateReport(conversationTranscript: string): Promise<ConversationReport> {
    const systemPrompt = `You are an expert in deep canvassing techniques and will be evaluating a conversation between a canvasser practicing the deep canvassing technique and an AI voice assistant role-playing as a voter. Your task is to analyze the conversation and provide a detailed report on the canvasser's performance.

The canvasser is new and the feedback should be uplifting, yet emphasize the need for vulnerably connecting with the voter in order to persuade them.

The UI displaying the report will use this JSON format. Please return the JSON inside a <report_schema></report_schema> tag.

<report_schema>

export interface ConversationReport {
  baseScore: number; // 1-10 (starting score)
  currentScore: number; // 1-10 (current score after conversation)
  completedSteps: number;
  categories: CategoryScore[];
  keyMoments: KeyMoment[];
  improvements: string[];
  strengths: string[];
  nextSteps: string[];
}

export interface CategoryScore {
  id: string;
  name: string;
  icon: string; // lucide icon name
  score: number; // 1-10
  feedback: string;
  examples: string[];
}

export interface KeyMoment {
  timestamp: string;
  type: 'positive' | 'improvement' | 'missed_opportunity';
  description: string;
  quote?: string;
}

</report_schema>

Next, familiarize yourself with the deep canvassing guidelines:

<deep_canvassing_guidelines>
Framing the issue

Dos:

- Introduce yourself and the issue quickly
- Get their 1-10 number quickly
- Always ask why it's the right number even if they're a 0 or 10
- Prefer terms that connect the issue to what people are already experiencing day to day, like "see a doctor," "protect us from wildfires," etc
- Use an issue with direct positive impact (e.g. "tax the rich" is bad, because its positive impact is only after raising taxes and spending taxes)

Donts:

- Use "exit phrases" like "do you have a minute?" or "this will only take a minute"
- Ask "how are you?" or similar, before introducing the issue
- Use political terms like filibuster, supermajority, budget resolution, etc.
- Assume 10s are locked in support
- Assume 0s have thought about it all that much


Vulnerable storytelling

Dos:

- name the person you love
- say what you love about them
- describe a moment in time they were really there for you
- show vulnerability

Donts:
- discuss politics, as that detracts from establishing vulnerability
- bring up facts or statistics
- bring up the issue, except to the extent it affects you personally. (For instance: if you want to canvass for gay marriage, for this part of the conversation, you should forget you even realize Congress can pass laws at all)

Eliciting stories from voters

Dos:

- notice little things they say about themselves, their work, their house, etc
- practice reflection: whatever new words they use, try to use them. if they say "my husband stays calm under pressure," try using the words calm or pressure
- ask about different people in their live
- pause

Donts:
- talk about a pet
- jump back into the issue too quickly

Exploring the issue:

Dos:
- ask lots of questions and hear where they go
- ask leading questions if they go anti- the issue
- ask how they are feeling
- when you do share a fact or stat (which should be maybe once, at most), connect it to someone from your stories

Donts:
- correct them
- dump facts on them

</deep_canvassing_guidelines>

Analyze the conversation based on the deep canvassing guidelines and the canvasser's performance. Pay attention to the following aspects:

1. Grabbed their attention: the canvasser should introduce themselves and the issue, and quickly move into the 1-10 question.

2. Vulnerability: the canvasser makes themselves vulnerable, most likely by opening up about how the issue impacts them or their loved ones.

3. Empathic Listening: Did the canvasser demonstrate active listening and show empathy towards the voter's concerns?

4. Explore the issue together. The canvasser should avoid lecturing the voter on facts and politics. The canvasser should also avoid going into technicals about politics like "supermajority" and "budget resolution."`;

    const userMessage = `Now, carefully read through the conversation transcript:

<conversation_transcript>
    ${conversationTranscript}
</conversation_transcript>`;

    try {
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4000,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: userMessage
                }
            ]
        });

        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

        // Extract JSON from the response (assuming it's wrapped in <report_schema> tags)
        const jsonMatch = responseText.match(/<report_schema>(.*?)<\/report_schema>/s);
        if (jsonMatch) {
            const jsonString = jsonMatch[1].trim();
            return JSON.parse(jsonString) as ConversationReport;
        } else {
            throw new Error('Could not find report schema in response');
        }
    } catch (error) {
        console.error('Error analyzing conversation:', error);
        throw error;
    }
}
