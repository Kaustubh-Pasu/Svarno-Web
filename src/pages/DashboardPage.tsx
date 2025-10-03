import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useDashboardData } from '../hooks/useDashboardData'
import Navigation from '../components/Navigation'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import PortfolioOverview from '../components/dashboard/PortfolioOverview'
import SpendingSummary from '../components/dashboard/SpendingSummary'
import LearningProgress from '../components/dashboard/LearningProgress'
import RecentActivity from '../components/dashboard/RecentActivity'
import BudgetProgress from '../components/dashboard/BudgetProgress'
import AIInsights from '../components/dashboard/AIInsights'
import MarketWatch from '../components/dashboard/MarketWatch'
import LoadingSpinner from '../components/LoadingSpinner'

const DashboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth()
  const { data, loading, error } = useDashboardData()

  console.log('📊 DashboardPage render:', { user, authLoading, loading, data, error })

  if (authLoading || loading) {
    console.log('📊 DashboardPage: Still loading - authLoading:', authLoading, 'dataLoading:', loading)
    return <LoadingSpinner />
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-background-100 mb-4">
            Please sign in to access your dashboard
          </h1>
          <button
            onClick={() => window.location.href = '/'}
            className="luxury-button primary"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error loading dashboard
          </h1>
          <p className="text-background-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="luxury-button primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-background-100 mb-4">
            Loading dashboard data...
          </h1>
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-950">
      {/* Navigation */}
      <Navigation />
      
      {/* Dashboard Header */}
      <DashboardHeader user={user} quickStats={data.quickStats} />

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        {/* Top Row - Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <PortfolioOverview portfolio={data.portfolio} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SpendingSummary 
              transactions={data.transactions} 
              budgets={data.budgets}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <LearningProgress progress={data.learningProgress} />
          </motion.div>
        </div>

        {/* Middle Row - Activity and Budget */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <RecentActivity transactions={data.transactions} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <BudgetProgress budgets={data.budgets} />
          </motion.div>
        </div>

        {/* Bottom Row - AI Insights and Market Watch */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <AIInsights insights={data.aiInsights} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <MarketWatch marketData={data.marketData} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
