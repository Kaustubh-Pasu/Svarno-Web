import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Check } from 'lucide-react'

const Pricing: React.FC = () => {
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

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        'Basic spending tracking',
        'Simple budget tools',
        'Limited educational content',
        'Basic portfolio tracking',
      ],
      buttonText: 'Get Started',
      buttonStyle: 'secondary' as const,
      popular: false,
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: '/month',
      features: [
        'Advanced analytics & insights',
        'Unlimited paper trading',
        'Premium educational courses',
        'AI-powered recommendations',
        'Parental controls & oversight',
        'Priority customer support',
      ],
      buttonText: 'Start Premium',
      buttonStyle: 'primary' as const,
      popular: true,
    },
    {
      name: 'Family',
      price: '$19.99',
      period: '/month',
      features: [
        'Up to 5 family members',
        'Family financial planning',
        'Shared educational progress',
        'Advanced parental controls',
        'Family challenges & goals',
        'Dedicated family support',
      ],
      buttonText: 'Family Plan',
      buttonStyle: 'secondary' as const,
      popular: false,
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

  return (
    <section id="pricing" className="py-20 bg-background-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Choose Your <span className="gradient-text">Plan</span>
          </h2>
          <p className="text-xl text-background-300 max-w-3xl mx-auto">
            Start free and upgrade when you're ready for premium features
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: plan.popular ? 1.05 : 1.02,
                transition: { duration: 0.2 }
              }}
              className={`luxury-card text-center relative ${
                plan.popular 
                  ? 'border-2 border-primary-500 shadow-2xl shadow-primary-500/20' 
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-background-950 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-background-100 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-primary-500">
                    {plan.price}
                  </span>
                  <span className="text-background-400 ml-1">
                    {plan.period}
                  </span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-left">
                    <Check className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
                    <span className="text-background-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('#download')}
                className={`luxury-button ${plan.buttonStyle} w-full`}
              >
                {plan.buttonText}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing



