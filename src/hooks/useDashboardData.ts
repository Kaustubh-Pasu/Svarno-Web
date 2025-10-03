import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { 
  PortfolioSummary, 
  Transaction, 
  Budget, 
  LearningProgress, 
  MarketData, 
  AIInsight, 
  QuickStats,
  Allocation
} from '../types/dashboard'

interface DashboardData {
  portfolio: PortfolioSummary
  transactions: Transaction[]
  budgets: Budget[]
  learningProgress: LearningProgress
  marketData: MarketData
  aiInsights: AIInsight[]
  quickStats: QuickStats
}

export const useDashboardData = () => {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch critical data first (portfolio and transactions)
        const [portfolioData, transactionsData] = await Promise.all([
          fetchPortfolioData(),
          fetchTransactions()
        ])

        // Calculate quick stats with initial data
        const quickStats: QuickStats = {
          portfolioValue: portfolioData.totalValue,
          monthlySpending: calculateMonthlySpending(transactionsData),
          learningProgress: 1 // Default level, will be updated
        }

        // Set initial data to show something immediately
        setData({
          portfolio: portfolioData,
          transactions: transactionsData,
          budgets: getMockBudgets(), // Use mock data initially
          learningProgress: getMockLearningProgress(), // Use mock data initially
          marketData: getMockMarketData(), // Use mock data initially
          aiInsights: getMockAIInsights(), // Use mock data initially
          quickStats
        })

        // Fetch remaining data in background
        try {
          const [budgetsData, learningData, insightsData] = await Promise.all([
            fetchBudgets(),
            fetchLearningProgress(),
            fetchAIInsights()
          ])

          // Update with real data when available
          setData(prev => prev ? {
            ...prev,
            budgets: budgetsData,
            learningProgress: learningData,
            aiInsights: insightsData,
            quickStats: {
              ...prev.quickStats,
              learningProgress: learningData.level
            }
          } : null)
        } catch (backgroundError) {
          console.log('Some dashboard data failed to load, using mock data:', backgroundError)
        }

      } catch (err) {
        console.error('Error fetching critical dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  return { data, loading, error }
}

// Helper functions to fetch different types of data
const fetchPortfolioData = async (): Promise<PortfolioSummary> => {
  try {
    // Try to fetch from database first
    const { data: holdings, error } = await supabase
      .from('holdings')
      .select('*')
      .order('value', { ascending: false })
      .limit(5)

    if (error) {
      console.log('Holdings table not found, using mock data')
      return getMockPortfolioData()
    }

    if (holdings && holdings.length > 0) {
      const totalValue = holdings.reduce((sum, h) => sum + (h.value || 0), 0)
      const dayChange = holdings.reduce((sum, h) => sum + (h.day_change || 0), 0)
      
      return {
        totalValue,
        dayChange,
        dayChangePercent: totalValue > 0 ? (dayChange / totalValue) * 100 : 0,
        topHoldings: holdings.map(h => ({
          symbol: h.symbol || 'N/A',
          name: h.name || 'Unknown',
          shares: h.shares || 0,
          value: h.value || 0,
          change: h.day_change || 0,
          changePercent: h.value > 0 ? ((h.day_change || 0) / h.value) * 100 : 0
        })),
        allocation: generateAllocation(holdings)
      }
    }

    return getMockPortfolioData()
  } catch (error) {
    console.log('Error fetching portfolio data, using mock data:', error)
    return getMockPortfolioData()
  }
}

const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .limit(10)

    if (error) {
      console.log('Transactions table not found, using mock data')
      return getMockTransactions()
    }

    return data || getMockTransactions()
  } catch (error) {
    console.log('Error fetching transactions, using mock data:', error)
    return getMockTransactions()
  }
}

const fetchBudgets = async (): Promise<Budget[]> => {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')

    if (error) {
      console.log('Budgets table not found, using mock data')
      return getMockBudgets()
    }

    return data || getMockBudgets()
  } catch (error) {
    console.log('Error fetching budgets, using mock data:', error)
    return getMockBudgets()
  }
}

const fetchLearningProgress = async (): Promise<LearningProgress> => {
  try {
    const { data, error } = await supabase
      .from('learning_progress')
      .select('*')
      .single()

    if (error) {
      console.log('Learning progress table not found, using mock data')
      return getMockLearningProgress()
    }

    return data || getMockLearningProgress()
  } catch (error) {
    console.log('Error fetching learning progress, using mock data:', error)
    return getMockLearningProgress()
  }
}

// const fetchMarketData = async (): Promise<MarketData> => {
//   // For now, return mock market data
//   // In a real app, this would fetch from a market data API
//   return getMockMarketData()
// }

