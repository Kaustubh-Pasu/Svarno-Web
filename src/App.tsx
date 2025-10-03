import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import AuthCallback from './pages/AuthCallback'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import TestAuth from './pages/TestAuth'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  console.log('🎯 App.tsx: App component rendering...')
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background-950">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/test-auth" element={<TestAuth />} />
              {/* Add more routes here as we build them */}
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App

