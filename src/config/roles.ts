export const USER_ROLES = {
  admin: {
    name: 'Administrator',
    description: 'Full system access and user management',
    permissions: ['all'],
    apps: ['*'], // Access to all apps
    color: 'text-red-600'
  },
  manager: {
    name: 'Manager',
    description: 'Project oversight and planning access',
    permissions: ['view_reports', 'manage_projects', 'view_analytics'],
    apps: ['market-forecast', 'project-management', 'inventory-management', 'reports-analytics', 'safety-compliance'],
    color: 'text-blue-600'
  },
  foreman: {
    name: 'Foreman',
    description: 'Field operations and equipment management',
    permissions: ['view_projects', 'update_progress', 'manage_equipment', 'safety_oversight'],
    apps: ['project-management', 'equipment-tracking', 'safety-compliance'],
    color: 'text-green-600'
  },
  operator: {
    name: 'Operator',
    description: 'Equipment operation and status updates',
    permissions: ['view_equipment', 'update_status', 'view_safety'],
    apps: ['equipment-tracking'],
    color: 'text-yellow-600'
  }
}

export type RoleKey = keyof typeof USER_ROLES

export const getRoleInfo = (role: string) => {
  return USER_ROLES[role as RoleKey] || null
}

export const getRolesByPermission = (permission: string): RoleKey[] => {
  return (Object.keys(USER_ROLES) as RoleKey[]).filter(role => {
    const roleInfo = USER_ROLES[role]
    return roleInfo.permissions.includes(permission) || roleInfo.permissions.includes('all')
  })
}

export const getAllRoles = () => {
  return Object.keys(USER_ROLES) as RoleKey[]
}

export const isValidRole = (role: string): role is RoleKey => {
  return role in USER_ROLES
}