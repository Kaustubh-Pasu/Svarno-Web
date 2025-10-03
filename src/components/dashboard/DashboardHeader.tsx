import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import { QuickStats } from '../../types/dashboard'
import { User } from '../../lib/supabase'

interface DashboardHeaderProps {
  user: User
  quickStats: QuickStats
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, quickStats }) => {
  const currentTime = new Date()
  const greeting = currentTime.getHours() < 12 ? 'Good morning' : 
                   currentTime.getHours() < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-background-900 to-background-800 border-b border-background-700"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl lg:text-4xl font-bold text-background-100 mb-2"
            >
              {greeting}, {user.name}! 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-background-300 text-lg"
            >
              Here's your financial overview for today
            </motion.p>
          </div>
          
          {/* Date Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 lg:mt-0 flex items-center space-x-2 text-background-300"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-lg">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </motion.div>
        </div>

        {/* Quick Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Portfolio Value */}
          <div className="bg-gradient-to-br from-primary-500/10 to-primary-600/10 border border-primary-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-primary-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-background-100">
                  ${quickStats.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-primary-400 font-medium">Portfolio Value</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-background-300">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>Growing steadily</span>
            </div>
          </div>

          {/* Monthly Spending */}
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-background-100">
                  ${quickStats.monthlySpending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-red-400 font-medium">This Month</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-background-300">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span>Track your expenses</span>
            </div>
          </div>

          {/* Learning Progress */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-background-100">
                  Level {quickStats.learningProgress}
                </div>
                <div className="text-sm text-green-400 font-medium">Learning Level</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-background-300">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>Keep learning!</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default DashboardHeader