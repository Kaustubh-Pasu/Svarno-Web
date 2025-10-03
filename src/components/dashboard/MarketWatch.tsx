import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, BarChart3, ExternalLink, Star } from 'lucide-react'
import { MarketData } from '../../types/dashboard'

interface MarketWatchProps {
  marketData: MarketData
}

const MarketWatch: React.FC<MarketWatchProps> = ({ marketData }) => {
  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-400" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-400" />
    )
  }


  const getESGColor = (score?: number) => {
    if (!score) return 'text-background-400'
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
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
          <div className="p-2 bg-green-500/20 rounded-lg">
            <BarChart3 className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-background-100">Market Watch</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            marketData.marketStatus === 'open' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
          }`} />
          <span className="text-xs text-background-400">
            {marketData.marketStatus === 'open' ? 'Market Open' : 'Market Closed'}
          </span>
        </div>
      </div>

      {/* Trending Stocks */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-background-300 mb-3">Trending</h4>
        <div className="space-y-2">
          {marketData.trending.slice(0, 3).map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-background-800/30 rounded-lg hover:bg-background-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-background-700 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-background-200">
                    {stock.symbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-background-100">
                    {stock.symbol}
                  </div>
                  <div className="text-xs text-background-400 truncate max-w-24">
                    {stock.name}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-background-100">
                  ${stock.price.toFixed(2)}
                </div>
                <div className="flex items-center space-x-1">
                  {getChangeIcon(stock.change)}
                  <span className={`text-xs ${getChangeColor(stock.change)}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
                {stock.esgScore && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className={`text-xs ${getESGColor(stock.esgScore)}`}>
                      ESG: {stock.esgScore}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Gainers & Losers */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="text-sm font-medium text-background-300 mb-2">Top Gainers</h4>
          <div className="space-y-1">
            {marketData.topGainers.slice(0, 2).map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between text-xs">
                <span className="text-background-200 truncate">{stock.symbol}</span>
                <span className="text-green-400 font-medium">
                  +{stock.changePercent.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-background-300 mb-2">Top Losers</h4>
          <div className="space-y-1">
            {marketData.topLosers.slice(0, 2).map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between text-xs">
                <span className="text-background-200 truncate">{stock.symbol}</span>
                <span className="text-red-400 font-medium">
                  {stock.changePercent.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ESG Spotlight */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-background-300 mb-3">ESG Spotlight</h4>
        <div className="space-y-2">
          {marketData.esgSpotlight.slice(0, 2).map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between p-2 bg-background-800/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-background-200">{stock.symbol}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-background-100">
                  ${stock.price.toFixed(2)}
                </div>
                <div className="text-xs text-green-400">
                  ESG: {stock.esgScore}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-background-700">
        <div className="flex space-x-2">
          <button className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors">
            View Markets
          </button>
          <button className="flex-1 bg-background-700 hover:bg-background-600 text-background-100 text-sm font-medium py-2 px-3 rounded-lg transition-colors">
            <ExternalLink className="w-4 h-4 inline mr-1" />
            External
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default MarketWatch