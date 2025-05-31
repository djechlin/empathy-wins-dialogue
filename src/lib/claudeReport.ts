import { ConversationReport } from '@/types/conversationReport';
import { supabase } from '@/integrations/supabase/client';

export async function generateReport(conversationTranscript: string): Promise<ConversationReport> {
    try {
        const { data, error } = await supabase.functions.invoke('claude-report', {
            body: {
                conversationTranscript
            }
        });

        if (error) {
            console.error('Error calling Supabase function:', error);
            throw new Error(`Failed to generate report: ${error.message}`);
        }

        return data as ConversationReport;
    } catch (error) {
        console.error('Error analyzing conversation:', error);
        throw error;
    }
}
