export interface PortfolioSummary {
  totalValue: number
  dayChange: number
  dayChangePercent: number
  topHoldings: Holding[]
  allocation: Allocation[]
}

export interface Holding {
  symbol: string
  name: string
  shares: number
  value: number
  change: number
  changePercent: number
}

export interface Allocation {
  category: string
  percentage: number
  value: number
  color: string
}

export interface Transaction {
  id: string
  type: 'buy' | 'sell' | 'expense' | 'income'
  amount: number
  description: string
  category?: string
  date: string
  symbol?: string
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  color: string
}

export interface LearningProgress {
  level: number
  experience: number
  experienceToNext: number
  achievements: Achievement[]
  streak: number
  nextLesson: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
  type: 'learning' | 'trading' | 'budget' | 'milestone'
}

export interface MarketData {
  trending: Stock[]
  topGainers: Stock[]
  topLosers: Stock[]
  esgSpotlight: Stock[]
  marketStatus: 'open' | 'closed'
}

export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  esgScore?: number
}

export interface AIInsight {
  id: string
  type: 'recommendation' | 'warning' | 'achievement' | 'tip'
  title: string
  description: string
  actionText?: string
  actionUrl?: string
  priority: 'high' | 'medium' | 'low'
  category: 'spending' | 'investing' | 'learning' | 'budget'
}

export interface DashboardState {
  user: any
  portfolio: PortfolioSummary
  transactions: Transaction[]
  budgets: Budget[]
  learningProgress: LearningProgress
  marketData: MarketData
  aiInsights: AIInsight[]
  quickStats: QuickStats
  loading: boolean
  error: string | null
}

export interface QuickStats {
  portfolioValue: number
  monthlySpending: number
  learningProgress: number
}
