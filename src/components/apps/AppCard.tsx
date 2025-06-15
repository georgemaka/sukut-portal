import React from 'react'
import { SukutApp } from '../../types'

interface AppCardProps {
  app: SukutApp
  onClick: () => void
}

const AppCard: React.FC<AppCardProps> = React.memo(({ app, onClick }) => {
  const getStatusColor = (status: SukutApp['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'coming-soon':
        return 'text-yellow-600 bg-yellow-100'
      case 'maintenance':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: SukutApp['status']) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'coming-soon':
        return 'Coming Soon'
      case 'maintenance':
        return 'Maintenance'
      default:
        return 'Unknown'
    }
  }

  const isClickable = app.status === 'active'

  return (
    <div
      className={`app-card ${isClickable ? 'hover:shadow-lg hover:-translate-y-1' : 'opacity-75 cursor-not-allowed'}`}
      onClick={isClickable ? onClick : undefined}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${app.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
          {app.icon}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
          {getStatusText(app.status)}
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{app.name}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{app.description}</p>
      </div>

      {isClickable && (
        <div className="flex items-center justify-end text-xs text-gray-500">
          <div className="flex items-center text-sukut-primary">
            <span className="mr-1">Open</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
      )}

      {app.status === 'coming-soon' && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-xs text-yellow-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Available soon - Stay tuned!
          </div>
        </div>
      )}

      {app.status === 'maintenance' && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-xs text-red-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Under maintenance
          </div>
        </div>
      )}
    </div>
  )
})

export default AppCard