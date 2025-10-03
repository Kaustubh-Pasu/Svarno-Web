import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Menu, 
  X, 
  Home, 
  TrendingUp, 
  Wallet, 
  GraduationCap, 
  User,
  LogOut
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()

  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          
          // Show/hide navigation based on scroll direction
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down and past 100px - hide navigation
            setIsHidden(true)
          } else {
            // Scrolling up or at top - show navigation
            setIsHidden(false)
          }
          
          // Update background based on scroll position
          setIsScrolled(currentScrollY > 50)
          setLastScrollY(currentScrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: Home,
      description: 'Overview of your finances'
    },
    { 
      name: 'Investments', 
      path: '/investments', 
      icon: TrendingUp,
      description: 'Paper trading & portfolio'
    },
    { 
      name: 'Spending', 
      path: '/spending', 
      icon: Wallet,
      description: 'Track expenses & budgets'
    },
    { 
      name: 'Learn', 
      path: '/learn', 
      icon: GraduationCap,
      description: 'Financial education'
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: User,
      description: 'Account & settings'
    },
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: isHidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'glass border-b border-background-700/50' 
            : 'bg-background-950/95 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/')}
              className="text-2xl font-bold gradient-text cursor-pointer"
            >
              Svarno
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 group ${
                    isActive(item.path)
                      ? 'bg-primary-500/20 text-primary-500'
                      : 'text-background-300 hover:text-primary-500 hover:bg-background-800/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-background-800 border border-background-700 rounded-lg text-xs text-background-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.description}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-background-800 border-l border-t border-background-700 rotate-45"></div>
                  </div>
                </motion.button>
              ))}
            </nav>

            {/* User Menu / Auth Buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  {/* User Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-background-950 font-semibold text-sm cursor-pointer"
                    onClick={() => handleNavigation('/profile')}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </motion.div>
                  
                  {/* User Name */}
                  <span className="hidden lg:block text-background-300 font-medium">
                    {user.name}
                  </span>
                  
                  {/* Sign Out Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSignOut}
                    className="hidden md:flex items-center space-x-2 px-3 py-2 text-background-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </motion.button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/auth?mode=login')}
                    className="text-background-300 hover:text-primary-500 transition-colors font-medium"
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/auth?mode=signup')}
                    className="luxury-button primary text-sm px-4 py-2"
                  >
                    Get Started
                  </motion.button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-background-300 hover:text-primary-500 transition-colors p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-16 left-0 right-0 z-40 glass border-t border-background-700/50"
          >
            <div className="px-6 py-4 space-y-2">
              {/* Navigation Items */}
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                    isActive(item.path)
                      ? 'bg-primary-500/20 text-primary-500'
                      : 'text-background-300 hover:text-primary-500 hover:bg-background-800/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </motion.button>
              ))}

              {/* User Section */}
              {user ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="border-t border-background-700/50 pt-4 mt-4"
                >
                  <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-background-950 font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-background-100">{user.name}</div>
                      <div className="text-sm text-background-400">{user.email}</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="border-t border-background-700/50 pt-4 mt-4 space-y-2"
                >
                  <button
                    onClick={() => {
                      navigate('/auth?mode=login')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-background-300 hover:text-primary-500 hover:bg-background-800/50 rounded-xl transition-all duration-200"
                  >
                    <span className="font-medium">Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/auth?mode=signup')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full luxury-button primary"
                  >
                    Get Started
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation

