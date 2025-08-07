import { supabase } from '@/integrations/supabase/client';

export interface AuthInfo {
  isLoggedIn: boolean;
  userEmail?: string;
  userId?: string;
}

export const getAuthInfo = async (): Promise<AuthInfo> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    return {
      isLoggedIn: true,
      userEmail: session.user.email,
      userId: session.user.id,
    };
  }

  return { isLoggedIn: false };
};

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const authInfo = await getAuthInfo();
  const headers: Record<string, string> = {};

  if (authInfo.isLoggedIn) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    if (authInfo.userEmail) {
      headers['X-User-Email'] = authInfo.userEmail;
    }
    if (authInfo.userId) {
      headers['X-User-ID'] = authInfo.userId;
    }
  }

  return headers;
};
