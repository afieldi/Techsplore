import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { trpc } from '../lib/trpc'

interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loginMutation = trpc.login.useMutation()
  const registerMutation = trpc.register.useMutation()

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      setToken(savedToken)
    }
    setIsLoading(false)
  }, [])

  // Get user data when token changes
  const { data: userData } = trpc.me.useQuery(undefined, {
    enabled: !!token,
    retry: false,
    onError: () => {
      // Token is invalid, clear it
      logout()
    },
  })

  useEffect(() => {
    if (userData) {
      setUser(userData)
    }
  }, [userData])

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password })
      setUser(result.user)
      setToken(result.token)
      localStorage.setItem('auth_token', result.token)
    } catch (error) {
      throw error
    }
  }

  const register = async (email: string, password: string, name?: string) => {
    try {
      const result = await registerMutation.mutateAsync({ email, password, name })
      setUser(result.user)
      setToken(result.token)
      localStorage.setItem('auth_token', result.token)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}