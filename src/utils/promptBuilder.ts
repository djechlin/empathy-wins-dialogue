import { supabase } from '@/integrations/supabase/client';

export interface PromptBuilderData {
  id?: string;
  name: string;
  system_prompt: string;
  persona: string;
  firstMessage?: string;
  variables: Record<string, string>;
}

export const savePromptBuilder = async (data: PromptBuilderData, persona?: string): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('No authenticated user');
    }

    const promptBuilderRecord = {
      user_id: user.id,
      name: data.name,
      system_prompt: data.system_prompt,
      persona: persona || data.persona,
      first_message: data.firstMessage || null,
      variables_and_content: JSON.stringify(data.variables),
    };

    console.log('Attempting to insert prompt builder record:', promptBuilderRecord);
    console.log('Current user:', user);
    console.log('User roles:', user.role);
    
    const { error, data: insertedData } = await supabase.from('prompt_builders').insert(promptBuilderRecord).select();

    if (error) {
      throw new Error(error.message || 'Database error occurred');
    }

    console.log('Successfully inserted prompt builder:', insertedData);
    return true;
  } catch (error) {
    console.error('Error in savePromptBuilder:', error);
    throw error;
  }
};

export const fetchMostRecentPromptBuilders = async (): Promise<Record<string, PromptBuilderData> | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('No authenticated user');
      return null;
    }

    const { data: promptBuilders, error } = await supabase
      .from('prompt_builders')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching prompt builders:', error);
      return null;
    }

    if (!promptBuilders || promptBuilders.length === 0) {
      return null;
    }

    // Convert to the format expected by the UI
    const result: Record<string, PromptBuilderData> = {};

    for (const pb of promptBuilders) {
      result[pb.name] = {
        id: pb.id,
        name: pb.name,
        system_prompt: pb.system_prompt,
        persona: pb.persona || '',
        firstMessage: pb.first_message || undefined,
        variables: JSON.parse(pb.variables_and_content || '{}'),
      };
    }

    return result;
  } catch (error) {
    console.error('Error in fetchMostRecentPromptBuilders:', error);
    return null;
  }
};
