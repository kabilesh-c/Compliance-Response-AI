import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://lgcygoxsjxjximbzbnlk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnY3lnb3hzanhqeGltYnpibmxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4Njc2NjksImV4cCI6MjA4ODQ0MzY2OX0.zB250Lwm7V6N_G4ppMdboRogbLEvGXcHcwWra1UG2Wg';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database TypeScript types (auto-generated from schema)
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          firebase_uid: string;
          email: string;
          name: string;
          role: 'ADMIN' | 'MANAGER' | 'PHARMACIST';
          mode: 'RETAIL' | 'HOSPITAL';
          organization_id: string | null;
          organization_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          firebase_uid: string;
          email: string;
          name: string;
          role: 'ADMIN' | 'MANAGER' | 'PHARMACIST';
          mode: 'RETAIL' | 'HOSPITAL';
          organization_id?: string | null;
          organization_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          firebase_uid?: string;
          email?: string;
          name?: string;
          role?: 'ADMIN' | 'MANAGER' | 'PHARMACIST';
          mode?: 'RETAIL' | 'HOSPITAL';
          organization_id?: string | null;
          organization_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
