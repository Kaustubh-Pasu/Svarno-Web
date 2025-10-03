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

  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('⚠️ AuthContext: Loading timeout reached, forcing loading to false')
        setLoading(false)
      }
    }, 3000) // 3 second timeout

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
        await fetchUserProfile(session.user.id)
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
          await fetchUserProfile(session.user.id)
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

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('👤 fetchUserProfile: Starting for userId:', userId)
      
      // Try to fetch user profile directly first (most common case)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('👤 fetchUserProfile: Database query result:', { data, error })

      if (!error && data) {
        console.log('👤 fetchUserProfile: Found user in database, setting user:', data)
        setUser(data as User)
        return
      }

      // If user doesn't exist in database, create from auth metadata
      if (error?.code === 'PGRST116') {
        console.log('👤 fetchUserProfile: User not found in database, creating from auth metadata')
        const { data: authUser } = await supabase.auth.getUser()
        
        console.log('👤 fetchUserProfile: Auth user data:', authUser)
        
        if (authUser.user) {
          const basicUser: User = {
            id: authUser.user.id,
            name: authUser.user.user_metadata?.name || 'User',
            age: authUser.user.user_metadata?.age || 16,
            email: authUser.user.email || '',
            level: 1,
            experience: 0,
            certificates: []
          }
          
          console.log('👤 fetchUserProfile: Created basic user from auth metadata:', basicUser)
          setUser(basicUser)
          
          // Try to create user profile in database (non-blocking)
          createUserProfile(userId, {
            name: basicUser.name,
            age: basicUser.age,
            email: basicUser.email
          }).catch(dbError => {
            console.log('👤 fetchUserProfile: Could not create user profile in database:', dbError)
          })
        }
      } else {
        console.error('👤 fetchUserProfile: Database error:', error)
        throw error
      }
    } catch (error) {
      console.error('👤 fetchUserProfile: Error fetching user profile:', error)
      setUser(null)
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
          redirectTo: `${window.location.origin}/auth/callback`
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


