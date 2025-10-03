import React from 'react'
import { motion } from 'framer-motion'
import { Download, Play } from 'lucide-react'

const Hero: React.FC = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background-950 via-background-900 to-background-800">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              The Future of{' '}
              <span className="gradient-text">Financial Literacy</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-background-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Empower the next generation with comprehensive financial tools. Track spending, 
              learn investing, and build wealth with confidence through our all-in-one platform 
              designed for children and teenagers.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('#download')}
                className="luxury-button primary group"
              >
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Download App
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('#features')}
                className="luxury-button secondary group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative z-10">
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-gradient-to-br from-background-800 to-background-700 rounded-3xl p-8 shadow-2xl border border-background-600"
              >
                <div className="space-y-6">
                  {/* Mock Dashboard Elements */}
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 bg-primary-500 rounded-lg"></div>
                    <div className="w-16 h-4 bg-background-600 rounded"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="w-full h-32 bg-gradient-to-r from-primary-500/20 to-primary-300/20 rounded-2xl p-4">
                      <div className="w-12 h-4 bg-primary-500 rounded mb-2"></div>
                      <div className="w-24 h-6 bg-primary-400 rounded"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background-700 rounded-xl p-4">
                        <div className="w-8 h-2 bg-background-600 rounded mb-2"></div>
                        <div className="w-12 h-4 bg-primary-500 rounded"></div>
                      </div>
                      <div className="bg-background-700 rounded-xl p-4">
                        <div className="w-8 h-2 bg-background-600 rounded mb-2"></div>
                        <div className="w-12 h-4 bg-primary-400 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-primary-500/20 rounded-full border-2 border-primary-500/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary-300/20 rounded-full border-2 border-primary-300/30"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero



