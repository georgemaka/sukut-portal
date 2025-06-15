export const USER_ROLES = {
  admin: {
    name: 'Administrator',
    description: 'Full system access and user management',
    permissions: ['all'],
    apps: ['*'], // Access to all apps
    color: 'text-red-600'
  },
  user: {
    name: 'User',
    description: 'Access to granted applications only',
    permissions: ['view_granted_apps'],
    apps: [], // Apps will be granted individually
    color: 'text-blue-600'
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