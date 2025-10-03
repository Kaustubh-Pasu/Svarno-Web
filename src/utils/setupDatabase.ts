import { supabase } from '../lib/supabase'

export const setupDatabase = async () => {
  try {
    console.log('Setting up database tables...')
    
    // Check if users table exists and create if needed
    const { error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (usersError) {
      console.log('Users table does not exist or has issues:', usersError.message)
      console.log('Please create the users table in your Supabase dashboard with the following schema:')
      console.log(`
        CREATE TABLE users (
          id UUID REFERENCES auth.users(id) PRIMARY KEY,
          name TEXT NOT NULL,
          age INTEGER NOT NULL CHECK (age >= 13 AND age <= 18),
          email TEXT NOT NULL,
          profile_picture TEXT,
          level INTEGER DEFAULT 1,
          experience INTEGER DEFAULT 0,
          certificates JSONB DEFAULT '[]',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable Row Level Security
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can view own profile" ON users
          FOR SELECT USING (auth.uid() = id);
          
        CREATE POLICY "Users can update own profile" ON users
          FOR UPDATE USING (auth.uid() = id);
          
        CREATE POLICY "Users can insert own profile" ON users
          FOR INSERT WITH CHECK (auth.uid() = id);
      `)
      return { success: false, error: 'Users table not found', needsSetup: true }
    }
    
    console.log('Users table exists and is accessible')
    return { success: true }
  } catch (err) {
    console.error('Database setup error:', err)
    return { success: false, error: 'Database setup failed' }
  }
}

export const createSampleUser = async () => {
  try {
    // This would only work if we have a user authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('No authenticated user found')
      return { success: false, error: 'No authenticated user' }
    }
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: user.id,
        name: 'Test User',
        age: 16,
        email: user.email || 'test@example.com',
        level: 1,
        experience: 0,
        certificates: []
      }])
      .select()
    
    if (error) {
      console.error('Error creating user:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Sample user created:', data)
    return { success: true, data }
  } catch (err) {
    console.error('Error creating sample user:', err)
    return { success: false, error: 'Failed to create sample user' }
  }
}
