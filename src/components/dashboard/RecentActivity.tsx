import React from 'react'
import { motion } from 'framer-motion'
import { Activity, TrendingUp, TrendingDown, DollarSign, BookOpen, Trophy } from 'lucide-react'
import { Transaction } from '../../types/dashboard'

interface RecentActivityProps {
  transactions: Transaction[]
}

const RecentActivity: React.FC<RecentActivityProps> = ({ transactions }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'sell':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'expense':
        return <DollarSign className="w-4 h-4 text-red-500" />
      case 'income':
        return <DollarSign className="w-4 h-4 text-green-500" />
      default:
        return <Activity className="w-4 h-4 text-blue-500" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'buy':
      case 'income':
        return 'text-green-500'
      case 'sell':
      case 'expense':
        return 'text-red-500'
      default:
        return 'text-blue-500'
    }
  }

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === 'expense' ? '-' : '+'
    return `${prefix}$${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  // Mock some additional activities for demonstration
  const mockActivities = [
    {
      id: 'achievement-1',
      type: 'achievement',
      description: 'Completed "Budgeting Basics" lesson',
      amount: null,
      date: new Date(Date.now() - 3600000).toISOString(),
      icon: <Trophy className="w-4 h-4 text-yellow-500" />
    },
    {
      id: 'learning-1',
      type: 'learning',
      description: 'Started "ESG Investing" course',
      amount: null,
      date: new Date(Date.now() - 7200000).toISOString(),
      icon: <BookOpen className="w-4 h-4 text-purple-500" />
    }
  ]

  const allActivities = [...transactions, ...mockActivities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="luxury-card h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-background-100">
          Recent Activity
        </h3>
        <button className="p-2 rounded-xl bg-background-700 hover:bg-background-600 transition-colors">
          <Activity className="w-4 h-4 text-background-300" />
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {allActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex items-center space-x-4 p-3 bg-background-800 rounded-xl hover:bg-background-700 transition-colors"
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              {activity.type === 'achievement' || activity.type === 'learning' ? 
                activity.icon : 
                getActivityIcon(activity.type)
              }
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-background-100 truncate">
                {activity.description}
              </div>
              <div className="text-xs text-background-400">
                {formatDate(activity.date)}
              </div>
            </div>

            {/* Amount */}
            {activity.amount !== null && (
              <div className={`text-sm font-semibold ${getActivityColor(activity.type)}`}>
                {formatAmount(activity.amount, activity.type)}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 luxury-button secondary"
      >
        View All Activity
      </motion.button>
    </motion.div>
  )
}

export default RecentActivity


