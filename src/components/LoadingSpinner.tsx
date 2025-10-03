import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-950 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold text-background-100 mb-2">
          Loading your dashboard...
        </h2>
        <p className="text-background-400">
          Preparing your financial insights
        </p>
      </div>
    </div>
  )
}

export default LoadingSpinner


