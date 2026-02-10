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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_refund_requests: {
        Row: {
          admin_notes: string | null
          amount: number | null
          created_at: string
          creator_id: string
          id: string
          processed_at: string | null
          reason: string | null
          requested_at: string | null
          status: string | null
          ticket_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount?: number | null
          created_at?: string
          creator_id: string
          id?: string
          processed_at?: string | null
          reason?: string | null
          requested_at?: string | null
          status?: string | null
          ticket_id: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number | null
          created_at?: string
          creator_id?: string
          id?: string
          processed_at?: string | null
          reason?: string | null
          requested_at?: string | null
          status?: string | null
          ticket_id?: string
        }
        Relationships: []
      }
      analytics: {
        Row: {
          asset_id: string
          created_at: string
          id: string
          total_views: number | null
          unique_views: number | null
          updated_at: string
        }
        Insert: {
          asset_id: string
          created_at?: string
          id?: string
          total_views?: number | null
          unique_views?: number | null
          updated_at?: string
        }
        Update: {
          asset_id?: string
          created_at?: string
          id?: string
          total_views?: number | null
          unique_views?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      audience_subscriptions: {
        Row: {
          created_at: string
          id: string
          status: string | null
          tier_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string | null
          tier_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string | null
          tier_id?: string
          user_id?: string
        }
        Relationships: []
      }
      businesses: {
        Row: {
          address: string | null
          created_at: string
          id: string
          name: string | null
          owner_id: string
          products_count: number | null
          store_logo_url: string | null
          store_name: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string | null
          owner_id: string
          products_count?: number | null
          store_logo_url?: string | null
          store_name?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string | null
          owner_id?: string
          products_count?: number | null
          store_logo_url?: string | null
          store_name?: string | null
        }
        Relationships: []
      }
      channels: {
        Row: {
          branding: Json | null
          created_at: string
          id: string
          is_private: boolean | null
          name: string
          owner_id: string
          package_price: number | null
          parent_id: string | null
          sell_individually: boolean | null
          subscription_price: number | null
        }
        Insert: {
          branding?: Json | null
          created_at?: string
          id?: string
          is_private?: boolean | null
          name: string
          owner_id: string
          package_price?: number | null
          parent_id?: string | null
          sell_individually?: boolean | null
          subscription_price?: number | null
        }
        Update: {
          branding?: Json | null
          created_at?: string
          id?: string
          is_private?: boolean | null
          name?: string
          owner_id?: string
          package_price?: number | null
          parent_id?: string | null
          sell_individually?: boolean | null
          subscription_price?: number | null
        }
        Relationships: []
      }
      community_events: {
        Row: {
          created_at: string
          creator_id: string
          id: string
          status: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          creator_id: string
          id?: string
          status?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          id?: string
          status?: string | null
          title?: string | null
        }
        Relationships: []
      }
      content_assets: {
        Row: {
          asset_id: string | null
          channel_id: string | null
          content_type: string
          created_at: string
          description: string | null
          duration_seconds: number | null
          embed_provider: string | null
          embed_urls: string[] | null
          id: string
          is_approved: boolean | null
          is_ppv: boolean | null
          main_category: string | null
          owner_id: string | null
          price: number | null
          sub_category: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          asset_id?: string | null
          channel_id?: string | null
          content_type?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          embed_provider?: string | null
          embed_urls?: string[] | null
          id?: string
          is_approved?: boolean | null
          is_ppv?: boolean | null
          main_category?: string | null
          owner_id?: string | null
          price?: number | null
          sub_category?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          asset_id?: string | null
          channel_id?: string | null
          content_type?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          embed_provider?: string | null
          embed_urls?: string[] | null
          id?: string
          is_approved?: boolean | null
          is_ppv?: boolean | null
          main_category?: string | null
          owner_id?: string | null
          price?: number | null
          sub_category?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_metadata: {
        Row: {
          asset_id: string
          cast_members: string[] | null
          cinematographer: string | null
          content_rating: string | null
          country: string | null
          created_at: string
          director: string | null
          editor: string | null
          genres: string[] | null
          id: string
          language: string | null
          music_composer: string | null
          producer: string | null
          studio: string | null
          subtitles: string[] | null
          updated_at: string
          writer: string | null
          year_of_release: number | null
        }
        Insert: {
          asset_id: string
          cast_members?: string[] | null
          cinematographer?: string | null
          content_rating?: string | null
          country?: string | null
          created_at?: string
          director?: string | null
          editor?: string | null
          genres?: string[] | null
          id?: string
          language?: string | null
          music_composer?: string | null
          producer?: string | null
          studio?: string | null
          subtitles?: string[] | null
          updated_at?: string
          writer?: string | null
          year_of_release?: number | null
        }
        Update: {
          asset_id?: string
          cast_members?: string[] | null
          cinematographer?: string | null
          content_rating?: string | null
          country?: string | null
          created_at?: string
          director?: string | null
          editor?: string | null
          genres?: string[] | null
          id?: string
          language?: string | null
          music_composer?: string | null
          producer?: string | null
          studio?: string | null
          subtitles?: string[] | null
          updated_at?: string
          writer?: string | null
          year_of_release?: number | null
        }
        Relationships: []
      }
      creator_cdn_usage: {
        Row: {
          ai_generations_limit: number | null
          ai_generations_used: number | null
          created_at: string
          id: string
          profile_id: string
          storage_limit_bytes: number | null
          storage_used_bytes: number | null
          updated_at: string
        }
        Insert: {
          ai_generations_limit?: number | null
          ai_generations_used?: number | null
          created_at?: string
          id?: string
          profile_id: string
          storage_limit_bytes?: number | null
          storage_used_bytes?: number | null
          updated_at?: string
        }
        Update: {
          ai_generations_limit?: number | null
          ai_generations_used?: number | null
          created_at?: string
          id?: string
          profile_id?: string
          storage_limit_bytes?: number | null
          storage_used_bytes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      creator_event_tickets: {
        Row: {
          buyer_email: string | null
          buyer_name: string | null
          checked_in: boolean | null
          checked_in_at: string | null
          created_at: string
          email_sent: boolean | null
          event_id: string
          id: string
          payfast_reference: string | null
          payment_status: string | null
          price: number | null
          purchased_at: string | null
          ticket_tier: string | null
          ticket_type: string | null
          tracking_number: string | null
        }
        Insert: {
          buyer_email?: string | null
          buyer_name?: string | null
          checked_in?: boolean | null
          checked_in_at?: string | null
          created_at?: string
          email_sent?: boolean | null
          event_id: string
          id?: string
          payfast_reference?: string | null
          payment_status?: string | null
          price?: number | null
          purchased_at?: string | null
          ticket_tier?: string | null
          ticket_type?: string | null
          tracking_number?: string | null
        }
        Update: {
          buyer_email?: string | null
          buyer_name?: string | null
          checked_in?: boolean | null
          checked_in_at?: string | null
          created_at?: string
          email_sent?: boolean | null
          event_id?: string
          id?: string
          payfast_reference?: string | null
          payment_status?: string | null
          price?: number | null
          purchased_at?: string | null
          ticket_tier?: string | null
          ticket_type?: string | null
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_event_tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "creator_events"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_events: {
        Row: {
          adult_price: number | null
          attendee_count: number | null
          child_price: number | null
          contact_email: string | null
          contact_phone: string | null
          contact_whatsapp: string | null
          created_at: string
          creator_id: string
          description: string | null
          end_date: string | null
          event_type: string | null
          id: string
          is_virtual: boolean | null
          is_vvip: boolean | null
          location: string | null
          max_attendees: number | null
          senior_price: number | null
          start_date: string | null
          status: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          adult_price?: number | null
          attendee_count?: number | null
          child_price?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          creator_id: string
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          id?: string
          is_virtual?: boolean | null
          is_vvip?: boolean | null
          location?: string | null
          max_attendees?: number | null
          senior_price?: number | null
          start_date?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          adult_price?: number | null
          attendee_count?: number | null
          child_price?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          creator_id?: string
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          id?: string
          is_virtual?: boolean | null
          is_vvip?: boolean | null
          location?: string | null
          max_attendees?: number | null
          senior_price?: number | null
          start_date?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      creator_payments: {
        Row: {
          amount: number | null
          created_at: string
          creator_id: string
          currency: string | null
          id: string
          notes: string | null
          payment_type: string | null
          reference: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          creator_id: string
          currency?: string | null
          id?: string
          notes?: string | null
          payment_type?: string | null
          reference?: string | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          creator_id?: string
          currency?: string | null
          id?: string
          notes?: string | null
          payment_type?: string | null
          reference?: string | null
          status?: string | null
        }
        Relationships: []
      }
      creator_subscription_tiers: {
        Row: {
          created_at: string
          creator_id: string
          id: string
          name: string
          price: number | null
        }
        Insert: {
          created_at?: string
          creator_id: string
          id?: string
          name: string
          price?: number | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          id?: string
          name?: string
          price?: number | null
        }
        Relationships: []
      }
      embed_pro_channels: {
        Row: {
          category: string | null
          content_count: number | null
          created_at: string
          currency: string | null
          description: string | null
          id: string
          is_free: boolean | null
          is_private: boolean | null
          name: string
          owner_id: string
          package_price: number | null
          parent_id: string | null
          sell_individually: boolean | null
          subscriber_count: number | null
          subscription_price: number | null
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          content_count?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          is_free?: boolean | null
          is_private?: boolean | null
          name: string
          owner_id: string
          package_price?: number | null
          parent_id?: string | null
          sell_individually?: boolean | null
          subscriber_count?: number | null
          subscription_price?: number | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          content_count?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          is_free?: boolean | null
          is_private?: boolean | null
          name?: string
          owner_id?: string
          package_price?: number | null
          parent_id?: string | null
          sell_individually?: boolean | null
          subscriber_count?: number | null
          subscription_price?: number | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "embed_pro_channels_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "embed_pro_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      embed_pro_content: {
        Row: {
          age_restriction: string | null
          channel_id: string | null
          content_type: string
          created_at: string
          creator_notes: string | null
          description: string | null
          embed_provider: string | null
          embed_urls: string[] | null
          id: string
          is_approved: boolean | null
          is_archived: boolean | null
          is_ppv: boolean | null
          moderation_flags: Json | null
          owner_id: string
          price: number | null
          qa_notes: string | null
          qa_status: string | null
          rejection_reason: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          age_restriction?: string | null
          channel_id?: string | null
          content_type?: string
          created_at?: string
          creator_notes?: string | null
          description?: string | null
          embed_provider?: string | null
          embed_urls?: string[] | null
          id?: string
          is_approved?: boolean | null
          is_archived?: boolean | null
          is_ppv?: boolean | null
          moderation_flags?: Json | null
          owner_id: string
          price?: number | null
          qa_notes?: string | null
          qa_status?: string | null
          rejection_reason?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          age_restriction?: string | null
          channel_id?: string | null
          content_type?: string
          created_at?: string
          creator_notes?: string | null
          description?: string | null
          embed_provider?: string | null
          embed_urls?: string[] | null
          id?: string
          is_approved?: boolean | null
          is_archived?: boolean | null
          is_ppv?: boolean | null
          moderation_flags?: Json | null
          owner_id?: string
          price?: number | null
          qa_notes?: string | null
          qa_status?: string | null
          rejection_reason?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "embed_pro_content_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "embed_pro_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      embed_pro_support_tickets: {
        Row: {
          admin_response: string | null
          category: string | null
          created_at: string
          description: string | null
          embed_profile_id: string
          id: string
          message: string | null
          priority: string | null
          responded_at: string | null
          status: string | null
          subject: string
          ticket_number: string
        }
        Insert: {
          admin_response?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          embed_profile_id: string
          id?: string
          message?: string | null
          priority?: string | null
          responded_at?: string | null
          status?: string | null
          subject: string
          ticket_number?: string
        }
        Update: {
          admin_response?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          embed_profile_id?: string
          id?: string
          message?: string | null
          priority?: string | null
          responded_at?: string | null
          status?: string | null
          subject?: string
          ticket_number?: string
        }
        Relationships: []
      }
      event_tickets: {
        Row: {
          buyer_email: string | null
          buyer_name: string | null
          created_at: string
          event_id: string
          id: string
          payment_status: string | null
          price: number | null
          ticket_type: string | null
        }
        Insert: {
          buyer_email?: string | null
          buyer_name?: string | null
          created_at?: string
          event_id: string
          id?: string
          payment_status?: string | null
          price?: number | null
          ticket_type?: string | null
        }
        Update: {
          buyer_email?: string | null
          buyer_name?: string | null
          created_at?: string
          event_id?: string
          id?: string
          payment_status?: string | null
          price?: number | null
          ticket_type?: string | null
        }
        Relationships: []
      }
      free_embed_content: {
        Row: {
          channel_id: string | null
          content_type: string
          created_at: string
          id: string
          main_category: string | null
          owner_id: string
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          channel_id?: string | null
          content_type?: string
          created_at?: string
          id?: string
          main_category?: string | null
          owner_id: string
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          channel_id?: string | null
          content_type?: string
          created_at?: string
          id?: string
          main_category?: string | null
          owner_id?: string
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      guest_preferences: {
        Row: {
          agreed_at: string | null
          agreed_to_marketing: boolean | null
          created_at: string
          email_alerts: boolean | null
          email_promotions: boolean | null
          id: string
          interests: string[] | null
          user_id: string
        }
        Insert: {
          agreed_at?: string | null
          agreed_to_marketing?: boolean | null
          created_at?: string
          email_alerts?: boolean | null
          email_promotions?: boolean | null
          id?: string
          interests?: string[] | null
          user_id: string
        }
        Update: {
          agreed_at?: string | null
          agreed_to_marketing?: boolean | null
          created_at?: string
          email_alerts?: boolean | null
          email_promotions?: boolean | null
          id?: string
          interests?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      playlist_items: {
        Row: {
          content_asset_id: string
          created_at: string
          id: string
          playlist_id: string
          position: number | null
        }
        Insert: {
          content_asset_id: string
          created_at?: string
          id?: string
          playlist_id: string
          position?: number | null
        }
        Update: {
          content_asset_id?: string
          created_at?: string
          id?: string
          playlist_id?: string
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_items_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          channel_id: string | null
          content_type: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          item_count: number | null
          items: Json | null
          name: string
          owner_id: string
          sell_separately: boolean | null
          subscription_price: number | null
          thumbnail_url: string | null
          total_duration_seconds: number | null
          updated_at: string
        }
        Insert: {
          channel_id?: string | null
          content_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          item_count?: number | null
          items?: Json | null
          name: string
          owner_id: string
          sell_separately?: boolean | null
          subscription_price?: number | null
          thumbnail_url?: string | null
          total_duration_seconds?: number | null
          updated_at?: string
        }
        Update: {
          channel_id?: string | null
          content_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          item_count?: number | null
          items?: Json | null
          name?: string
          owner_id?: string
          sell_separately?: boolean | null
          subscription_price?: number | null
          thumbnail_url?: string | null
          total_duration_seconds?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          full_name: string | null
          id: string
          is_creator: boolean | null
          plan: string | null
          player_settings: Json | null
          protection_settings: Json | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_creator?: boolean | null
          plan?: string | null
          player_settings?: Json | null
          protection_settings?: Json | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_creator?: boolean | null
          plan?: string | null
          player_settings?: Json | null
          protection_settings?: Json | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "guest"
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
    Enums: {
      app_role: ["admin", "moderator", "user", "guest"],
    },
  },
} as const
