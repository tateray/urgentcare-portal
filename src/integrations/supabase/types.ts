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
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: number
          password: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          password: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          password?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_favorite: boolean | null
          message: string
          response: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          message: string
          response: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          message?: string
          response?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ambulance_bookings: {
        Row: {
          booking_time: string | null
          created_at: string | null
          hospital_id: number | null
          id: number
          status: string | null
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          booking_time?: string | null
          created_at?: string | null
          hospital_id?: number | null
          id?: number
          status?: string | null
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          booking_time?: string | null
          created_at?: string | null
          hospital_id?: number | null
          id?: number
          status?: string | null
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ambulance_bookings_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ambulance_bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ambulance_tracking: {
        Row: {
          booking_id: number | null
          id: number
          latitude: number
          longitude: number
          timestamp: string | null
        }
        Insert: {
          booking_id?: number | null
          id?: number
          latitude: number
          longitude: number
          timestamp?: string | null
        }
        Update: {
          booking_id?: number | null
          id?: number
          latitude?: number
          longitude?: number
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ambulance_tracking_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "ambulance_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          created_at: string | null
          doctor_name: string
          hospital_id: number | null
          id: string
          notification_sent: boolean | null
          specialty: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          appointment_date: string
          created_at?: string | null
          doctor_name: string
          hospital_id?: number | null
          id?: string
          notification_sent?: boolean | null
          specialty: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          appointment_date?: string
          created_at?: string | null
          doctor_name?: string
          hospital_id?: number | null
          id?: string
          notification_sent?: boolean | null
          specialty?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          created_at: string | null
          id: number
          is_favorite: boolean | null
          name: string
          phone_number: string
          relationship: string | null
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_favorite?: boolean | null
          name: string
          phone_number: string
          relationship?: string | null
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_favorite?: boolean | null
          name?: string
          phone_number?: string
          relationship?: string | null
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string
          created_at: string | null
          id: number
          latitude: number
          longitude: number
          name: string
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          id?: number
          latitude: number
          longitude: number
          name: string
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: number
          latitude?: number
          longitude?: number
          name?: string
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      medical_histories: {
        Row: {
          allergies: string | null
          created_at: string | null
          emergency_notes: string | null
          id: number
          medical_conditions: string | null
          medications: string | null
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          allergies?: string | null
          created_at?: string | null
          emergency_notes?: string | null
          id?: number
          medical_conditions?: string | null
          medications?: string | null
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          allergies?: string | null
          created_at?: string | null
          emergency_notes?: string | null
          id?: number
          medical_conditions?: string | null
          medications?: string | null
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_histories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_queue: {
        Row: {
          appointment_id: string
          check_in_time: string | null
          created_at: string | null
          estimated_wait_time: number | null
          hospital_id: number | null
          id: string
          position_in_queue: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          appointment_id: string
          check_in_time?: string | null
          created_at?: string | null
          estimated_wait_time?: number | null
          hospital_id?: number | null
          id?: string
          position_in_queue?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          appointment_id?: string
          check_in_time?: string | null
          created_at?: string | null
          estimated_wait_time?: number | null
          hospital_id?: number | null
          id?: string
          position_in_queue?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_queue_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_queue_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          apple_id: string | null
          created_at: string | null
          email: string
          google_id: string | null
          id: number
          is_active: boolean | null
          national_id: string | null
          password: string
          phone_number: string | null
          preferences: Json | null
          profile_picture: string | null
          updated_at: string | null
        }
        Insert: {
          apple_id?: string | null
          created_at?: string | null
          email: string
          google_id?: string | null
          id?: number
          is_active?: boolean | null
          national_id?: string | null
          password: string
          phone_number?: string | null
          preferences?: Json | null
          profile_picture?: string | null
          updated_at?: string | null
        }
        Update: {
          apple_id?: string | null
          created_at?: string | null
          email?: string
          google_id?: string | null
          id?: number
          is_active?: boolean | null
          national_id?: string | null
          password?: string
          phone_number?: string | null
          preferences?: Json | null
          profile_picture?: string | null
          updated_at?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
