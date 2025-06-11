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
    id: 'company-equity',
    name: 'Company Equity',
    description: 'Track and manage company equity',
    url: '/equity',
    icon: '💼',
    color: 'bg-green-500',
    requiredRoles: ['admin'],
    status: 'coming-soon',
    version: '1.0.0'
  },
  {
    id: 'amex-review',
    name: 'Amex Review',
    description: 'American Express account management',
    url: '/amex',
    icon: '💳',
    color: 'bg-purple-500',
    requiredRoles: ['admin', 'manager'],
    status: 'coming-soon',
    version: '1.0.0'
  },
  {
    id: 'deferred-rent',
    name: 'Deferred Rent',
    description: 'Manage deferred rent agreements',
    url: '/rent',
    icon: '🏢',
    color: 'bg-yellow-500',
    requiredRoles: ['admin'],
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