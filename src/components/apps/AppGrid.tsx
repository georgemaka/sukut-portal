import React, { useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { SUKUT_APPS } from '../../config/apps'
import AppCard from './AppCard'

const AppGrid: React.FC = () => {
  const { state, hasPermission } = useAuth()
  const { user } = state

  // Filter apps based on user permissions and role
  const availableApps = useMemo(() => {
    if (!user) return []

    return SUKUT_APPS.filter(app => {
      // Check if user has permission for this app
      if (!hasPermission(app.id)) return false

      // Additional role-based filtering (redundant but explicit)
      if (user.role === 'admin') return true
      
      return app.requiredRoles.includes(user.role)
    })
  }, [user, hasPermission])

  const handleAppClick = (app: typeof SUKUT_APPS[0]) => {
    if (app.status !== 'active') return

    // Check if it's an external URL (starts with http:// or https://)
    const isExternalUrl = app.url.startsWith('http://') || app.url.startsWith('https://')
    
    if (isExternalUrl) {
      // Open external apps in a new tab
      window.open(app.url, '_blank', 'noopener,noreferrer')
    } else {
      // For internal routes, navigate within the portal
      // This would be implemented when internal apps are added
      console.log(`Opening internal app: ${app.name}`)
      // Future: navigate(app.url)
    }
  }

  if (availableApps.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📱</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Applications Available
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          You don't have access to any applications yet. 
          Contact your administrator to get access to construction management tools.
        </p>
      </div>
    )
  }

  // Group apps by status for better organization
  const activeApps = availableApps.filter(app => app.status === 'active')
  const comingSoonApps = availableApps.filter(app => app.status === 'coming-soon')
  const maintenanceApps = availableApps.filter(app => app.status === 'maintenance')

  return (
    <div className="space-y-8">
      {/* Active Apps */}
      {activeApps.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Available Now</h3>
            <div className="ml-3 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              {activeApps.length} app{activeApps.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeApps.map(app => (
              <AppCard
                key={app.id}
                app={app}
                onClick={() => handleAppClick(app)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon Apps */}
      {comingSoonApps.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Coming Soon</h3>
            <div className="ml-3 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              {comingSoonApps.length} app{comingSoonApps.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {comingSoonApps.map(app => (
              <AppCard
                key={app.id}
                app={app}
                onClick={() => handleAppClick(app)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Maintenance Apps */}
      {maintenanceApps.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Under Maintenance</h3>
            <div className="ml-3 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
              {maintenanceApps.length} app{maintenanceApps.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {maintenanceApps.map(app => (
              <AppCard
                key={app.id}
                app={app}
                onClick={() => handleAppClick(app)}
              />
            ))}
          </div>
        </div>
      )}

      {/* User role information */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Access Information</h4>
            <p className="text-sm text-blue-700">
              You have <strong>{user?.role}</strong> access level. 
              This determines which applications and features you can use.
              {user?.role !== 'admin' && (
                <> Contact your administrator if you need access to additional tools.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppGrid