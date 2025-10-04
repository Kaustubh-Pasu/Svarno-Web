import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, DollarSign, Calendar, Tag, FileText } from 'lucide-react'
import { Transaction } from '../../types/dashboard'

interface TransactionFormProps {
  transaction?: Transaction | null
  onSubmit: (transaction: Transaction | Omit<Transaction, 'id'>) => void
  onClose: () => void
}

const TRANSACTION_TYPES = [
  { value: 'income', label: 'Income', icon: '💰', color: 'text-green-500' },
  { value: 'expense', label: 'Expense', icon: '💸', color: 'text-red-500' },
] as const

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal Care',
  'Other'
]

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment Returns',
  'Gift',
  'Allowance',
  'Other'
]


const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
  onClose
}) => {
  const [formData, setFormData] = useState({
    type: 'expense' as Transaction['type'],
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    source: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        description: transaction.description,
        category: transaction.category || '',
        date: transaction.date.split('T')[0],
        source: transaction.source || ''
      })
    }
  }, [transaction])

  const getCategories = () => {
    switch (formData.type) {
      case 'income':
        return INCOME_CATEGORIES
      case 'expense':
        return EXPENSE_CATEGORIES
      default:
        return []
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const transactionData = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
      category: formData.category,
      date: new Date(formData.date).toISOString(),
      source: formData.source.trim() || undefined
    }

    if (transaction) {
      onSubmit({ ...transactionData, id: transaction.id })
    } else {
      onSubmit(transactionData)
    }

    // Reset form after successful submission
    setFormData({
      type: 'expense',
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      source: ''
    })
    setErrors({})
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getCurrentTypeInfo = () => {
    return TRANSACTION_TYPES.find(t => t.value === formData.type)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-background-900 rounded-2xl p-6 w-full max-w-md border border-background-700 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-background-100">
              {transaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-background-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-background-300 mb-2">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TRANSACTION_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      handleInputChange('type', type.value)
                      // Clear category when type changes
                      setFormData(prev => ({ ...prev, category: '' }))
                    }}
                    className={`p-3 rounded-lg border transition-all ${
                      formData.type === type.value
                        ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                        : 'border-background-700 hover:border-background-600 text-background-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-background-300 mb-2">
                Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-background-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-background-800 border rounded-lg text-background-100 placeholder-background-500 focus:outline-none focus:ring-2 focus:ring-accent-500 ${
                    errors.amount ? 'border-red-500' : 'border-background-700'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-background-300 mb-2">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-background-400" />
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-background-800 border rounded-lg text-background-100 placeholder-background-500 focus:outline-none focus:ring-2 focus:ring-accent-500 ${
                    errors.description ? 'border-red-500' : 'border-background-700'
                  }`}
                  placeholder="What was this transaction for?"
                />
              </div>
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-background-300 mb-2">
                Category
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-background-400" />
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-background-800 border rounded-lg text-background-100 focus:outline-none focus:ring-2 focus:ring-accent-500 ${
                    errors.category ? 'border-red-500' : 'border-background-700'
                  }`}
                >
                  <option value="">Select a category</option>
                  {getCategories().map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && (
                <p className="text-red-400 text-sm mt-1">{errors.category}</p>
              )}
            </div>


            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-background-300 mb-2">
                Source
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  className="w-full px-4 py-3 bg-background-800 border border-background-700 rounded-lg text-background-100 placeholder-background-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  placeholder="e.g., Chase Bank, Cash, Venmo, etc."
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-background-300 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-background-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background-800 border border-background-700 rounded-lg text-background-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-background-700 hover:bg-background-600 text-background-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 luxury-button primary"
              >
                {transaction ? 'Update' : 'Add'} Transaction
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TransactionForm
