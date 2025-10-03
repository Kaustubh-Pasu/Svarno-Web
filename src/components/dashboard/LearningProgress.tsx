import React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Trophy, Flame, BookOpen, ArrowRight } from 'lucide-react'
import { LearningProgress as LearningProgressType } from '../../types/dashboard'

interface LearningProgressProps {
  progress: LearningProgressType
}

const LearningProgress: React.FC<LearningProgressProps> = ({ progress }) => {
  const progressPercentage = (progress.experience / (progress.experience + progress.experienceToNext)) * 100

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="luxury-card h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-background-100">
          Learning Progress
        </h3>
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-semibold text-orange-500">
            {progress.streak} day streak
          </span>
        </div>
      </div>

      {/* Level and XP */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-primary-500" />
            <span className="text-lg font-semibold text-background-100">
              Level {progress.level}
            </span>
          </div>
          <span className="text-sm text-background-400">
            {progress.experience} XP
          </span>
        </div>
        
        {/* XP Progress Bar */}
        <div className="w-full bg-background-700 rounded-full h-3 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gradient-to-r from-primary-500 to-primary-400 h-3 rounded-full"
          />
        </div>
        <div className="text-xs text-background-500">
          {progress.experienceToNext} XP to next level
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-background-300 mb-3">
          Recent Achievements
        </h4>
        <div className="space-y-2">
          {progress.achievements.slice(0, 2).map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center space-x-3 p-2 bg-background-800 rounded-lg"
            >
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-background-100">
                  {achievement.name}
                </div>
                <div className="text-xs text-background-400">
                  {achievement.description}
                </div>
              </div>
              <Trophy className="w-4 h-4 text-yellow-500" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Next Lesson */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-background-300 mb-3">
          Continue Learning
        </h4>
        <div className="p-3 bg-gradient-to-r from-primary-500/10 to-primary-300/10 rounded-xl">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-primary-500" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-background-100">
                {progress.nextLesson}
              </div>
              <div className="text-xs text-background-400">
                Ready to start
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full luxury-button primary group"
      >
        Continue Learning
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  )
}

export default LearningProgress


