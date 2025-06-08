import { supabase } from '@/integrations/supabase/client';

export const getHumeAccessToken = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('smooth-task');

    console.warn('Supabase edge function response - smooth-task (Hume token):', { data, error });

    if (error) {
      console.error('Error fetching Hume token:', error);
      return null;
    }

    return data?.access_token ?? null;
  } catch (error) {
    console.error('Error calling Hume token function:', error);
    return null;
  }
};
