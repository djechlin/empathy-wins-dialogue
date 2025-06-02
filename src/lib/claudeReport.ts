import { ConversationReport } from '@/types/conversationReport';
import { supabase } from '@/integrations/supabase/client';

interface RequestedFeedback {
  [key: string]: string;
}

const defaultRequestedFeedback: RequestedFeedback = {
  // Framing the issue
  brightSide: 'talk about the bright side, e.g. "so everyone can see a doctor" not "so people don\'t lose healthcare access"',
  directLanguage: 'prefer direct language, like "see a doctor" instead of "access healthcare"',
  noJargon: 'Don\'t use political jargon like supermajority, filibuster, pressure Congress, etc.',
  noFiller: 'Bring up the issue by the 2nd sentence, before making chit-chat.',
  
  // Vulnerable storytelling & listening
  shareYourLovedOne: 'name your own loved one',
  shareWhyYouLoveThem: 'describe your loved one in enough detail so the voter gets why they\'re important to you.',
  shareAMomentInTime: 'share a moment in time your loved one was there for you.',
  askHowTheIssueAffectsThem: 'ask how the issue affects them or people in their community',
  dontBeJudgmental: 'don\'t correct them after they share something vulnerable',
  askAboutTheirLovedOnes: 'ask about people close to the voter',
  digDeeper: 'learn more about why someone close to the voter is special to them',
  dontRuinItWithPolitics: 'don\'t interrupt a heartfelt exploration by bringing up issues or politics early',
  
  // Exploring the issue
  askQuestions: 'continue asking them how they feel',
  tieItInToOurLovedOnes: 'relate the issue to any loved ones of theirs or ours discussed previously',
  reflection: 'the canvasser uses words the voter used to get them to go deeper',
  noLecturing: 'the canvasser doesn\'t dump information or lecture when the voter is exploring, just guides them with questions',
};

export async function generateReport(
  conversationTranscript: string, 
  requestedFeedback: RequestedFeedback = defaultRequestedFeedback
): Promise<any> {
    try {
        const { data, error } = await supabase.functions.invoke('claude-report', {
            body: {
                conversationTranscript,
                requestedFeedback
            }
        });

        if (error) {
            console.error('Error calling Supabase function:', error);
            throw new Error(`Failed to generate report: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error analyzing conversation:', error);
        throw error;
    }
}
