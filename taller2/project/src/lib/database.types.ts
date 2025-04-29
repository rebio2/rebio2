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
      vehicles: {
        Row: {
          id: string
          license_plate: string
          brand: string
          model: string
          year: number
          client_name: string
          phone_number: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          license_plate: string
          brand: string
          model: string
          year: number
          client_name: string
          phone_number: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          license_plate?: string
          brand?: string
          model?: string
          year?: number
          client_name?: string
          phone_number?: string
          created_at?: string
          user_id?: string
        }
      }
      repairs: {
        Row: {
          id: string
          vehicle_id: string
          description: string
          cost: number
          is_warning: boolean
          status: 'pending' | 'in_progress' | 'completed' | 'warning'
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          description: string
          cost: number
          is_warning?: boolean
          status?: 'pending' | 'in_progress' | 'completed' | 'warning'
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          description?: string
          cost?: number
          is_warning?: boolean
          status?: 'pending' | 'in_progress' | 'completed' | 'warning'
          created_at?: string
          user_id?: string
        }
      }
      work_orders: {
        Row: {
          id: string
          vehicle_id: string
          date: string
          status: 'pending' | 'approved' | 'in_progress' | 'completed'
          total_cost: number
          signature: string | null
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          date?: string
          status?: 'pending' | 'approved' | 'in_progress' | 'completed'
          total_cost: number
          signature?: string | null
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          date?: string
          status?: 'pending' | 'approved' | 'in_progress' | 'completed'
          total_cost?: number
          signature?: string | null
          created_at?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      repair_status: 'pending' | 'in_progress' | 'completed' | 'warning'
      work_order_status: 'pending' | 'approved' | 'in_progress' | 'completed'
    }
  }
}