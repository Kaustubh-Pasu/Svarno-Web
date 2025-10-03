import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Apple, Smartphone } from 'lucide-react'

const CallToAction: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="download" className="py-20 bg-gradient-to-br from-primary-500 to-primary-600 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-background-950 mb-6">
            Ready to Build Your Financial Future?
          </h2>
          
          <p className="text-xl text-background-900 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of young investors who are already learning, saving, and growing their wealth with Svarno.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="luxury-button bg-background-950 text-primary-500 hover:bg-background-900 group"
            >
              <Apple className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-xs opacity-75">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="luxury-button bg-background-950 text-primary-500 hover:bg-background-900 group"
            >
              <Smartphone className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-xs opacity-75">Get it on</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default CallToAction



