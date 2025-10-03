import React from 'react'
import { motion } from 'framer-motion'
import { Brain, AlertCircle, Lightbulb, Trophy, ArrowRight, ExternalLink } from 'lucide-react'
import { AIInsight } from '../../types/dashboard'

interface AIInsightsProps {
  insights: AIInsight[]
}

const AIInsights: React.FC<AIInsightsProps> = ({ insights }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-blue-400" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'achievement':
        return <Trophy className="w-5 h-5 text-yellow-400" />
      case 'tip':
        return <Brain className="w-5 h-5 text-purple-400" />
      default:
        return <Brain className="w-5 h-5 text-blue-400" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'recommendation':
        return 'border-blue-500/20 bg-blue-500/10'
      case 'warning':
        return 'border-red-500/20 bg-red-500/10'
      case 'achievement':
        return 'border-yellow-500/20 bg-yellow-500/10'
      case 'tip':
        return 'border-purple-500/20 bg-purple-500/10'
      default:
        return 'border-blue-500/20 bg-blue-500/10'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400'
      case 'medium':
        return 'text-yellow-400'
      case 'low':
        return 'text-green-400'
      default:
        return 'text-blue-400'
    }
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
          <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-background-100">AI Insights</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-background-400">Live</span>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getInsightIcon(insight.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-background-100">
                    {insight.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                      {insight.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-background-400 bg-background-700 px-2 py-1 rounded">
                      {insight.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-background-300 mb-3">
                  {insight.description}
                </p>
                
                {insight.actionText && (
                  <button className="inline-flex items-center space-x-1 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
                    <span>{insight.actionText}</span>
                    {insight.actionUrl ? (
                      <ExternalLink className="w-3 h-3" />
                    ) : (
                      <ArrowRight className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {insights.length === 0 && (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-background-600 mx-auto mb-4" />
          <p className="text-background-400 text-sm">No insights available</p>
          <p className="text-background-500 text-xs mt-1">
            AI will generate personalized insights as you use the app
          </p>
        </div>
      )}

      {/* View All Button */}
      <div className="mt-6 pt-4 border-t border-background-700">
        <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all">
          View All Insights
        </button>
      </div>
    </motion.div>
  )
}

export default AIInsights