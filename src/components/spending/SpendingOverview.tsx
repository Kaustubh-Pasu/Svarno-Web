import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  PiggyBank,
  AlertTriangle
} from 'lucide-react'
import { Transaction } from '../../types/dashboard'

interface SpendingOverviewProps {
  transactions: Transaction[]
}

const SpendingOverview: React.FC<SpendingOverviewProps> = ({ transactions }) => {
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)


  const netAmount = totalIncome - totalExpenses

  // Calculate monthly averages (assuming data spans multiple months)
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const currentMonthIncome = transactions
    .filter(t => {
      const date = new Date(t.date)
      return t.type === 'income' && 
             date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const currentMonthExpenses = transactions
    .filter(t => {
      const date = new Date(t.date)
      return t.type === 'expense' && 
             date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear
    })
    .reduce((sum, t) => sum + t.amount, 0)

  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  // Get top expense categories
  const expenseCategories = transactions
    .filter(t => t.type === 'expense' && t.category)
    .reduce((acc, t) => {
      acc[t.category!] = (acc[t.category!] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const topExpenseCategory = Object.entries(expenseCategories)
    .sort(([,a], [,b]) => b - a)[0]

  const getSavingsRateColor = (rate: number) => {
    if (rate >= 20) return 'text-green-500'
    if (rate >= 10) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getSavingsRateMessage = (rate: number) => {
    if (rate >= 20) return 'Excellent! You\'re saving well.'
    if (rate >= 10) return 'Good job! Consider saving more.'
    return 'Try to increase your savings rate.'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="luxury-card h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent-500/20 rounded-lg">
            <DollarSign className="w-6 h-6 text-accent-400" />
          </div>
          <h3 className="text-xl font-bold text-background-100">
            Financial Overview
          </h3>
        </div>
      </div>

      {/* Main Stats */}
      <div className="space-y-6">
        {/* Net Amount */}
        <div className="text-center">
          <div className={`text-3xl font-bold mb-1 ${netAmount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {netAmount >= 0 ? '+' : ''}${netAmount.toFixed(2)}
          </div>
          <div className="text-sm text-background-400">Net Amount</div>
        </div>

        {/* Income vs Expenses */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm font-medium text-green-400">Income</span>
            </div>
            <div className="text-xl font-bold text-green-500">
              ${totalIncome.toFixed(2)}
            </div>
          </div>
          
          <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-sm font-medium text-red-400">Expenses</span>
            </div>
            <div className="text-xl font-bold text-red-500">
              ${totalExpenses.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="text-center p-4 bg-background-800 rounded-xl">
          <div className="flex items-center justify-center mb-2">
            <PiggyBank className="w-5 h-5 text-background-400 mr-2" />
            <span className="text-sm font-medium text-background-300">Savings Rate</span>
          </div>
          <div className={`text-2xl font-bold mb-1 ${getSavingsRateColor(savingsRate)}`}>
            {savingsRate.toFixed(1)}%
          </div>
          <div className="text-xs text-background-500">
            {getSavingsRateMessage(savingsRate)}
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-background-300 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            This Month
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-background-800 rounded-lg">
              <div className="text-xs text-background-400 mb-1">Income</div>
              <div className="text-sm font-semibold text-green-500">
                ${currentMonthIncome.toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-background-800 rounded-lg">
              <div className="text-xs text-background-400 mb-1">Expenses</div>
              <div className="text-sm font-semibold text-red-500">
                ${currentMonthExpenses.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Top Expense Category */}
        {topExpenseCategory && (
          <div className="p-4 bg-background-800 rounded-xl">
            <h4 className="text-sm font-semibold text-background-300 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
              Top Expense Category
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-background-400">{topExpenseCategory[0]}</span>
              <span className="text-red-500 font-semibold">
                ${topExpenseCategory[1].toFixed(2)}
              </span>
            </div>
          </div>
        )}


        {/* Quick Insights */}
        {transactions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-background-300">Quick Insights</h4>
            <div className="space-y-2 text-xs text-background-400">
              {savingsRate < 10 && (
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span>Consider reducing expenses or increasing income</span>
                </div>
              )}
              {totalExpenses > totalIncome && (
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span>You're spending more than you earn</span>
                </div>
              )}
              {savingsRate >= 20 && (
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span>Great job maintaining a healthy savings rate!</span>
                </div>
              )}
              {transactions.length >= 10 && (
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span>Good transaction tracking habit</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default SpendingOverview
