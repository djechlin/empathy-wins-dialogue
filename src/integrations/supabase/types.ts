export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      all_claude_logs: {
        Row: {
          claude_result_raw: string
          created_at: string | null
          edge_function: string
          id: string
          messages: Json
          model: string
          system_message: string
        }
        Insert: {
          claude_result_raw: string
          created_at?: string | null
          edge_function: string
          id?: string
          messages: Json
          model: string
          system_message: string
        }
        Update: {
          claude_result_raw?: string
          created_at?: string | null
          edge_function?: string
          id?: string
          messages?: Json
          model?: string
          system_message?: string
        }
        Relationships: []
      }
      chat_coaches: {
        Row: {
          chat_id: string
          coach_id: string
          coach_prompt: string
          coach_result: string
          created_at: string
          id: string
        }
        Insert: {
          chat_id: string
          coach_id: string
          coach_prompt: string
          coach_result: string
          created_at?: string
          id?: string
        }
        Update: {
          chat_id?: string
          coach_id?: string
          coach_prompt?: string
          coach_result?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_coaches_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_coaches_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          message: string
          persona: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          message: string
          persona: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          message?: string
          persona?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_scouts: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          scout_id: string
          scout_prompt: string
          scout_result: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          scout_id: string
          scout_prompt: string
          scout_result: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          scout_id?: string
          scout_prompt?: string
          scout_result?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_scouts_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_scouts_scout_id_fkey"
            columns: ["scout_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          attendee_mode: string
          attendee_prompt_id: string | null
          attendee_system_prompt: string | null
          created_at: string
          ended_at: string | null
          id: string
          organizer_first_message: string | null
          organizer_mode: string
          organizer_prompt_id: string | null
          organizer_system_prompt: string | null
          user_id: string
        }
        Insert: {
          attendee_mode: string
          attendee_prompt_id?: string | null
          attendee_system_prompt?: string | null
          created_at?: string
          ended_at?: string | null
          id?: string
          organizer_first_message?: string | null
          organizer_mode: string
          organizer_prompt_id?: string | null
          organizer_system_prompt?: string | null
          user_id: string
        }
        Update: {
          attendee_mode?: string
          attendee_prompt_id?: string | null
          attendee_system_prompt?: string | null
          created_at?: string
          ended_at?: string | null
          id?: string
          organizer_first_message?: string | null
          organizer_mode?: string
          organizer_prompt_id?: string | null
          organizer_system_prompt?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_attendee_prompt_id_fkey"
            columns: ["attendee_prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_organizer_prompt_id_fkey"
            columns: ["organizer_prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      claude_rally_followup_logs: {
        Row: {
          claude_model: string | null
          claude_result_raw: string | null
          created_at: string | null
          id: number
          system_message: string | null
          user_message: string | null
        }
        Insert: {
          claude_model?: string | null
          claude_result_raw?: string | null
          created_at?: string | null
          id?: number
          system_message?: string | null
          user_message?: string | null
        }
        Update: {
          claude_model?: string | null
          claude_result_raw?: string | null
          created_at?: string | null
          id?: number
          system_message?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      claude_report_logs: {
        Row: {
          claude_model: string | null
          claude_result_raw: string | null
          created_at: string | null
          id: number
          system_message: string | null
          user_message: string | null
        }
        Insert: {
          claude_model?: string | null
          claude_result_raw?: string | null
          created_at?: string | null
          id?: number
          system_message?: string | null
          user_message?: string | null
        }
        Update: {
          claude_model?: string | null
          claude_result_raw?: string | null
          created_at?: string | null
          id?: number
          system_message?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      claude_workbench_logs: {
        Row: {
          claude_model: string | null
          claude_result_raw: string | null
          created_at: string | null
          id: number
          system_message: string | null
          user_message: string | null
        }
        Insert: {
          claude_model?: string | null
          claude_result_raw?: string | null
          created_at?: string | null
          id?: number
          system_message?: string | null
          user_message?: string | null
        }
        Update: {
          claude_model?: string | null
          claude_result_raw?: string | null
          created_at?: string | null
          id?: number
          system_message?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      prompt_versions: {
        Row: {
          created_at: string
          creator: string
          first_message: string | null
          id: string
          prompt_id: string
          system_prompt: string
        }
        Insert: {
          created_at?: string
          creator: string
          first_message?: string | null
          id?: string
          prompt_id: string
          system_prompt: string
        }
        Update: {
          created_at?: string
          creator?: string
          first_message?: string | null
          id?: string
          prompt_id?: string
          system_prompt?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_versions_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          archived: boolean | null
          created_at: string
          first_message: string | null
          id: string
          is_active: boolean
          name: string
          persona: string | null
          starred: boolean
          system_prompt: string
          updated_at: string
          user_id: string
          version_id: string | null
        }
        Insert: {
          archived?: boolean | null
          created_at?: string
          first_message?: string | null
          id?: string
          is_active?: boolean
          name: string
          persona?: string | null
          starred?: boolean
          system_prompt: string
          updated_at?: string
          user_id: string
          version_id?: string | null
        }
        Update: {
          archived?: boolean | null
          created_at?: string
          first_message?: string | null
          id?: string
          is_active?: boolean
          name?: string
          persona?: string | null
          starred?: boolean
          system_prompt?: string
          updated_at?: string
          user_id?: string
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompts_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "prompt_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      rally_followup_results: {
        Row: {
          comment: string | null
          conversation_results: string | null
          conversation_transcript: string | null
          created_at: string | null
          id: number
          leader_potential: number | null
          organizer_name: string
        }
        Insert: {
          comment?: string | null
          conversation_results?: string | null
          conversation_transcript?: string | null
          created_at?: string | null
          id?: number
          leader_potential?: number | null
          organizer_name: string
        }
        Update: {
          comment?: string | null
          conversation_results?: string | null
          conversation_transcript?: string | null
          created_at?: string | null
          id?: number
          leader_potential?: number | null
          organizer_name?: string
        }
        Relationships: []
      }
      report: {
        Row: {
          created_at: string
          id: number
          report: Json | null
          transcript: Json | null
        }
        Insert: {
          created_at?: string
          id?: number
          report?: Json | null
          transcript?: Json | null
        }
        Update: {
          created_at?: string
          id?: number
          report?: Json | null
          transcript?: Json | null
        }
        Relationships: []
      }
      task: {
        Row: {
          id: number
          name: string
          user_id: string
        }
        Insert: {
          id?: number
          name: string
          user_id?: string
        }
        Update: {
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      willingness: {
        Row: {
          created_at: string
          id: number
          user_id: string | null
          value: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          user_id?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          user_id?: string | null
          value?: number | null
        }
        Relationships: []
      }
      workbench_rw: {
        Row: {
          created_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
