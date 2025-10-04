import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useTransactions } from '../hooks/useTransactions'
import Navigation from '../components/Navigation'
import TransactionForm from '../components/spending/TransactionForm'
import TransactionList from '../components/spending/TransactionList'
import SpendingOverview from '../components/spending/SpendingOverview'
import BudgetProgress from '../components/dashboard/BudgetProgress'
import LoadingSpinner from '../components/LoadingSpinner'
import { Transaction, Budget } from '../types/dashboard'

const SpendingPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth()
  const { 
    transactions, 
    loading: transactionsLoading, 
    error: transactionsError,
    addTransaction: addTransactionToDB,
    updateTransaction: updateTransactionInDB,
    deleteTransaction: deleteTransactionFromDB
  } = useTransactions()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  console.log('💰 SpendingPage render:', { user, authLoading, transactions, transactionsLoading, transactionsError })

  if (authLoading || transactionsLoading) {
    console.log('💰 SpendingPage: Still loading auth or transactions')
    return <LoadingSpinner />
  }

  if (transactionsError) {
    console.error('💰 SpendingPage: Transactions error:', transactionsError)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-background-100 mb-4">
            Please sign in to access your spending tracker
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

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      await addTransactionToDB(transaction)
      setShowTransactionForm(false)
    } catch (error) {
      console.error('Failed to add transaction:', error)
      // You could add a toast notification here
    }
  }

  const handleEditTransaction = async (updatedTransaction: Transaction) => {
    try {
      await updateTransactionInDB(updatedTransaction.id, updatedTransaction)
      setEditingTransaction(null)
    } catch (error) {
      console.error('Failed to update transaction:', error)
      // You could add a toast notification here
    }
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteTransactionFromDB(transactionId)
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      // You could add a toast notification here
    }
  }

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setShowTransactionForm(true)
  }

  const handleFormClose = () => {
    setShowTransactionForm(false)
    setEditingTransaction(null)
  }

  return (
    <div className="min-h-screen bg-background-950">
      {/* Navigation */}
      <Navigation />
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-background-100 mb-2">
                Spending Tracker
              </h1>
              <p className="text-background-400">
                Track your income and expenses to build better financial habits
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTransactionForm(true)}
              className="luxury-button primary"
            >
              Add Transaction
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Overview and Budget */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <SpendingOverview transactions={transactions} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <BudgetProgress budgets={budgets} />
            </motion.div>
          </div>

          {/* Right Column - Transaction List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <TransactionList
                transactions={transactions}
                onEdit={handleEditClick}
                onDelete={handleDeleteTransaction}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}

export default SpendingPage
