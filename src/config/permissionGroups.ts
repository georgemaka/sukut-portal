import { PermissionGroup, UserRole } from '../types'

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: 'executive-suite',
    name: 'Executive Suite',
    description: 'Full access to all applications',
    apps: ['market-forecast', 'company-equity', 'amex-review', 'deferred-rent'],
    icon: '👔',
    color: 'bg-purple-500'
  },
  {
    id: 'finance-suite',
    name: 'Finance Suite',
    description: 'Financial planning and analysis tools',
    apps: ['market-forecast', 'company-equity', 'deferred-rent'],
    icon: '💰',
    color: 'bg-green-500'
  },
  {
    id: 'accounting-suite',
    name: 'Accounting Suite',
    description: 'Accounting and expense management',
    apps: ['amex-review', 'deferred-rent'],
    icon: '📊',
    color: 'bg-blue-500'
  },
  {
    id: 'basic-access',
    name: 'Basic Access',
    description: 'Essential tools only',
    apps: ['market-forecast'],
    icon: '📈',
    color: 'bg-gray-500'
  }
]

// Default permission groups by role
export const ROLE_DEFAULT_GROUPS: Record<UserRole, string[]> = {
  admin: ['executive-suite'],
  manager: ['finance-suite'],
  foreman: ['basic-access'],
  operator: []
}

// Default individual app permissions by role (for apps not in groups)
export const ROLE_DEFAULT_APPS: Record<UserRole, string[]> = {
  admin: ['*'], // Admins get all apps by default
  manager: ['market-forecast', 'amex-review'],
  foreman: ['market-forecast'],
  operator: []
}

// Default feature permissions by role
export const ROLE_DEFAULT_FEATURES: Record<UserRole, string[]> = {
  admin: ['all'],
  manager: ['view_reports', 'edit_own_data', 'export_data'],
  foreman: ['view_projects', 'edit_own_data'],
  operator: ['view_equipment', 'view_own_data']
}

export const getGroupById = (id: string): PermissionGroup | undefined => {
  return PERMISSION_GROUPS.find(group => group.id === id)
}

export const getGroupsByApps = (appIds: string[]): PermissionGroup[] => {
  return PERMISSION_GROUPS.filter(group => 
    group.apps.some(app => appIds.includes(app))
  )
}

export const getDefaultPermissions = (role: UserRole) => {
  return {
    groups: ROLE_DEFAULT_GROUPS[role] || [],
    apps: ROLE_DEFAULT_APPS[role] || [],
    features: ROLE_DEFAULT_FEATURES[role] || []
  }
}

// Get all apps a user has access to (from both groups and individual permissions)
export const getUserAccessibleApps = (permissions: { groups?: string[], apps: string[] }): string[] => {
  const appsFromGroups = (permissions.groups || [])
    .map(groupId => getGroupById(groupId))
    .filter(Boolean)
    .flatMap(group => group!.apps)
  
  const individualApps = permissions.apps.includes('*') 
    ? ['market-forecast', 'company-equity', 'amex-review', 'deferred-rent']
    : permissions.apps
  
  // Combine and deduplicate
  return [...new Set([...appsFromGroups, ...individualApps])]
}