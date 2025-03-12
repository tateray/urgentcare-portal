export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: number
          email: string
          password: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          email: string
          password: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          email?: string
          password?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_chat_messages: {
        Row: {
          id: string
          user_id: string
          message: string
          response: string
          created_at: string
          is_favorite: boolean
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          response: string
          created_at?: string
          is_favorite?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          response?: string
          created_at?: string
          is_favorite?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      appointments: {
        Row: {
          id: string
          user_id: string
          hospital_id: number
          doctor_name: string
          specialty: string
          appointment_date: string
          status: string
          notification_sent: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hospital_id: number
          doctor_name: string
          specialty: string
          appointment_date: string
          status?: string
          notification_sent?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          hospital_id?: number
          doctor_name?: string
          specialty?: string
          appointment_date?: string
          status?: string
          notification_sent?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      patient_queue: {
        Row: {
          id: string
          appointment_id: string
          user_id: string
          hospital_id: number
          check_in_time: string | null
          estimated_wait_time: number | null
          position_in_queue: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          appointment_id: string
          user_id: string
          hospital_id: number
          check_in_time?: string | null
          estimated_wait_time?: number | null
          position_in_queue?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          appointment_id?: string
          user_id?: string
          hospital_id?: number
          check_in_time?: string | null
          estimated_wait_time?: number | null
          position_in_queue?: number | null
          status?: string
          created_at?: string
          updated_at?: string
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
          {
            foreignKeyName: "patient_queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string | null
          phone_number: string | null
          national_id: string | null
          blood_type: string | null
          allergies: string | null
          medical_conditions: string | null
          current_medications: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
        }
        Insert: {
          id: string
          email?: string | null
          phone_number?: string | null
          national_id?: string | null
          blood_type?: string | null
          allergies?: string | null
          medical_conditions?: string | null
          current_medications?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          phone_number?: string | null
          national_id?: string | null
          blood_type?: string | null
          allergies?: string | null
          medical_conditions?: string | null
          current_medications?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          }
        ]
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
  }
}
