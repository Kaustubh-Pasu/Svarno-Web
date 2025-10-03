import React from 'react'
import { motion } from 'framer-motion'
import { Target, AlertTriangle, CheckCircle, Plus } from 'lucide-react'
import { Budget } from '../../types/dashboard'

interface BudgetProgressProps {
  budgets: Budget[]
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ budgets }) => {
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const getBudgetStatus = (budget: Budget) => {
    const usage = (budget.spent / budget.limit) * 100
    if (usage >= 100) return 'over'
    if (usage >= 80) return 'warning'
    return 'good'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      default:
        return <CheckCircle className="w-4 h-4 text-green-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over':
        return 'text-red-400'
      case 'warning':
        return 'text-yellow-400'
      default:
        return 'text-green-400'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-background-900 to-background-800 rounded-2xl p-6 border border-background-700 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Target className="w-6 h-6 text-orange-400" />
          </div>
          <h3 className="text-xl font-semibold text-background-100">Budget</h3>
        </div>
        <button className="p-2 bg-background-700 hover:bg-background-600 rounded-lg transition-colors">
          <Plus className="w-4 h-4 text-background-300" />
        </button>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-background-300">Overall Progress</span>
          <span className="text-sm font-medium text-background-100">
            {overallProgress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-background-700 rounded-full h-3">
          <motion.div 
            className={`h-3 rounded-full transition-all duration-500 ${
              overallProgress >= 100 ? 'bg-red-500' : 
              overallProgress >= 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(overallProgress, 100)}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-xs text-background-400 mt-1">
          <span>${totalSpent.toFixed(2)} spent</span>
          <span>${totalBudget.toFixed(2)} budget</span>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="space-y-4">
        {budgets.map((budget, index) => {
          const usage = (budget.spent / budget.limit) * 100
          const status = getBudgetStatus(budget)
          
          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-4 bg-background-800/30 rounded-lg border border-background-600"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: budget.color }}
                  />
                  <span className="text-sm font-medium text-background-100">
                    {budget.category}
                  </span>
                  {getStatusIcon(status)}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-background-100">
                    ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                  </div>
                  <div className={`text-xs ${getStatusColor(status)}`}>
                    {usage.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-background-700 rounded-full h-2">
                <motion.div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    status === 'over' ? 'bg-red-500' : 
                    status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(usage, 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                />
              </div>
              
              {status === 'over' && (
                <div className="mt-2 text-xs text-red-400 flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Over budget by ${(budget.spent - budget.limit).toFixed(2)}</span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-background-700">
        <div className="flex space-x-2">
          <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors">
            Set Budget
          </button>
          <button className="flex-1 bg-background-700 hover:bg-background-600 text-background-100 text-sm font-medium py-2 px-3 rounded-lg transition-colors">
            View All
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default BudgetProgress