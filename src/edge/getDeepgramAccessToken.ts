import { supabase } from '@/integrations/supabase/client';

export const getDeepgramAccessToken = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('get-deepgram-token');

    console.error('Supabase edge function response - get-deepgram-token:', { data, error });

    if (error) {
      console.error('Error fetching Deepgram token:', error);
      return null;
    }

    return data?.access_token ?? null;
  } catch (error) {
    console.error('Error calling Deepgram token function:', error);
    return null;
  }
};
