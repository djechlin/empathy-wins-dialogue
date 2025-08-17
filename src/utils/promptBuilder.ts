import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
export interface PromptBuilderData {
  id?: string;
  name: string;
  system_prompt: string;
  persona: 'organizer' | 'attendee' | 'coach';
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
      // Update existing record
      const { data: updatedData, error } = await supabase
        .from('prompt_builders')
        .update(promptBuilderRecord)
        .eq('id', data.id)
        .eq('user_id', user.id) // Ensure user can only update their own records
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Database update error occurred');
      }
      result = updatedData;
    } else {
      // Create new record
      const { data: insertedData, error } = await supabase.from('prompt_builders').insert(promptBuilderRecord).select().single();

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
      persona: result.persona as 'organizer' | 'attendee' | 'coach',
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

export const fetchMostRecentPromptForPersona = async (persona: 'organizer' | 'attendee' | 'coach'): Promise<PromptBuilderData | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    toast.error('User is not logged in');
    return null;
  }

  const { data: promptBuilders, error } = await supabase
    .from('prompt_builders')
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
    persona: pb.persona as 'organizer' | 'attendee' | 'coach', // part of the 'where'
    firstMessage: pb.first_message || undefined,
    archived: pb.archived || false,
    starred: pb.starred || false,
    created_at: pb.created_at,
    updated_at: pb.updated_at,
  };
};

export const fetchAllPromptBuildersForPersona = async (persona: 'organizer' | 'attendee' | 'coach'): Promise<PromptBuilderData[]> => {
  console.log('fetch all... dje');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    toast.error('User is not logged in');
    return null;
  }

  const { data: promptBuilders, error } = await supabase
    .from('prompt_builders')
    .select('*')
    .eq('persona', persona)
    .eq('archived', false)
    .order('created_at', { ascending: false });

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
    persona: pb.persona as 'organizer' | 'attendee' | 'coach',
    firstMessage: pb.first_message || undefined,
    archived: pb.archived || false,
    starred: pb.starred || false,
    created_at: pb.created_at,
    updated_at: pb.updated_at,
  }));
};

export const archivePromptBuilder = async (id: string, archived: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase.from('prompt_builders').update({ archived }).eq('id', id);

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
    const { error } = await supabase.from('prompt_builders').update({ starred }).eq('id', id);

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
