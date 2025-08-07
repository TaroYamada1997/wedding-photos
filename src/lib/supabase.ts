import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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