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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          message: string
          responded_at: string | null
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          message: string
          responded_at?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          responded_at?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      cv_downloads: {
        Row: {
          created_at: string
          download_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          download_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          download_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Relationships: []
      }
      cv_management: {
        Row: {
          created_at: string | null
          file_path: string
          file_size: number | null
          filename: string
          id: string
          is_active: boolean | null
          updated_at: string | null
          upload_date: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          file_path: string
          file_size?: number | null
          filename: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          upload_date?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          filename?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          upload_date?: string | null
          version?: number | null
        }
        Relationships: []
      }
      portfolio_articles: {
        Row: {
          article_url: string | null
          category: string[] | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          pdf_url: string | null
          publication_date: string | null
          reading_time: number | null
          sort_order: number | null
          subtitle: string | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          article_url?: string | null
          category?: string[] | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          pdf_url?: string | null
          publication_date?: string | null
          reading_time?: number | null
          sort_order?: number | null
          subtitle?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          article_url?: string | null
          category?: string[] | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          pdf_url?: string | null
          publication_date?: string | null
          reading_time?: number | null
          sort_order?: number | null
          subtitle?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      portfolio_case_studies: {
        Row: {
          created_at: string
          detailed_process: string | null
          document_urls: string[] | null
          future_improvements: string | null
          id: string
          image_gallery: string[] | null
          interactive_demos: string[] | null
          is_public: boolean | null
          lessons_learned: string | null
          methodology: string | null
          overview: string | null
          performance_metrics: Json | null
          project_id: string | null
          technical_specs: Json | null
          title: string
          updated_at: string
          user_feedback: Json | null
          video_urls: string[] | null
        }
        Insert: {
          created_at?: string
          detailed_process?: string | null
          document_urls?: string[] | null
          future_improvements?: string | null
          id?: string
          image_gallery?: string[] | null
          interactive_demos?: string[] | null
          is_public?: boolean | null
          lessons_learned?: string | null
          methodology?: string | null
          overview?: string | null
          performance_metrics?: Json | null
          project_id?: string | null
          technical_specs?: Json | null
          title: string
          updated_at?: string
          user_feedback?: Json | null
          video_urls?: string[] | null
        }
        Update: {
          created_at?: string
          detailed_process?: string | null
          document_urls?: string[] | null
          future_improvements?: string | null
          id?: string
          image_gallery?: string[] | null
          interactive_demos?: string[] | null
          is_public?: boolean | null
          lessons_learned?: string | null
          methodology?: string | null
          overview?: string | null
          performance_metrics?: Json | null
          project_id?: string | null
          technical_specs?: Json | null
          title?: string
          updated_at?: string
          user_feedback?: Json | null
          video_urls?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_case_studies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_certifications: {
        Row: {
          badge_image_url: string | null
          created_at: string
          credential_id: string | null
          credential_url: string | null
          description: string | null
          expiry_date: string | null
          id: string
          is_active: boolean | null
          issue_date: string
          issuer: string
          name: string
          skills_gained: string[] | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          badge_image_url?: string | null
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          issue_date: string
          issuer: string
          name: string
          skills_gained?: string[] | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          badge_image_url?: string | null
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          issue_date?: string
          issuer?: string
          name?: string
          skills_gained?: string[] | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_experience: {
        Row: {
          achievements: string[] | null
          created_at: string
          degree_type: string | null
          description: string | null
          end_date: string | null
          gpa: number | null
          id: string
          is_active: boolean | null
          is_current: boolean | null
          location: string | null
          organization: string
          sort_order: number | null
          start_date: string
          technologies_used: string[] | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          achievements?: string[] | null
          created_at?: string
          degree_type?: string | null
          description?: string | null
          end_date?: string | null
          gpa?: number | null
          id?: string
          is_active?: boolean | null
          is_current?: boolean | null
          location?: string | null
          organization: string
          sort_order?: number | null
          start_date: string
          technologies_used?: string[] | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          achievements?: string[] | null
          created_at?: string
          degree_type?: string | null
          description?: string | null
          end_date?: string | null
          gpa?: number | null
          id?: string
          is_active?: boolean | null
          is_current?: boolean | null
          location?: string | null
          organization?: string
          sort_order?: number | null
          start_date?: string
          technologies_used?: string[] | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          approach: string[] | null
          architecture: Json | null
          case_study_url: string | null
          category: string[]
          challenges: Json | null
          created_at: string
          demo_video_url: string | null
          description: string
          duration: string | null
          github_url: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          key_features: string[] | null
          live_demo_url: string | null
          long_description: string | null
          problem_statement: string | null
          results: Json | null
          solution_overview: string | null
          sort_order: number | null
          status: string
          subtitle: string | null
          team_info: string | null
          technologies: string[]
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          approach?: string[] | null
          architecture?: Json | null
          case_study_url?: string | null
          category?: string[]
          challenges?: Json | null
          created_at?: string
          demo_video_url?: string | null
          description: string
          duration?: string | null
          github_url?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          key_features?: string[] | null
          live_demo_url?: string | null
          long_description?: string | null
          problem_statement?: string | null
          results?: Json | null
          solution_overview?: string | null
          sort_order?: number | null
          status?: string
          subtitle?: string | null
          team_info?: string | null
          technologies?: string[]
          title: string
          updated_at?: string
          year: string
        }
        Update: {
          approach?: string[] | null
          architecture?: Json | null
          case_study_url?: string | null
          category?: string[]
          challenges?: Json | null
          created_at?: string
          demo_video_url?: string | null
          description?: string
          duration?: string | null
          github_url?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          key_features?: string[] | null
          live_demo_url?: string | null
          long_description?: string | null
          problem_statement?: string | null
          results?: Json | null
          solution_overview?: string | null
          sort_order?: number | null
          status?: string
          subtitle?: string | null
          team_info?: string | null
          technologies?: string[]
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      portfolio_skills: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          level: number
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          level: number
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          level?: number
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      project_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_type: string
          ip_address: unknown | null
          metadata: Json | null
          project_id: string
          visitor_session: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_type: string
          ip_address?: unknown | null
          metadata?: Json | null
          project_id: string
          visitor_session?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_type?: string
          ip_address?: unknown | null
          metadata?: Json | null
          project_id?: string
          visitor_session?: string | null
        }
        Relationships: []
      }
      site_analytics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Relationships: []
      }
      visitor_analytics: {
        Row: {
          actions: Json | null
          browser: string | null
          city: string | null
          country: string | null
          created_at: string | null
          device_type: string | null
          id: string
          ip_address: unknown | null
          os: string | null
          page_views: number | null
          referrer: string | null
          session_id: string | null
          time_on_site: unknown | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          actions?: Json | null
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          os?: string | null
          page_views?: number | null
          referrer?: string | null
          session_id?: string | null
          time_on_site?: unknown | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          actions?: Json | null
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          os?: string | null
          page_views?: number | null
          referrer?: string | null
          session_id?: string | null
          time_on_site?: unknown | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_active_cv_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          filename: string
          upload_date: string
          version: number
        }[]
      }
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
