import { supabase } from '@/integrations/supabase/client';

export interface PromptBuilderData {
  id?: string;
  name: string;
  system_prompt: string;
  persona: string;
  firstMessage?: string;
  archived?: boolean;
  starred?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const savePromptBuilder = async (data: PromptBuilderData): Promise<void> => {
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

    const { error } = await supabase.from('prompt_builders').insert(promptBuilderRecord);

    if (error) {
      throw new Error(error.message || 'Database error occurred');
    }
  } catch (error) {
    console.error('Error in savePromptBuilder:', error);
    throw error;
  }
};

export const fetchMostRecentPromptForPersona = async (persona: 'organizer' | 'attendee'): Promise<PromptBuilderData | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('fetchMostRecentPromptForPersona: No authenticated user');
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
      console.error('Error fetching prompt builders:', error);
      return null;
    }

    if (!promptBuilders || promptBuilders.length === 0) {
      return null;
    }

    const pb = promptBuilders[0];
    return {
      id: pb.id,
      name: pb.name,
      system_prompt: pb.system_prompt,
      persona: pb.persona || '',
      firstMessage: pb.first_message || undefined,
      archived: pb.archived || false,
      starred: pb.starred || false,
      created_at: pb.created_at,
      updated_at: pb.updated_at,
    };
  } catch (error) {
    console.error('Error in fetchMostRecentPromptForPersona:', error);
    return null;
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
      };
    }

    return result;
  } catch (error) {
    console.error('Error in fetchMostRecentPromptBuilders:', error);
    return null;
  }
};

export const fetchAllPromptBuildersForPersona = async (persona: string): Promise<PromptBuilderData[]> => {
  try {
    const authPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Authentication timeout')), 5000));

    let user: { id: string } | null = null;
    try {
      const authResult = await Promise.race([authPromise, timeoutPromise]);

      const {
        data: { user: authUser },
        error: authError,
      } = authResult as { data: { user: { id: string } | null }; error: Error | null };

      if (authError) {
        console.error('fetchAllPromptBuildersForPersona: Auth error:', authError);
        return [];
      }

      user = authUser;
      if (!user) {
        console.error('fetchAllPromptBuildersForPersona: No authenticated user');
        return [];
      }
    } catch (error) {
      console.error('fetchAllPromptBuildersForPersona: Exception during auth check:', error);
      return [];
    }

    const { data: promptBuilders, error } = await supabase
      .from('prompt_builders')
      .select('*')
      .eq('persona', persona)
      .order('updated_at', { ascending: false });

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
      persona: pb.persona || '',
      firstMessage: pb.first_message || undefined,
      archived: pb.archived || false,
      starred: pb.starred || false,
      created_at: pb.created_at,
      updated_at: pb.updated_at,
    }));
  } catch (error) {
    console.error('Error in fetchAllPromptBuildersForPersona:', error);
    return [];
  }
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
