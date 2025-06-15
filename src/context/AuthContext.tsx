import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { AuthState, AuthContextType, User } from '../types'
import { SUKUT_APPS } from '../config/apps'

// Initial admin user for setup - to be replaced with real users
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@sukut.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    permissions: {
      apps: ['*'],
      features: ['all']
    },
    company: 'Sukut Construction',
    department: 'Administration',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
    status: 'active'
  }
]

// Temporary password for initial setup (should be changed immediately)
const MOCK_PASSWORD = 'admin123'

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const token = localStorage.getItem('sukut_token')
        const userData = localStorage.getItem('sukut_user')
        
        if (token && userData) {
          const user = JSON.parse(userData)
          dispatch({ type: 'LOGIN_SUCCESS', payload: user })
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Error checking existing session:', error)
        localStorage.removeItem('sukut_token')
        localStorage.removeItem('sukut_user')
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkExistingSession()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' })

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Find user by email
      const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
      
      if (!user) {
        throw new Error('Invalid email or password')
      }

      // Check password (in production, this would be done server-side)
      if (password !== MOCK_PASSWORD) {
        throw new Error('Invalid email or password')
      }

      if (user.status !== 'active') {
        throw new Error('Account is inactive. Please contact administrator.')
      }

      // Update last login
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      }

      // Generate mock JWT token
      const token = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 24 * 60 * 60 * 1000 }))

      // Store session
      localStorage.setItem('sukut_token', token)
      localStorage.setItem('sukut_user', JSON.stringify(updatedUser))

      dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      dispatch({ type: 'LOGIN_ERROR', payload: message })
      throw error
    }
  }

  const logout = (): void => {
    localStorage.removeItem('sukut_token')
    localStorage.removeItem('sukut_user')
    dispatch({ type: 'LOGOUT' })
  }

  const refreshToken = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('sukut_token')
      if (!token) {
        throw new Error('No token found')
      }

      // In production, this would validate the token with the server
      // For now, just check if it's expired
      const tokenData = JSON.parse(atob(token))
      if (tokenData.exp < Date.now()) {
        throw new Error('Token expired')
      }

      // Token is still valid, no action needed
    } catch (error) {
      logout()
      throw new Error('Session expired. Please log in again.')
    }
  }

  const hasPermission = (appId: string): boolean => {
    if (!state.user) return false
    
    const { permissions, role } = state.user

    // Admin has access to everything
    if (role === 'admin' || permissions.apps.includes('*')) {
      return true
    }

    // Check if user has permission for this specific app
    if (permissions.apps.includes(appId)) {
      return true
    }

    // Check app's required roles
    const app = SUKUT_APPS.find(a => a.id === appId)
    if (app && app.requiredRoles.includes(role)) {
      return true
    }

    return false
  }

  const hasRole = (requiredRole: string): boolean => {
    if (!state.user) return false
    
    // Admin can access everything
    if (state.user.role === 'admin') return true
    
    return state.user.role === requiredRole
  }

  const contextValue: AuthContextType = {
    state,
    login,
    logout,
    refreshToken,
    hasPermission,
    hasRole
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext