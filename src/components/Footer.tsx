import React from 'react'
import { motion } from 'framer-motion'
import { Twitter, Instagram, Linkedin, Youtube, Mail, Phone } from 'lucide-react'

const Footer: React.FC = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const footerSections = [
    {
      title: 'Features',
      links: [
        { name: 'Spending Tracking', href: '#features' },
        { name: 'Investment Tools', href: '#features' },
        { name: 'Educational Content', href: '#features' },
        { name: 'Paper Trading', href: '#features' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#' },
        { name: 'Contact Us', href: '#' },
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { name: 'Twitter', href: '#', icon: Twitter },
        { name: 'Instagram', href: '#', icon: Instagram },
        { name: 'LinkedIn', href: '#', icon: Linkedin },
        { name: 'YouTube', href: '#', icon: Youtube },
      ],
    },
  ]

  return (
    <footer className="bg-background-900 border-t border-background-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h3 className="text-2xl font-bold gradient-text mb-4">Svarno</h3>
            <p className="text-background-300 mb-6 leading-relaxed">
              Empowering the next generation with comprehensive financial literacy tools and education.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Instagram, Linkedin, Youtube].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-background-800 rounded-lg flex items-center justify-center text-background-400 hover:text-primary-500 hover:bg-background-700 transition-all duration-200"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
            >
              <h4 className="text-lg font-semibold text-background-100 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <motion.a
                      onClick={() => link.href.startsWith('#') && scrollToSection(link.href)}
                      href={link.href}
                      whileHover={{ x: 5 }}
                      className="flex items-center text-background-300 hover:text-primary-500 transition-colors duration-200"
                    >
                      {'icon' in link && link.icon && <link.icon className="w-4 h-4 mr-2" />}
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-background-800"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-background-100 mb-4">
                Get in Touch
              </h4>
              <div className="space-y-2">
                <div className="flex items-center text-background-300">
                  <Mail className="w-5 h-5 mr-3 text-primary-500" />
                  <a href="mailto:hello@svarno.com" className="hover:text-primary-500 transition-colors">
                    hello@svarno.com
                  </a>
                </div>
                <div className="flex items-center text-background-300">
                  <Phone className="w-5 h-5 mr-3 text-primary-500" />
                  <a href="tel:+1-555-123-4567" className="hover:text-primary-500 transition-colors">
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-background-100 mb-4">
                Newsletter
              </h4>
              <p className="text-background-300 mb-4">
                Stay updated with the latest financial tips and features.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-background-800 border border-background-700 rounded-l-lg text-background-100 placeholder-background-400 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-primary-500 text-background-950 rounded-r-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-background-800 text-center"
        >
          <p className="text-background-400">
            &copy; 2025 Svarno. All rights reserved. Building the future of financial literacy.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer



