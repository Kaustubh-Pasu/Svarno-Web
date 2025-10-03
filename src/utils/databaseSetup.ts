import { supabase } from '../lib/supabase'

export const setupDatabaseTables = async () => {
  try {
    console.log('Setting up database tables...')
    
    // Test if we can connect to Supabase
    const { error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('Database connection failed:', testError)
      return {
        success: false,
        error: testError.message,
        needsManualSetup: true
      }
    }
    
    console.log('Database connection successful!')
    return {
      success: true,
      message: 'Database is ready to use'
    }
  } catch (error) {
    console.error('Database setup error:', error)
    return {
      success: false,
      error: 'Database setup failed',
      needsManualSetup: true
    }
  }
}

export const createUserProfile = async (userId: string, userData: {
  name: string
  email: string
}) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: userId,
        name: userData.name,
        email: userData.email,
        level: 1,
        experience: 0,
        certificates: []
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating user profile:', error)
      return { success: false, error: error.message }
    }
    
    console.log('User profile created:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error creating user profile:', error)
    return { success: false, error: 'Failed to create user profile' }
  }
}

export const checkUserExists = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return { exists: false }
      }
      throw error
    }
    
    return { exists: true, data }
  } catch (error) {
    console.error('Error checking user existence:', error)
    return { exists: false, error: error }
  }
}
