import { supabase } from '../lib/supabase'

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Supabase connection successful!')
    return { success: true }
  } catch (err) {
    console.error('Supabase connection failed:', err)
    return { success: false, error: 'Connection failed' }
  }
}

export const checkUserTable = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Users table error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Users table accessible:', data)
    return { success: true, data }
  } catch (err) {
    console.error('Users table check failed:', err)
    return { success: false, error: 'Table check failed' }
  }
}
