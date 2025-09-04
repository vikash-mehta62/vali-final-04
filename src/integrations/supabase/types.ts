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
      activities: {
        Row: {
          description: string
          id: string
          timestamp: string | null
          type: string
        }
        Insert: {
          description: string
          id?: string
          timestamp?: string | null
          type: string
        }
        Update: {
          description?: string
          id?: string
          timestamp?: string | null
          type?: string
        }
        Relationships: []
      }
      bulk_discounts: {
        Row: {
          discount_percent: number
          id: string
          min_quantity: number
          product_id: string
        }
        Insert: {
          discount_percent: number
          id?: string
          min_quantity: number
          product_id: string
        }
        Update: {
          discount_percent?: number
          id?: string
          min_quantity?: number
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulk_discounts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          category: string | null
          city: string | null
          company: string
          email: string
          id: string
          is_shop: boolean | null
          last_order: string | null
          location: unknown | null
          name: string
          phone: string
          shop_status: string | null
          state: string
          status: string
          total_spent: number | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          city?: string | null
          company: string
          email: string
          id?: string
          is_shop?: boolean | null
          last_order?: string | null
          location?: unknown | null
          name: string
          phone: string
          shop_status?: string | null
          state: string
          status: string
          total_spent?: number | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          city?: string | null
          company?: string
          email?: string
          id?: string
          is_shop?: boolean | null
          last_order?: string | null
          location?: unknown | null
          name?: string
          phone?: string
          shop_status?: string | null
          state?: string
          status?: string
          total_spent?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          total: number
          unit_price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          total: number
          unit_price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          client_id: string
          client_name: string
          date: string | null
          id: string
          status: string
          total: number
        }
        Insert: {
          client_id: string
          client_name: string
          date?: string | null
          id?: string
          status: string
          total?: number
        }
        Update: {
          client_id?: string
          client_name?: string
          date?: string | null
          id?: string
          status?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          batch_info: string | null
          box_size: number | null
          category: string
          expiry_date: string | null
          id: string
          image: string | null
          last_updated: string | null
          name: string
          organic: boolean | null
          origin: string | null
          palette: string | null
          price: number
          price_per_box: number | null
          quantity: number
          storage_instructions: string | null
          threshold: number
          unit: string
          weight_variation: number | null
        }
        Insert: {
          batch_info?: string | null
          box_size?: number | null
          category: string
          expiry_date?: string | null
          id?: string
          image?: string | null
          last_updated?: string | null
          name: string
          organic?: boolean | null
          origin?: string | null
          palette?: string | null
          price?: number
          price_per_box?: number | null
          quantity?: number
          storage_instructions?: string | null
          threshold?: number
          unit: string
          weight_variation?: number | null
        }
        Update: {
          batch_info?: string | null
          box_size?: number | null
          category?: string
          expiry_date?: string | null
          id?: string
          image?: string | null
          last_updated?: string | null
          name?: string
          organic?: boolean | null
          origin?: string | null
          palette?: string | null
          price?: number
          price_per_box?: number | null
          quantity?: number
          storage_instructions?: string | null
          threshold?: number
          unit?: string
          weight_variation?: number | null
        }
        Relationships: []
      }
      reorders: {
        Row: {
          date_created: string | null
          expected_delivery: string | null
          expedited: boolean | null
          id: string
          notes: string | null
          product_id: string
          product_name: string
          quantity: number
          status: string
          supplier: string | null
        }
        Insert: {
          date_created?: string | null
          expected_delivery?: string | null
          expedited?: boolean | null
          id?: string
          notes?: string | null
          product_id: string
          product_name: string
          quantity: number
          status: string
          supplier?: string | null
        }
        Update: {
          date_created?: string | null
          expected_delivery?: string | null
          expedited?: boolean | null
          id?: string
          notes?: string | null
          product_id?: string
          product_name?: string
          quantity?: number
          status?: string
          supplier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reorders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
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
