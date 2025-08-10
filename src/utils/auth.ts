import { supabase } from '@/integrations/supabase/client';

export interface AuthInfo {
  isLoggedIn: boolean;
  userEmail?: string;
  userId?: string;
}

export const getAuthInfo = async (): Promise<AuthInfo> => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('getAuthInfo: Error getting session:', error);
      return { isLoggedIn: false };
    }

    if (session?.user) {
      console.log('getAuthInfo: Session found for user:', session.user.id);
      return {
        isLoggedIn: true,
        userEmail: session.user.email,
        userId: session.user.id,
      };
    }

    console.log('getAuthInfo: No session found');
    return { isLoggedIn: false };
  } catch (error) {
    console.error('getAuthInfo: Unexpected error:', error);
    return { isLoggedIn: false };
  }
};

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  try {
    const authInfo = await getAuthInfo();
    const headers: Record<string, string> = {};

    if (authInfo.isLoggedIn) {
      console.log('getAuthHeaders: Getting auth headers for logged in user');
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('getAuthHeaders: Error getting session for headers:', error);
        return headers;
      }

      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
        console.log('getAuthHeaders: Added Authorization header');
      } else {
        console.error('getAuthHeaders: No access token found in session');
      }

      if (authInfo.userEmail) {
        headers['X-User-Email'] = authInfo.userEmail;
      }
      if (authInfo.userId) {
        headers['X-User-ID'] = authInfo.userId;
      }
    } else {
      console.log('getAuthHeaders: User not logged in, returning empty headers');
    }

    return headers;
  } catch (error) {
    console.error('getAuthHeaders: Unexpected error:', error);
    return {};
  }
};
