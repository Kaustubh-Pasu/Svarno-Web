import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, PieChart, DollarSign } from 'lucide-react'
import { PortfolioSummary } from '../../types/dashboard'

interface PortfolioOverviewProps {
  portfolio: PortfolioSummary
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ portfolio }) => {
  const isPositive = portfolio.dayChange >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-background-900 to-background-800 rounded-2xl p-6 border border-background-700 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-500/20 rounded-lg">
            <PieChart className="w-6 h-6 text-primary-400" />
          </div>
          <h3 className="text-xl font-semibold text-background-100">Portfolio</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-background-100">
            ${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className={`flex items-center space-x-1 text-sm ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              {isPositive ? '+' : ''}${portfolio.dayChange.toFixed(2)} ({portfolio.dayChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Top Holdings */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-background-300 mb-3">Top Holdings</h4>
        <div className="space-y-2">
          {portfolio.topHoldings.slice(0, 3).map((holding) => (
            <div key={holding.symbol} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-background-700 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-background-200">
                    {holding.symbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-background-100">
                    {holding.symbol}
                  </div>
                  <div className="text-xs text-background-400">
                    {holding.shares} shares
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-background-100">
                  ${holding.value.toFixed(2)}
                </div>
                <div className={`text-xs ${
                  holding.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {holding.change >= 0 ? '+' : ''}${holding.change.toFixed(2)} ({holding.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allocation Chart */}
      <div>
        <h4 className="text-sm font-medium text-background-300 mb-3">Allocation</h4>
        <div className="space-y-2">
          {portfolio.allocation.map((item) => (
            <div key={item.category} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-background-200">{item.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-background-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.color 
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-background-100 w-12 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-background-700">
        <div className="flex space-x-2">
          <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Add Funds
          </button>
          <button className="flex-1 bg-background-700 hover:bg-background-600 text-background-100 text-sm font-medium py-2 px-3 rounded-lg transition-colors">
            View All
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default PortfolioOverview
