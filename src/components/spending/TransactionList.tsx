import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Edit2, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Filter,
  Search,
  Calendar,
  ChevronDown
} from 'lucide-react'
import { Transaction } from '../../types/dashboard'

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (transactionId: string) => void
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | Transaction['type']>('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'description'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'expense':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'income':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      default:
        return <DollarSign className="w-4 h-4 text-blue-500" />
    }
  }

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return 'text-green-500'
      case 'expense':
        return 'text-red-500'
      default:
        return 'text-blue-500'
    }
  }

  const formatAmount = (amount: number, type: Transaction['type']) => {
    const prefix = type === 'expense' ? '-' : '+'
    return `${prefix}$${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = filterType === 'all' || transaction.type === filterType
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'amount':
          comparison = a.amount - b.amount
          break
        case 'description':
          comparison = a.description.localeCompare(b.description)
          break
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })

  const handleDeleteClick = (transaction: Transaction) => {
    if (window.confirm(`Are you sure you want to delete "${transaction.description}"?`)) {
      onDelete(transaction.id)
    }
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netAmount = totalIncome - totalExpenses

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="luxury-card h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-background-100 mb-1">
            Transaction History
          </h3>
          <p className="text-sm text-background-400">
            {transactions.length} transactions • Net: 
            <span className={`ml-1 font-semibold ${netAmount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {netAmount >= 0 ? '+' : ''}${netAmount.toFixed(2)}
            </span>
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-background-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background-800 border border-background-700 rounded-lg text-background-100 placeholder-background-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Type Filter */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="appearance-none bg-background-800 border border-background-700 rounded-lg px-3 py-2 text-background-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 pr-8"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-background-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none bg-background-800 border border-background-700 rounded-lg px-3 py-2 text-background-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 pr-8"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="description">Sort by Description</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-background-400 pointer-events-none" />
          </div>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 bg-background-800 border border-background-700 rounded-lg text-background-100 text-sm hover:bg-background-700 transition-colors"
          >
            {sortOrder === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-background-400 mb-2">
              {transactions.length === 0 ? 'No transactions yet' : 'No transactions match your filters'}
            </div>
            <p className="text-sm text-background-500">
              {transactions.length === 0 
                ? 'Add your first transaction to get started!' 
                : 'Try adjusting your search or filters'
              }
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex items-center space-x-4 p-4 bg-background-800 rounded-xl hover:bg-background-700 transition-colors group"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-background-700 rounded-lg flex items-center justify-center">
                  {getTransactionIcon(transaction.type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-semibold text-background-100 truncate">
                    {transaction.description}
                  </h4>
                </div>
                <div className="flex items-center space-x-4 text-xs text-background-400">
                  <span>{transaction.category}</span>
                  <span>•</span>
                  {transaction.source && (
                    <>
                      <span>{transaction.source}</span>
                      <span>•</span>
                    </>
                  )}
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(transaction.date)}</span>
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="flex-shrink-0">
                <div className={`text-sm font-semibold ${getTransactionColor(transaction.type)}`}>
                  {formatAmount(transaction.amount, transaction.type)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-1">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="p-2 hover:bg-background-600 rounded-lg transition-colors"
                    title="Edit transaction"
                  >
                    <Edit2 className="w-4 h-4 text-background-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(transaction)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete transaction"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {transactions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-background-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-green-500">
                +${totalIncome.toFixed(2)}
              </div>
              <div className="text-xs text-background-400">Total Income</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-500">
                -${totalExpenses.toFixed(2)}
              </div>
              <div className="text-xs text-background-400">Total Expenses</div>
            </div>
            <div>
              <div className={`text-lg font-semibold ${netAmount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {netAmount >= 0 ? '+' : ''}${netAmount.toFixed(2)}
              </div>
              <div className="text-xs text-background-400">Net Amount</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default TransactionList
