import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Wallet, 
  TrendingUp, 
  Gamepad2, 
  GraduationCap, 
  PiggyBank, 
  Users 
} from 'lucide-react'

const Features: React.FC = () => {
  const features = [
    {
      icon: Wallet,
      title: 'Spending Tracking',
      description: 'Manually log and categorize expenses with detailed views by day, month, and year. Gain insights into your spending patterns.',
    },
    {
      icon: TrendingUp,
      title: 'Investment Tracking',
      description: 'Monitor real investment portfolios with live stock prices. Track performance and learn from your investment decisions.',
    },
    {
      icon: Gamepad2,
      title: 'Paper Trading',
      description: 'Practice investing with virtual money in a safe, controlled environment. Learn trading strategies without financial risk.',
    },
    {
      icon: GraduationCap,
      title: 'Educational Hub',
      description: 'Access structured courses, video lessons, and articles on financial topics. Earn certificates upon completion.',
    },
    {
      icon: PiggyBank,
      title: 'Budget Management',
      description: 'Create and monitor budgets for different spending categories. Stay on track with your financial goals.',
    },
    {
      icon: Users,
      title: 'Parental Integration',
      description: 'Link accounts with parents for fund transfers and oversight. Safe, controlled environment for family financial education.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="features" className="py-20 bg-background-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Comprehensive <span className="gradient-text">Financial Tools</span>
          </h2>
          <p className="text-xl text-background-300 max-w-3xl mx-auto">
            Everything young investors need to build a strong financial foundation
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="luxury-card text-center group"
            >
              <motion.div
                whileHover={{ rotate: 5 }}
                className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-primary-500/25 transition-all duration-300"
              >
                <feature.icon className="w-10 h-10 text-background-950" />
              </motion.div>
              
              <h3 className="text-xl font-semibold text-background-100 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-background-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Features



