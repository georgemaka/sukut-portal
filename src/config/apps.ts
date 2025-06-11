import { SukutApp } from '../types'

export const SUKUT_APPS: SukutApp[] = [
  {
    id: 'market-forecast',
    name: 'Market Forecast',
    description: 'Revenue and resource planning dashboard',
    url: import.meta.env.VITE_MARKET_FORECAST_URL || 'http://localhost:3000',
    icon: '📊',
    color: 'bg-blue-500',
    requiredRoles: ['admin', 'manager'],
    status: 'active',
    version: '2.1.0',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Track projects, timelines, and resources',
    url: '/projects',
    icon: '🏗️',
    color: 'bg-green-500',
    requiredRoles: ['admin', 'manager', 'foreman'],
    status: 'coming-soon',
    version: '1.0.0'
  },
  {
    id: 'equipment-tracking',
    name: 'Equipment Tracking',
    description: 'Monitor equipment location and maintenance',
    url: '/equipment',
    icon: '🚜',
    color: 'bg-yellow-500',
    requiredRoles: ['admin', 'manager', 'foreman', 'operator'],
    status: 'coming-soon',
    version: '1.0.0'
  },
  {
    id: 'safety-compliance',
    name: 'Safety & Compliance',
    description: 'Safety protocols and compliance tracking',
    url: '/safety',
    icon: '🦺',
    color: 'bg-red-500',
    requiredRoles: ['admin', 'manager', 'foreman'],
    status: 'coming-soon',
    version: '1.0.0'
  },
  {
    id: 'inventory-management',
    name: 'Inventory Management',
    description: 'Materials and supplies inventory',
    url: '/inventory',
    icon: '📦',
    color: 'bg-purple-500',
    requiredRoles: ['admin', 'manager'],
    status: 'coming-soon',
    version: '1.0.0'
  },
  {
    id: 'reports-analytics',
    name: 'Reports & Analytics',
    description: 'Business intelligence and reporting',
    url: '/reports',
    icon: '📈',
    color: 'bg-indigo-500',
    requiredRoles: ['admin', 'manager'],
    status: 'coming-soon',
    version: '1.0.0'
  }
]

export const getAppById = (id: string): SukutApp | undefined => {
  return SUKUT_APPS.find(app => app.id === id)
}

export const getAppsByRole = (role: string): SukutApp[] => {
  return SUKUT_APPS.filter(app => app.requiredRoles.includes(role))
}

export const getActiveApps = (): SukutApp[] => {
  return SUKUT_APPS.filter(app => app.status === 'active')
}