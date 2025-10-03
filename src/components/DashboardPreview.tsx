import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Rocket, TrendingUp, DollarSign } from 'lucide-react'

const DashboardPreview: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="dashboard" className="py-20 bg-background-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Smart <span className="gradient-text">Dashboard</span>
            </h2>
            
            <p className="text-xl text-background-300 mb-8 leading-relaxed">
              Get a comprehensive view of your financial health with AI-powered insights and real-time tracking.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="luxury-card text-center"
              >
                <div className="text-2xl font-bold text-primary-500 mb-2">$1,245</div>
                <div className="text-sm text-background-400">This Month</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="luxury-card text-center"
              >
                <div className="text-2xl font-bold text-primary-500 mb-2">$12,450</div>
                <div className="text-sm text-background-400">Portfolio Value</div>
              </motion.div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#download')}
              className="luxury-button primary group"
            >
              <Rocket className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Start Your Journey
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-gradient-to-br from-background-800 to-background-700 rounded-3xl p-8 shadow-2xl border border-background-600"
              >
                {/* Mock Dashboard Interface */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-background-950" />
                      </div>
                      <div>
                        <div className="w-20 h-3 bg-background-600 rounded mb-1"></div>
                        <div className="w-16 h-2 bg-background-700 rounded"></div>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-background-600 rounded-lg"></div>
                  </div>

                  {/* Main Chart Area */}
                  <div className="bg-gradient-to-r from-primary-500/10 to-primary-300/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-24 h-4 bg-primary-500 rounded"></div>
                      <TrendingUp className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="h-24 bg-gradient-to-r from-primary-500/20 to-primary-300/20 rounded-lg flex items-end justify-between px-2 pb-2">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-primary-500 rounded-t"
                          style={{
                            width: '8px',
                            height: `${Math.random() * 60 + 20}px`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Savings', value: '$2,340', color: 'primary-500' },
                      { label: 'Investments', value: '$8,210', color: 'primary-400' },
                      { label: 'Goals', value: '3/5', color: 'primary-300' },
                    ].map((stat, index) => (
                      <div key={index} className="bg-background-700 rounded-xl p-4">
                        <div className="text-xs text-background-400 mb-1">{stat.label}</div>
                        <div className={`text-lg font-bold text-${stat.color}`}>{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-background-300">Recent Activity</div>
                    {[
                      { action: 'Investment', amount: '+$150', type: 'positive' },
                      { action: 'Expense', amount: '-$45', type: 'negative' },
                      { action: 'Savings', amount: '+$200', type: 'positive' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'positive' ? 'bg-primary-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm text-background-300">{activity.action}</span>
                        </div>
                        <span className={`text-sm font-medium ${
                          activity.type === 'positive' ? 'text-primary-500' : 'text-red-500'
                        }`}>
                          {activity.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-6 -right-6 w-20 h-20 bg-primary-500/10 rounded-full border-2 border-primary-500/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary-300/10 rounded-full border-2 border-primary-300/20"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default DashboardPreview



