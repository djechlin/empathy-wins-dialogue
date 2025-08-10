import { supabase } from '@/integrations/supabase/client';

export interface PromptBuilderData {
  id?: string;
  name: string;
  system_prompt: string;
  persona: string;
  firstMessage?: string;
  archived?: boolean;
  created_at?: string;
  updated_at?: string;
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

export const fetchMostRecentPromptForPersona = async (persona: string): Promise<PromptBuilderData | null> => {
  try {
    console.log(`fetchMostRecentPromptForPersona: Starting fetch for persona: ${persona}`);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log('fetchMostRecentPromptForPersona: User check:', user ? `User ID: ${user.id}` : 'No user');
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
    console.log(`fetchAllPromptBuildersForPersona: Starting fetch for persona: ${persona}`);
    console.log('fetchAllPromptBuildersForPersona: About to call supabase.auth.getUser()...');

    // Add timeout to prevent hanging
    const authPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Authentication timeout')), 5000));

    const authResult = await Promise.race([authPromise, timeoutPromise]);
    console.log('fetchAllPromptBuildersForPersona: Auth result:', authResult);
    const {
      data: { user },
    } = authResult as any;

    console.log('fetchAllPromptBuildersForPersona: User check:', user ? `User ID: ${user.id}` : 'No user');
    if (!user) {
      console.error('fetchAllPromptBuildersForPersona: No authenticated user');
      return [];
    }

    const { data: promptBuilders, error } = await supabase
      .from('prompt_builders')
      .select('*')
      .eq('user_id', user.id)
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
      archived: pb.archived || false, // Will work once archived field is added to DB
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
