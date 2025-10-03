import React from 'react'
import { motion } from 'framer-motion'
import { CreditCard, TrendingDown, AlertCircle, Plus } from 'lucide-react'
import { Transaction, Budget } from '../../types/dashboard'

interface SpendingSummaryProps {
  transactions: Transaction[]
  budgets: Budget[]
}

const SpendingSummary: React.FC<SpendingSummaryProps> = ({ transactions, budgets }) => {
  // Calculate spending from transactions
  const recentSpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  // Calculate budget usage
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const budgetUsage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-background-900 to-background-800 rounded-2xl p-6 border border-background-700 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <CreditCard className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-background-100">Spending</h3>
        </div>
        <button className="p-2 bg-background-700 hover:bg-background-600 rounded-lg transition-colors">
          <Plus className="w-4 h-4 text-background-300" />
        </button>
      </div>

      {/* Spending Overview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-background-300">This Month</span>
          <span className="text-2xl font-bold text-background-100">
            ${recentSpending.toFixed(2)}
          </span>
        </div>
        <div className="w-full bg-background-700 rounded-full h-2">
          <div 
            className="bg-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(budgetUsage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-background-400 mt-1">
          <span>Budget Usage: {budgetUsage.toFixed(1)}%</span>
          <span>${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}</span>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-background-300 mb-3">Categories</h4>
        <div className="space-y-2">
          {budgets.slice(0, 3).map((budget) => {
            const usage = (budget.spent / budget.limit) * 100
            const isOverBudget = budget.spent > budget.limit
            
            return (
              <div key={budget.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: budget.color }}
                  />
                  <span className="text-sm text-background-200">{budget.category}</span>
                  {isOverBudget && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-background-700 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isOverBudget ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(usage, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-background-400 w-12 text-right">
                    {usage.toFixed(0)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-background-300 mb-3">Recent</h4>
        <div className="space-y-2">
          {transactions
            .filter(t => t.type === 'expense')
            .slice(0, 2)
            .map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-background-700 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-background-100">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-background-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-red-400">
                  -${transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-background-700">
        <div className="flex space-x-2">
          <button className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors">
            Add Expense
          </button>
          <button className="flex-1 bg-background-700 hover:bg-background-600 text-background-100 text-sm font-medium py-2 px-3 rounded-lg transition-colors">
            View All
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default SpendingSummary