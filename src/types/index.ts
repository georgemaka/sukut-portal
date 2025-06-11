export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'manager' | 'foreman' | 'operator'
  permissions: {
    apps: string[]
    features: string[]
  }
  company: string
  department?: string
  createdAt: string
  lastLogin?: string
  status: 'active' | 'inactive' | 'pending'
}

export interface SukutApp {
  id: string
  name: string
  description: string
  url: string
  icon: string
  color: string
  requiredRoles: string[]
  status: 'active' | 'coming-soon' | 'maintenance'
  version?: string
  lastUpdated?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  hasPermission: (appId: string) => boolean
  hasRole: (role: string) => boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface CreateUserData {
  email: string
  firstName: string
  lastName: string
  role: User['role']
  company: string
  department?: string
  permissions: User['permissions']
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: string
}

export type UserRole = User['role']
export type AppStatus = SukutApp['status']