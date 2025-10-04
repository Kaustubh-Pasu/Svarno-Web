import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Transaction } from '../types/dashboard'
import { useAuth } from './useAuth'

export const useTransactions = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch transactions from Supabase
  const fetchTransactions = async () => {
    if (!user) {
      setTransactions([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) {
        console.error('Error fetching transactions:', error)
        setError('Failed to fetch transactions')
        // Fallback to mock data if database doesn't exist yet
        setTransactions(getMockTransactions())
      } else {
        setTransactions(data || [])
      }
    } catch (err) {
      console.error('Error in fetchTransactions:', err)
      setError('Failed to fetch transactions')
      setTransactions(getMockTransactions())
    } finally {
      setLoading(false)
    }
  }

  // Add a new transaction
  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      setError(null)

      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          type: transactionData.type,
          amount: transactionData.amount,
          description: transactionData.description,
          category: transactionData.category,
          date: transactionData.date,
          source: transactionData.source
        }])
        .select()
        .single()

      if (error) {
        console.error('Error adding transaction:', error)
        throw new Error('Failed to add transaction')
      }

      // Update local state
      setTransactions(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error in addTransaction:', err)
      throw err
    }
  }

  // Update an existing transaction
  const updateTransaction = async (transactionId: string, updates: Partial<Transaction>) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      setError(null)

      const { data, error } = await supabase
        .from('transactions')
        .update({
          type: updates.type,
          amount: updates.amount,
          description: updates.description,
          category: updates.category,
          date: updates.date,
          source: updates.source
        })
        .eq('id', transactionId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating transaction:', error)
        throw new Error('Failed to update transaction')
      }

      // Update local state
      setTransactions(prev => 
        prev.map(t => t.id === transactionId ? { ...t, ...data } : t)
      )
      return data
    } catch (err) {
      console.error('Error in updateTransaction:', err)
      throw err
    }
  }

  // Delete a transaction
  const deleteTransaction = async (transactionId: string) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      setError(null)

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting transaction:', error)
        throw new Error('Failed to delete transaction')
      }

      // Update local state
      setTransactions(prev => prev.filter(t => t.id !== transactionId))
    } catch (err) {
      console.error('Error in deleteTransaction:', err)
      throw err
    }
  }

  // Calculate summary statistics
  const getSummaryStats = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)


    const netAmount = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

    return {
      totalIncome,
      totalExpenses,
      netAmount,
      savingsRate,
      transactionCount: transactions.length
    }
  }

  // Get transactions by type
  const getTransactionsByType = (type: Transaction['type']) => {
    return transactions.filter(t => t.type === type)
  }

  // Get transactions by category
  const getTransactionsByCategory = (category: string) => {
    return transactions.filter(t => t.category === category)
  }

  // Get recent transactions (last N days)
  const getRecentTransactions = (days: number = 7) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return transactions.filter(t => new Date(t.date) >= cutoffDate)
  }

  // Get monthly transactions
  const getMonthlyTransactions = (year: number, month: number) => {
    return transactions.filter(t => {
      const date = new Date(t.date)
      return date.getFullYear() === year && date.getMonth() === month
    })
  }

  // Get expense categories with totals
  const getExpenseCategories = () => {
    const categories = transactions
      .filter(t => t.type === 'expense' && t.category)
      .reduce((acc, t) => {
        acc[t.category!] = (acc[t.category!] || 0) + t.amount
        return acc
      }, {} as Record<string, number>)

    return Object.entries(categories)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
  }

  // Initialize transactions on mount
  useEffect(() => {
    fetchTransactions()
  }, [user])

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions,
    getSummaryStats,
    getTransactionsByType,
    getTransactionsByCategory,
    getRecentTransactions,
    getMonthlyTransactions,
    getExpenseCategories
  }
}

// Mock data for fallback
const getMockTransactions = (): Transaction[] => [
  {
    id: '1',
    type: 'income',
    amount: 5000,
    description: 'Monthly Salary',
    category: 'Salary',
    date: new Date().toISOString(),
    source: 'Company Payroll'
  },
  {
    id: '2',
    type: 'expense',
    amount: 250,
    description: 'Grocery Shopping',
    category: 'Food & Dining',
    date: new Date(Date.now() - 86400000).toISOString(),
    source: 'Chase Debit Card'
  },
  {
    id: '3',
    type: 'expense',
    amount: 1200,
    description: 'Rent Payment',
    category: 'Bills & Utilities',
    date: new Date(Date.now() - 172800000).toISOString(),
    source: 'Chase Checking'
  },
  {
    id: '5',
    type: 'expense',
    amount: 80,
    description: 'Netflix Subscription',
    category: 'Entertainment',
    date: new Date(Date.now() - 345600000).toISOString(),
    source: 'Chase Credit Card'
  }
]
