export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'user'
  permissions: {
    apps: string[]
    features: string[]
    groups?: string[]
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

export interface PermissionGroup {
  id: string
  name: string
  description: string
  apps: string[]
  icon: string
  color: string
}

export interface BulkOperation {
  type: 'grant_access' | 'revoke_access' | 'update_status' | 'update_role'
  userIds: string[]
  payload: {
    apps?: string[]
    groups?: string[]
    status?: User['status']
    role?: User['role']
  }
}

export interface AuditLogEntry {
  id: string
  userId: string
  performedBy: string
  action: string
  details: Record<string, any>
  timestamp: string
}

export interface ChatMessage {
  id: string
  userId: string
  userName: string
  userRole: UserRole
  content: string
  type: 'announcement' | 'comment' | 'question' | 'feedback'
  tags?: string[]
  appId?: string
  parentId?: string
  timestamp: string
  isRead?: boolean
  isPinned?: boolean
  reactions?: MessageReaction[]
}

export interface MessageReaction {
  emoji: string
  userId: string
  userName: string
}

export interface Announcement {
  id: string
  content: string
  priority: 'low' | 'medium' | 'high'
  createdBy: string
  createdAt: string
  expiresAt?: string
  dismissedBy: string[]
}

export interface ChatState {
  messages: ChatMessage[]
  announcements: Announcement[]
  unreadCount: number
  isActivityFeedOpen: boolean
  isChatModalOpen: boolean
}

export type UserRole = User['role']
export type AppStatus = SukutApp['status']
export type MessageType = ChatMessage['type']