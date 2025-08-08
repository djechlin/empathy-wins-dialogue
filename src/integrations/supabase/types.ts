export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      claude_report_logs: {
        Row: {
          claude_model: string | null;
          claude_result_raw: string | null;
          created_at: string | null;
          id: number;
          system_message: string | null;
          user_message: string | null;
        };
        Insert: {
          claude_model?: string | null;
          claude_result_raw?: string | null;
          created_at?: string | null;
          id?: number;
          system_message?: string | null;
          user_message?: string | null;
        };
        Update: {
          claude_model?: string | null;
          claude_result_raw?: string | null;
          created_at?: string | null;
          id?: number;
          system_message?: string | null;
          user_message?: string | null;
        };
        Relationships: [];
      };
      prompt_builders: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          prompt: string;
          first_message: string | null;
          variables_and_content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          prompt: string;
          first_message?: string | null;
          variables_and_content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          prompt?: string;
          first_message?: string | null;
          variables_and_content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'prompt_builders_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      report: {
        Row: {
          created_at: string;
          id: number;
          report: Json | null;
          transcript: Json | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          report?: Json | null;
          transcript?: Json | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          report?: Json | null;
          transcript?: Json | null;
        };
        Relationships: [];
      };
      task: {
        Row: {
          id: number;
          name: string;
          user_id: string;
        };
        Insert: {
          id?: number;
          name: string;
          user_id?: string;
        };
        Update: {
          id?: number;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      willingness: {
        Row: {
          created_at: string;
          id: number;
          user_id: string | null;
          value: number | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          user_id?: string | null;
          value?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          user_id?: string | null;
          value?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views']) | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] & Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes'] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

// Edge Function Types
export interface WorkbenchRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  systemPrompt: string;
}

export interface WorkbenchResponse {
  message?: string;
  user_id?: string;
  error?: string;
}

export interface ClaudeReportRequest {
  userMessage: string;
}

export interface ClaudeReportResponse {
  result: string;
  error?: string;
}

export interface RallyFollowupRequest {
  userMessage: string;
  userName?: string;
}

export interface RallyFollowupResponse {
  result: string;
  error?: string;
}

export interface TextFriendRequest {
  message: string;
  phoneNumber?: string;
}

export interface TextFriendResponse {
  success: boolean;
  error?: string;
}

export interface EdgeFunctionError {
  error: string;
  status?: number;
}
