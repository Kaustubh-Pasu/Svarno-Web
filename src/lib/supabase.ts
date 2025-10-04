import { createClient } from '@supabase/supabase-js'

// Use the same Supabase configuration as the main app
const supabaseUrl = 'https://wwqijgwrfkyhnhywondj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cWlqZ3dyZmt5aG5oeXdvbmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODM3NDUsImV4cCI6MjA2ODI1OTc0NX0._zNAMEwZbyB8LdszDAIFKjUJ4zbTwBddVoWZfgTni5w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true
  },
  global: {
    headers: {
      'x-application-name': 'svarno-website'
    }
  },
  db: {
    schema: 'public'
  }
})

export type User = {
  id: string
  name: string
  age: number
  email: string
  profilePicture?: string
  level: number
  experience: number
  certificates: any[]
}


