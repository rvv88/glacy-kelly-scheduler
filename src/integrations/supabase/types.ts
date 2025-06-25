export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          clinic_id: string
          clinic_name: string
          created_at: string
          date: string
          duration: number
          id: string
          notes: string | null
          patient_id: string
          patient_name: string
          service_id: string
          service_name: string
          status: string
          time: string
          updated_at: string
        }
        Insert: {
          clinic_id: string
          clinic_name: string
          created_at?: string
          date: string
          duration: number
          id?: string
          notes?: string | null
          patient_id: string
          patient_name: string
          service_id: string
          service_name: string
          status?: string
          time: string
          updated_at?: string
        }
        Update: {
          clinic_id?: string
          clinic_name?: string
          created_at?: string
          date?: string
          duration?: number
          id?: string
          notes?: string | null
          patient_id?: string
          patient_name?: string
          service_id?: string
          service_name?: string
          status?: string
          time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_configurations: {
        Row: {
          blocked_times: string[] | null
          clinic_id: string
          created_at: string
          date: string
          end_time: string
          id: string
          interval_minutes: number
          is_open: boolean
          start_time: string
          updated_at: string
        }
        Insert: {
          blocked_times?: string[] | null
          clinic_id: string
          created_at?: string
          date: string
          end_time?: string
          id?: string
          interval_minutes?: number
          is_open?: boolean
          start_time?: string
          updated_at?: string
        }
        Update: {
          blocked_times?: string[] | null
          clinic_id?: string
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          interval_minutes?: number
          is_open?: boolean
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_configurations_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics: {
        Row: {
          city: string
          complement: string | null
          created_at: string
          id: string
          neighborhood: string
          number: string
          phone: string | null
          state: string
          street: string
          unit_name: string
          updated_at: string
          zip_code: string
        }
        Insert: {
          city: string
          complement?: string | null
          created_at?: string
          id?: string
          neighborhood: string
          number: string
          phone?: string | null
          state: string
          street: string
          unit_name: string
          updated_at?: string
          zip_code: string
        }
        Update: {
          city?: string
          complement?: string | null
          created_at?: string
          id?: string
          neighborhood?: string
          number?: string
          phone?: string | null
          state?: string
          street?: string
          unit_name?: string
          updated_at?: string
          zip_code?: string
        }
        Relationships: []
      }
      patient_profiles: {
        Row: {
          address: string
          birthdate: string
          clinic_id: string
          cpf: string
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          birthdate: string
          clinic_id: string
          cpf: string
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          birthdate?: string
          clinic_id?: string
          cpf?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean
          created_at: string
          description: string
          duration: number
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          duration: number
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          duration?: number
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_appointment_conflict: {
        Args:
          | {
              appointment_date: string
              appointment_time: string
              appointment_duration: number
              exclude_appointment_id?: string
            }
          | {
              appointment_date: string
              appointment_time: string
              appointment_duration: number
              exclude_appointment_id?: string
            }
        Returns: boolean
      }
      check_time_slot_availability: {
        Args: {
          p_clinic_id: string
          p_date: string
          p_time: string
          p_duration?: number
        }
        Returns: boolean
      }
      get_available_time_slots: {
        Args: { p_clinic_id: string; p_date: string }
        Returns: {
          time_slot: string
        }[]
      }
      get_calendar_configurations: {
        Args: {
          p_clinic_id: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: {
          id: string
          clinic_id: string
          date: string
          is_open: boolean
          start_time: string
          end_time: string
          interval_minutes: number
          blocked_times: string[]
          created_at: string
          updated_at: string
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      save_calendar_configuration: {
        Args: {
          p_clinic_id: string
          p_date: string
          p_is_open: boolean
          p_start_time: string
          p_end_time: string
          p_interval_minutes: number
          p_blocked_times: string[]
        }
        Returns: {
          blocked_times: string[] | null
          clinic_id: string
          created_at: string
          date: string
          end_time: string
          id: string
          interval_minutes: number
          is_open: boolean
          start_time: string
          updated_at: string
        }
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