const fetchAIInsights = async (): Promise<AIInsight[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_insights')
      .select('*')
      .order('priority', { ascending: false })
      .limit(5)

    if (error) {
      console.log('AI insights table not found, using mock data')
      return getMockAIInsights()
    }

    return data || getMockAIInsights()
  } catch (error) {
    console.log('Error fetching AI insights, using mock data:', error)
    return getMockAIInsights()
  }
}

// Helper function to calculate monthly spending
const calculateMonthlySpending = (transactions: Transaction[]): number => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return transactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear &&
             (t.type === 'expense' || t.type === 'sell')
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
}

// Helper function to generate allocation data
const generateAllocation = (_holdings: any[]): Allocation[] => {
  const categories = ['Stocks', 'Bonds', 'Crypto', 'Cash']
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
  
  return categories.map((category, index) => ({
    category,
    percentage: 25, // Equal allocation for demo
    value: 10000, // Mock value
    color: colors[index]
  }))
}

// Mock data functions
const getMockPortfolioData = (): PortfolioSummary => ({
  totalValue: 125000,
  dayChange: 1250,
  dayChangePercent: 1.01,
  topHoldings: [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, value: 8750, change: 87.5, changePercent: 1.01 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 30, value: 12000, change: 120, changePercent: 1.01 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 20, value: 2800, change: 28, changePercent: 1.01 }
  ],
  allocation: [
    { category: 'Stocks', percentage: 60, value: 75000, color: '#3B82F6' },
    { category: 'Bonds', percentage: 25, value: 31250, color: '#10B981' },
    { category: 'Crypto', percentage: 10, value: 12500, color: '#F59E0B' },
    { category: 'Cash', percentage: 5, value: 6250, color: '#EF4444' }
  ]
})

const getMockTransactions = (): Transaction[] => [
  {
    id: '1',
    type: 'buy',
    amount: 1000,
    description: 'Bought AAPL shares',
    symbol: 'AAPL',
    date: new Date().toISOString()
  },
  {
    id: '2',
    type: 'expense',
    amount: 250,
    description: 'Grocery shopping',
    category: 'Food',
    date: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    type: 'income',
    amount: 5000,
    description: 'Salary',
    date: new Date(Date.now() - 172800000).toISOString()
  }
]

const getMockBudgets = (): Budget[] => [
  { id: '1', category: 'Food', limit: 500, spent: 350, color: '#3B82F6' },
  { id: '2', category: 'Entertainment', limit: 200, spent: 150, color: '#10B981' },
  { id: '3', category: 'Transportation', limit: 300, spent: 280, color: '#F59E0B' }
]

const getMockLearningProgress = (): LearningProgress => ({
  level: 5,
  experience: 750,
  experienceToNext: 250,
  achievements: [
    { id: '1', name: 'First Trade', description: 'Completed your first trade', icon: '🎯', earnedAt: new Date().toISOString(), type: 'trading' },
    { id: '2', name: 'Budget Master', description: 'Stayed within budget for a month', icon: '💰', earnedAt: new Date().toISOString(), type: 'budget' }
  ],
  streak: 7,
  nextLesson: 'Understanding Market Volatility'
})

const getMockMarketData = (): MarketData => ({
  trending: [
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 250.50, change: 5.25, changePercent: 2.14, volume: 45000000, esgScore: 85 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 450.75, change: 12.30, changePercent: 2.81, volume: 32000000, esgScore: 78 }
  ],
  topGainers: [
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: 125.40, change: 8.50, changePercent: 7.27, volume: 28000000, esgScore: 72 }
  ],
  topLosers: [
    { symbol: 'META', name: 'Meta Platforms', price: 320.25, change: -15.75, changePercent: -4.69, volume: 18000000, esgScore: 65 }
  ],
  esgSpotlight: [
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 380.90, change: 2.45, changePercent: 0.65, volume: 25000000, esgScore: 92 }
  ],
  marketStatus: 'open'
})

const getMockAIInsights = (): AIInsight[] => [
  {
    id: '1',
    type: 'recommendation',
    title: 'Diversification Opportunity',
    description: 'Consider adding international stocks to diversify your portfolio',
    actionText: 'Explore ETFs',
    priority: 'medium',
    category: 'investing'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Budget Alert',
    description: 'You\'re approaching your entertainment budget limit',
    actionText: 'Review Spending',
    priority: 'high',
    category: 'budget'
  },
  {
    id: '3',
    type: 'tip',
    title: 'Learning Tip',
    description: 'Complete the "Risk Management" module to unlock advanced trading features',
    actionText: 'Start Learning',
    priority: 'low',
    category: 'learning'
  }
]
