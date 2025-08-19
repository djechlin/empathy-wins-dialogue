import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
export interface PromptBuilderData {
  id?: string;
  name: string;
  system_prompt: string;
  persona: 'organizer' | 'attendee' | 'coach' | 'scout';
  firstMessage?: string;
  archived?: boolean;
  starred?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const savePromptBuilder = async (data: PromptBuilderData): Promise<PromptBuilderData> => {
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
      persona: data.persona,
      first_message: data.firstMessage || null,
    };

    let result;
    if (data.id) {
      // Check if this prompt belongs to the current user
      const { data: existingPrompt } = await supabase.from('prompts').select('user_id').eq('id', data.id).single();

      if (existingPrompt && existingPrompt.user_id === user.id) {
        // Update existing record that belongs to current user
        const { data: updatedData, error } = await supabase.from('prompts').update(promptBuilderRecord).eq('id', data.id).select();

        if (error) {
          throw new Error(error.message || 'Database update error occurred');
        }

        if (!updatedData || updatedData.length === 0) {
          throw new Error('Prompt not found');
        }

        result = updatedData[0];
      } else {
        // Create new record for current user (copying someone else's prompt)
        const { data: insertedData, error } = await supabase.from('prompts').insert(promptBuilderRecord).select().single();

        if (error) {
          throw new Error(error.message || 'Database insert error occurred');
        }
        result = insertedData;
      }
    } else {
      // Create new record
      const { data: insertedData, error } = await supabase.from('prompts').insert(promptBuilderRecord).select().single();

      if (error) {
        throw new Error(error.message || 'Database insert error occurred');
      }
      result = insertedData;
    }

    // Return the saved data in our expected format
    return {
      id: result.id,
      name: result.name,
      system_prompt: result.system_prompt,
      persona: result.persona as 'organizer' | 'attendee' | 'coach' | 'scout',
      firstMessage: result.first_message || undefined,
      archived: result.archived || false,
      starred: result.starred || false,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };
  } catch (error) {
    toast.error('Error in savePromptBuilder:', error);
    throw error;
  }
};

export const fetchMostRecentPromptForPersona = async (
  persona: 'organizer' | 'attendee' | 'coach' | 'scout',
): Promise<PromptBuilderData | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    toast.error('User is not logged in');
    return null;
  }

  const { data: promptBuilders, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('user_id', user.id)
    .eq('persona', persona)
    .order('updated_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('error fetching prompts', error);
    toast.error('Error fetching prompts: ' + error.message);
    return null;
  }

  if (promptBuilders.length === 0) {
    return null;
  }

  const pb = promptBuilders[0];
  return {
    id: pb.id,
    name: pb.name,
    system_prompt: pb.system_prompt,
    persona: pb.persona as 'organizer' | 'attendee' | 'coach' | 'scout', // part of the 'where'
    firstMessage: pb.first_message || undefined,
    archived: pb.archived || false,
    starred: pb.starred || false,
    created_at: pb.created_at,
    updated_at: pb.updated_at,
  };
};

export const fetchAllPromptBuildersForPersona = async (
  persona: 'organizer' | 'attendee' | 'coach' | 'scout',
  userId?: string,
): Promise<PromptBuilderData[]> => {
  console.log('fetch all... dje');

  let query = supabase.from('prompts').select('*').eq('persona', persona).eq('archived', false).order('created_at', { ascending: false });

  // If userId is provided, filter by that user; otherwise get all prompts
  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data: promptBuilders, error } = await query;

  if (error) {
    console.error('Error fetching prompt builders:', error);
    return [];
  }

  if (!promptBuilders || promptBuilders.length === 0) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return promptBuilders.map((pb: any) => ({
    id: pb.id,
    name: pb.name,
    system_prompt: pb.system_prompt,
    persona: pb.persona as 'organizer' | 'attendee' | 'coach' | 'scout',
    firstMessage: pb.first_message || undefined,
    archived: pb.archived || false,
    starred: pb.starred || false,
    created_at: pb.created_at,
    updated_at: pb.updated_at,
  }));
};

export const archivePromptBuilder = async (id: string, archived: boolean): Promise<boolean> => {
  try {
    const updateData = archived ? { archived, starred: false } : { archived };
    const { error } = await supabase.from('prompts').update(updateData).eq('id', id);

    if (error) {
      console.error('Error updating prompt builder archive status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in archivePromptBuilder:', error);
    return false;
  }
};

export const starPromptBuilder = async (id: string, starred: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase.from('prompts').update({ starred }).eq('id', id);

    if (error) {
      console.error('Error updating prompt builder starred status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in starPromptBuilder:', error);
    return false;
  }
};
