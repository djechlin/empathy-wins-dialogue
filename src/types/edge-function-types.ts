/**
 * Manually created TypeScript types for Supabase Edge Functions
 * with the intention of being cp'ed to frontend directory
 *
 * Unlike database schema types which are auto-generated, these Edge Function
 * types must be manually maintained to match the function implementations.
 */

// Workbench Edge Function Types
export interface WorkbenchRequest {
  messages?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  systemPrompt?: string;
  coach?: {
    transcript: string;
    coach: string;
  };
  scout?: {
    backgroundAndCriteria: string;
    messages: Array<{
      role: 'user' | 'assistant';
      content: string;
    }>;
  };
}

export interface WorkbenchResponse {
  message?: string;
  user_id?: string;
  error?: string;
}

// Claude Report Edge Function Types
export interface ClaudeReportRequest {
  userMessage: string;
}

export interface ClaudeReportResponse {
  result: string;
  error?: string;
}

// Rally Followup Edge Function Types
export interface RallyFollowupRequest {
  userMessage: string;
  userName?: string;
}

export interface RallyFollowupResponse {
  result: string;
  error?: string;
}

// Text Friend Edge Function Types
export interface TextFriendRequest {
  message: string;
  phoneNumber?: string;
}

export interface TextFriendResponse {
  success: boolean;
  error?: string;
}

// Common Error Response Type
export interface EdgeFunctionError {
  error: string;
  status?: number;
}
