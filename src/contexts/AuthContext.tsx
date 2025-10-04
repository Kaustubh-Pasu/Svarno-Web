import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase, User } from '../lib/supabase'
import { createUserProfile } from '../utils/databaseSetup'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, name: string, age: number) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Fallback timeout to prevent infinite loading (increased to 15 seconds)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('⚠️ AuthContext: Loading timeout reached, forcing loading to false')
        setLoading(false)
      }
    }, 15000) // 15 second timeout

    return () => clearTimeout(timeout)
  }, [loading])

  useEffect(() => {
    // Check for existing session
    const getInitialSession = async () => {
      console.log('🔄 AuthContext: Getting initial session...')
      const { data: { session } } = await supabase.auth.getSession()
      console.log('🔄 AuthContext: Initial session:', { session, user: session?.user })
      
      if (session?.user) {
        console.log('🔄 AuthContext: Found existing session, fetching user profile...')
        // Pass the session user data directly to avoid hanging on getSession()
        await fetchUserProfile(session.user.id, session.user)
      } else {
        console.log('🔄 AuthContext: No existing session found')
        setUser(null)
      }
      setLoading(false)
      console.log('🔄 AuthContext: Initial session check complete, loading set to false')
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 AuthContext: Auth state changed:', { event, session, user: session?.user })
        
        if (session?.user) {
          console.log('🔄 AuthContext: New session detected, fetching user profile...')
          // Pass the session user data directly to avoid hanging on getSession()
          await fetchUserProfile(session.user.id, session.user)
        } else {
          console.log('🔄 AuthContext: No session, clearing user')
          setUser(null)
        }
        setLoading(false)
        console.log('🔄 AuthContext: Auth state change complete, loading set to false')
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string, sessionUser?: any) => {
    console.log('👤 fetchUserProfile: Starting for userId:', userId)
    
    try {
      // Create a basic user immediately from the session data
      // This ensures the user is set even if database operations fail
      let userData = sessionUser
      
      // If no session user provided, try to get it from session
      if (!userData) {
        console.log('👤 fetchUserProfile: No session user provided, getting from session...')
        const { data: session } = await supabase.auth.getSession()
        userData = session.session?.user
      }
      
      if (userData) {
        console.log('👤 fetchUserProfile: Found user data, creating basic user')
        
        const basicUser: User = {
          id: userData.id,
          name: userData.user_metadata?.name || 
                userData.user_metadata?.full_name || 
                userData.email?.split('@')[0] || 
                'User',
          age: userData.user_metadata?.age || 16,
          email: userData.email || '',
          level: 1,
          experience: 0,
          certificates: []
        }
        
        console.log('👤 fetchUserProfile: Created basic user:', basicUser)
        setUser(basicUser)
        
        // Try to fetch from database in the background (non-blocking)
        console.log('👤 fetchUserProfile: Starting background database operations...')
        handleDatabaseOperations(userId, basicUser)
        
        console.log('👤 fetchUserProfile: Function complete - user set immediately')
        return
      } else {
        console.error('👤 fetchUserProfile: No user data found')
        throw new Error('No user data available')
      }
      
    } catch (error) {
      console.error('👤 fetchUserProfile: Error fetching user profile:', error)
      console.log('👤 fetchUserProfile: Function complete - error handled')
    }
  }

  // Separate function for database operations (truly non-blocking)
  const handleDatabaseOperations = async (userId: string, basicUser: User) => {
    try {
      console.log('👤 handleDatabaseOperations: Starting for userId:', userId)
      
      // Try to fetch from database
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (!error && data) {
        console.log('👤 handleDatabaseOperations: Found user in database, updating user:', data)
        setUser(data as User)
      } else if (error?.code === 'PGRST116') {
        // User doesn't exist in database, create it
        console.log('👤 handleDatabaseOperations: User not in database, creating profile...')
              try {
                const result = await createUserProfile(userId, {
                  name: basicUser.name,
                  email: basicUser.email
                })
                console.log('👤 handleDatabaseOperations: User profile created in database:', result)
              } catch (dbError) {
                console.log('👤 handleDatabaseOperations: Could not create user profile in database:', dbError)
              }
      } else {
        console.log('👤 handleDatabaseOperations: Database error, keeping basic user:', error)
      }
    } catch (dbError) {
      console.log('👤 handleDatabaseOperations: Database operation failed, keeping basic user:', dbError)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('📝 Attempting sign up with:', { email, name })
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { name }
        }
      })

      console.log('📝 Sign up response:', { data, error })

      if (error) throw error

      // Create user profile (only if users table exists)
      if (data.user) {
        try {
          const result = await createUserProfile(data.user.id, { name, email })
          if (result.success) {
            console.log('User profile created successfully')
          } else {
            console.log('Could not create user profile:', result.error)
          }
        } catch (profileError) {
          console.log('Users table might not exist yet:', profileError)
          // Don't throw error here, just log it
        }
      }

      return { success: true }
    } catch (error: any) {
      console.error('📝 Sign up error:', error)
      return { success: false, error: error.message }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting sign in with:', { email })
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log('🔐 Sign in response:', { data, error })

      if (error) throw error

      // Force fetch user profile immediately after successful sign in
      if (data.user) {
        console.log('🔐 Sign in successful, immediately fetching user profile...')
        await fetchUserProfile(data.user.id)
        
        // Also manually check session to ensure state is updated
        console.log('🔐 Manually checking session after sign in...')
        const { data: sessionData } = await supabase.auth.getSession()
        console.log('🔐 Manual session check result:', sessionData)
      }

      return { success: true }
    } catch (error: any) {
      console.error('🔐 Sign in error:', error)
      return { success: false, error: error.message }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `http://localhost:3000/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) throw error
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


