import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  TrendingUp, 
  Wallet, 
  GraduationCap, 
  Shield, 
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Users
} from 'lucide-react'
import Navigation from '../components/Navigation'
import { useAuth } from '../hooks/useAuth'

const HomePage: React.FC = () => {
  const { user, loading } = useAuth()
  
  // Move useInView hook to the top level - before any conditional returns
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  console.log('🏠 HomePage: Rendering with user:', user, 'loading:', loading)
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-500 mb-4">Loading...</div>
          <div className="text-background-300">Please wait while we load your data</div>
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: TrendingUp,
      title: 'Paper Trading',
      description: 'Practice investing with virtual money in a safe, controlled environment',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Wallet,
      title: 'Budget Management',
      description: 'Track spending, set budgets, and build healthy financial habits',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: GraduationCap,
      title: 'Financial Education',
      description: 'Learn through structured courses and interactive lessons',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Shield,
      title: 'ESG Investing',
      description: 'Focus on environmental, social, and governance responsible investing',
      color: 'from-orange-500 to-amber-600'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Virtual Starting Balance' },
    { number: '13-18', label: 'Age Range' },
    { number: '100%', label: 'Risk-Free Learning' },
    { number: 'ESG', label: 'Focused Investing' }
  ]

  return (
    <div className="min-h-screen bg-background-950">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background-950 via-background-900 to-background-800">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary-400/5 rounded-full blur-3xl animate-float" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 pt-32">
          <div className="text-center">
            {/* Logo and Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span className="text-primary-500 text-sm font-medium">The Future of Financial Literacy</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Welcome to{' '}
                <span className="gradient-text">Svarno</span>
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-background-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              The comprehensive financial literacy platform designed for teenagers. 
              Learn investing, manage budgets, and build wealth through interactive 
              education and risk-free paper trading.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-background-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              {!user ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/auth'}
                    className="luxury-button primary group text-lg px-8 py-4"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/auth'}
                    className="luxury-button secondary text-lg px-8 py-4"
                  >
                    Sign In
                  </motion.button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-semibold text-primary-500 mb-4">
                    Welcome back, {user.name}! 👋
                  </div>
                  <p className="text-background-300 mb-6">
                    Ready to continue your financial learning journey?
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/dashboard'}
                    className="luxury-button primary group text-lg px-8 py-4"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="flex flex-col items-center space-y-2 text-background-400">
                <span className="text-sm">Scroll to learn more</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-6 h-10 border-2 border-background-400 rounded-full flex justify-center"
                >
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1 h-3 bg-background-400 rounded-full mt-2"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Everything You Need to{' '}
              <span className="gradient-text">Master Finance</span>
            </h2>
            <p className="text-xl text-background-300 max-w-3xl mx-auto">
              Our comprehensive platform combines education, practice, and real-world application 
              to build your financial confidence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="luxury-card text-center group"
              >
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-semibold text-background-100 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-background-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Svarno Section */}
      <section className="py-20 bg-background-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Why Choose{' '}
                <span className="gradient-text">Svarno?</span>
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-background-100 mb-2">
                      Education-First Approach
                    </h3>
                    <p className="text-background-300">
                      Every feature is designed to teach you something new about finance, 
                      from basic budgeting to advanced investment strategies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-background-100 mb-2">
                      Risk-Free Learning
                    </h3>
                    <p className="text-background-300">
                      Practice investing with virtual money, make mistakes, and learn 
                      without any financial risk to your real money.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-background-100 mb-2">
                      Built for Teenagers
                    </h3>
                    <p className="text-background-300">
                      Our interface and content are specifically designed for ages 13-18, 
                      making complex financial concepts accessible and engaging.
                    </p>
                  </div>
                </div>
              </div>

              {!user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-8"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/auth'}
                    className="luxury-button primary group"
                  >
                    Start Learning Today
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="bg-gradient-to-br from-background-800 to-background-700 rounded-3xl p-8 shadow-2xl border border-background-600"
                >
                  {/* Mock App Interface */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                          <Star className="w-6 h-6 text-background-950" />
                        </div>
                        <div>
                          <div className="w-20 h-3 bg-background-600 rounded mb-1"></div>
                          <div className="w-16 h-2 bg-background-700 rounded"></div>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-background-600 rounded-lg"></div>
                    </div>

                    {/* Portfolio Value */}
                    <div className="bg-gradient-to-r from-primary-500/10 to-primary-300/10 rounded-2xl p-6">
                      <div className="text-sm text-background-400 mb-2">Portfolio Value</div>
                      <div className="text-3xl font-bold text-primary-500 mb-2">$12,450</div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-500 text-sm">+$1,245 (11.2%)</span>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-background-300">Recent Activity</div>
                      {[
                        { action: 'Bought AAPL', amount: '+5 shares', type: 'positive' },
                        { action: 'Budget Alert', amount: 'Food category', type: 'warning' },
                        { action: 'Lesson Complete', amount: 'ESG Basics', type: 'success' },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.type === 'positive' ? 'bg-green-500' : 
                              activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}></div>
                            <span className="text-sm text-background-300">{activity.action}</span>
                          </div>
                          <span className="text-sm font-medium text-background-400">
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

    </div>
  )
}

export default HomePage

