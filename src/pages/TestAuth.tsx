import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, Database, User, Key } from 'lucide-react'
import { testSupabaseConnection, checkUserTable } from '../utils/testSupabase'
import { useAuth } from '../contexts/AuthContext'

const TestAuth: React.FC = () => {
  const [tests, setTests] = useState<{
    supabase: 'pending' | 'success' | 'error'
    usersTable: 'pending' | 'success' | 'error'
    auth: 'pending' | 'success' | 'error'
  }>({
    supabase: 'pending',
    usersTable: 'pending',
    auth: 'pending'
  })
  
  const [results, setResults] = useState<{
    supabase?: any
    usersTable?: any
    auth?: any
  }>({})
  
  const { user, loading } = useAuth()

  useEffect(() => {
    runTests()
  }, [])

  const runTests = async () => {
    // Test 1: Supabase Connection
    const supabaseResult = await testSupabaseConnection()
    setTests(prev => ({ ...prev, supabase: supabaseResult.success ? 'success' : 'error' }))
    setResults(prev => ({ ...prev, supabase: supabaseResult }))

    // Test 2: Users Table
    const usersResult = await checkUserTable()
    setTests(prev => ({ ...prev, usersTable: usersResult.success ? 'success' : 'error' }))
    setResults(prev => ({ ...prev, usersTable: usersResult }))

    // Test 3: Auth Context
    if (user) {
      setTests(prev => ({ ...prev, auth: 'success' }))
      setResults(prev => ({ ...prev, auth: { success: true, user } }))
    } else if (!loading) {
      setTests(prev => ({ ...prev, auth: 'error' }))
      setResults(prev => ({ ...prev, auth: { success: false, error: 'No user authenticated' } }))
    }
  }

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusColor = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500'
      case 'success':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
    }
  }

  return (
    <div className="min-h-screen bg-background-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="luxury-card"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-background-100 mb-2">
              Supabase Connection Test
            </h1>
            <p className="text-background-300">
              Testing authentication and database connectivity
            </p>
          </div>

          <div className="space-y-6">
            {/* Supabase Connection Test */}
            <div className="flex items-center justify-between p-4 bg-background-800 rounded-xl">
              <div className="flex items-center space-x-3">
                <Database className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-background-100">
                    Supabase Connection
                  </h3>
                  <p className="text-sm text-background-400">
                    Testing basic database connectivity
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(tests.supabase)}
                <span className={`font-medium ${getStatusColor(tests.supabase)}`}>
                  {tests.supabase === 'pending' ? 'Testing...' : 
                   tests.supabase === 'success' ? 'Connected' : 'Failed'}
                </span>
              </div>
            </div>

            {/* Users Table Test */}
            <div className="flex items-center justify-between p-4 bg-background-800 rounded-xl">
              <div className="flex items-center space-x-3">
                <User className="w-6 h-6 text-purple-500" />
                <div>
                  <h3 className="text-lg font-semibold text-background-100">
                    Users Table
                  </h3>
                  <p className="text-sm text-background-400">
                    Checking if users table exists and is accessible
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(tests.usersTable)}
                <span className={`font-medium ${getStatusColor(tests.usersTable)}`}>
                  {tests.usersTable === 'pending' ? 'Testing...' : 
                   tests.usersTable === 'success' ? 'Accessible' : 'Failed'}
                </span>
              </div>
            </div>

            {/* Auth Context Test */}
            <div className="flex items-center justify-between p-4 bg-background-800 rounded-xl">
              <div className="flex items-center space-x-3">
                <Key className="w-6 h-6 text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold text-background-100">
                    Authentication
                  </h3>
                  <p className="text-sm text-background-400">
                    Testing auth context and user state
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(tests.auth)}
                <span className={`font-medium ${getStatusColor(tests.auth)}`}>
                  {tests.auth === 'pending' ? 'Testing...' : 
                   tests.auth === 'success' ? 'Working' : 'No User'}
                </span>
              </div>
            </div>
          </div>

          {/* Results Details */}
          <div className="mt-8 p-4 bg-background-800 rounded-xl">
            <h3 className="text-lg font-semibold text-background-100 mb-4">
              Test Results
            </h3>
            <div className="space-y-3 text-sm">
              {Object.entries(results).map(([key, result]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-background-300 capitalize">{key}:</span>
                  <span className={result?.success ? 'text-green-500' : 'text-red-500'}>
                    {result?.success ? 'Success' : 'Failed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runTests}
              className="luxury-button primary flex-1"
            >
              Run Tests Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/auth'}
              className="luxury-button secondary flex-1"
            >
              Go to Auth Page
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TestAuth
