import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client (for API routes)
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Client-side Supabase client (for components)
export function createClientSupabaseClient() {
  if (typeof window === 'undefined') {
    throw new Error('This function should only be called on the client side')
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Database types for TypeScript
export interface Photo {
  id: string
  nickname: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  imageUrl: string  // S3 URL instead of base64 data
  createdAt: string
}

export interface Admin {
  id: string
  username: string
  password: string
}