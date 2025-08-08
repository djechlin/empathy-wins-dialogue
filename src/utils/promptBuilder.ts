import { supabase } from '@/integrations/supabase/client';

export interface PromptBuilderData {
  id?: string;
  name: string;
  prompt: string;
  firstMessage?: string;
  variables: Record<string, string>;
}

export const savePromptBuilder = async (data: PromptBuilderData): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('No authenticated user');
      return false;
    }

    const promptBuilderRecord = {
      user_id: user.id,
      name: data.name,
      prompt: data.prompt,
      first_message: data.firstMessage || null,
      variables_and_content: JSON.stringify(data.variables),
    };

    const { error } = await supabase.from('prompt_builders').upsert(promptBuilderRecord, {
      onConflict: 'user_id,name',
    });

    if (error) {
      console.error('Error saving prompt builder:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in savePromptBuilder:', error);
    return false;
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
        prompt: pb.prompt,
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
