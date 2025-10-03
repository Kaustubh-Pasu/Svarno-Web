import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 Main.tsx: Starting application...')
console.log('🚀 Main.tsx: Root element:', document.getElementById('root'))

try {
  const root = ReactDOM.createRoot(document.getElementById('root')!)
  console.log('🚀 Main.tsx: React root created successfully')
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  console.log('🚀 Main.tsx: App rendered successfully')
} catch (error) {
  console.error('🚀 Main.tsx: Error during app initialization:', error)
}



