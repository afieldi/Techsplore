import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  
  const { login, register, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, name || undefined)
      }
      onClose()
      // Reset form
      setEmail('')
      setPassword('')
      setName('')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card p-8 rounded-lg shadow-xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-3 right-3 text-primary text-2xl font-semibold" onClick={onClose}>
          ×
        </button>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          
          <p className="text-tertiary mb-6">
            {mode === 'login'
              ? 'Sign in to your account to save and personalize your feed'
              : 'Join Techsplore to save items and get personalized recommendations'
            }
          </p>

          {error && (
            <div className="bg-error text-white p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="block text-left text-primary text-sm font-medium mb-1">Name (optional)</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full p-3 bg-background border border-tertiary rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-left text-primary text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full p-3 bg-background border border-tertiary rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-left text-primary text-sm font-medium mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                minLength={8}
                required
                className="w-full p-3 bg-background border border-tertiary rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {mode === 'register' && (
                <small className="block text-left text-tertiary text-xs mt-1">Password must be at least 8 characters long</small>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full p-3 bg-primary text-primary-secondary font-semibold rounded-md hover:bg-button-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-secondary text-sm">
            <span>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button 
                type="button" 
                className="text-primary hover:underline font-medium"
                onClick={switchMode}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}