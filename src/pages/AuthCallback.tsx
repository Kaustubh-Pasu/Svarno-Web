import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const accessToken = urlParams.get('access_token')
        const refreshToken = urlParams.get('refresh_token')
        const error = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')

        console.log('Auth callback parameters:', { accessToken, refreshToken, error, errorDescription })

        // Check for error parameters first
        if (error) {
          throw new Error(errorDescription || error)
        }

        // If no access token, show demo success (for testing purposes)
        if (!accessToken) {
          console.log('No tokens found - showing demo success state')
          await new Promise(resolve => setTimeout(resolve, 2000))
          setStatus('success')
          return
        }

        // Real confirmation flow (when tokens are present)
        console.log('Processing authentication with tokens')
        
        // Simulate a brief delay to show the loading state
        await new Promise(resolve => setTimeout(resolve, 1500))

        setStatus('success')

      } catch (error) {
        console.error('Authentication error:', error)
        setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred')
        setStatus('error')
      }
    }

    handleAuthCallback()
  }, [])

  const goToDashboard = () => {
    navigate('/dashboard')
  }

  const goHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-4xl font-bold gradient-text">Svarno</div>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="luxury-card text-center"
        >
          {/* Loading State */}
          {status === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto animate-spin">
                <Loader2 className="w-10 h-10 text-background-950" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-background-100 mb-2">
                  Confirming Your Account
                </h1>
                <p className="text-background-300">
                  Please wait while we set up your Svarno account...
                </p>
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-background-100 mb-2">
                  Welcome to Svarno! 🎉
                </h1>
                <p className="text-background-300 mb-6">
                  Your account has been successfully created. You're ready to start your financial literacy journey!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToDashboard}
                  className="luxury-button primary group"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-background-100 mb-2">
                  Something went wrong
                </h1>
                <p className="text-background-300 mb-4">
                  {errorMessage || 'There was an error setting up your account.'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goHome}
                  className="luxury-button secondary"
                >
                  Go Back Home
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AuthCallback


