import React, { useState } from 'react'
import { SUKUT_APPS } from '../../config/apps'
import { User, UserRole } from '../../types'
import { getRoleInfo } from '../../config/roles'
import { PERMISSION_GROUPS } from '../../config/permissionGroups'
import { useModalClose } from '../../hooks/useModalClose'

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@sukut.com',
    firstName: 'John',
    lastName: 'Admin',
    role: 'admin',
    permissions: { apps: ['*'], features: ['all'] },
    company: 'Sukut Construction',
    department: 'IT',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-20T10:30:00Z',
    status: 'active'
  },
  // Add more mock users as needed
]

const AppManagement: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [showGrantModal, setShowGrantModal] = useState(false)
  const [grantType, setGrantType] = useState<'role' | 'group' | 'users'>('role')
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  
  const grantModalRef = useModalClose(showGrantModal, () => setShowGrantModal(false))
  const viewUsersModalRef = useModalClose(selectedApp !== null && !showGrantModal, () => setSelectedApp(null))

  const getUsersWithAccess = (appId: string) => {
    return MOCK_USERS.filter(user => {
      // Check if user has wildcard access
      if (user.permissions.apps.includes('*')) return true
      
      // Check direct app access
      if (user.permissions.apps.includes(appId)) return true
      
      // Check group access
      const userGroups = user.permissions.groups || []
      const hasGroupAccess = userGroups.some(groupId => {
        const group = PERMISSION_GROUPS.find(g => g.id === groupId)
        return group?.apps.includes(appId)
      })
      
      return hasGroupAccess
    })
  }

  const handleGrantAccess = () => {
    // In a real app, this would make an API call
    console.log('Granting access:', {
      app: selectedApp,
      type: grantType,
      roles: selectedRoles,
      groups: selectedGroups,
      users: selectedUsers
    })
    setShowGrantModal(false)
    // Reset selections
    setSelectedRoles([])
    setSelectedGroups([])
    setSelectedUsers([])
  }

  return (
    <div className="space-y-6">
      {/* App Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SUKUT_APPS.map((app) => {
          const usersWithAccess = getUsersWithAccess(app.id)
          const accessPercentage = Math.round((usersWithAccess.length / MOCK_USERS.length) * 100)
          
          return (
            <div key={app.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 ${app.color} rounded-lg text-white text-2xl`}>
                    {app.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                    <p className="text-sm text-gray-500">{app.description}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  app.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : app.status === 'coming-soon'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {app.status}
                </span>
              </div>

              {/* Access Stats */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">User Access</span>
                  <span className="font-medium">{usersWithAccess.length} users ({accessPercentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-sukut-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${accessPercentage}%` }}
                  />
                </div>
              </div>

              {/* Required Roles */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Required Roles:</p>
                <div className="flex flex-wrap gap-2">
                  {app.requiredRoles.map(role => {
                    const roleInfo = getRoleInfo(role)
                    return (
                      <span 
                        key={role}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${roleInfo?.color} bg-gray-100`}
                      >
                        {roleInfo?.name}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedApp(app.id)
                    setShowGrantModal(true)
                  }}
                  className="btn btn-secondary text-sm flex-1"
                >
                  Grant Access
                </button>
                <button
                  onClick={() => setSelectedApp(app.id)}
                  className="btn btn-secondary text-sm flex-1"
                >
                  View Users
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Grant Access Modal */}
      {showGrantModal && selectedApp && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div ref={grantModalRef} className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Grant Access to {SUKUT_APPS.find(a => a.id === selectedApp)?.name}
              </h3>
            </div>

            <div className="px-6 py-4">
              {/* Grant Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grant access by:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['role', 'group', 'users'] as const).map((type) => (
                    <label
                      key={type}
                      className={`
                        flex items-center justify-center p-3 border rounded-lg cursor-pointer
                        ${grantType === type
                          ? 'border-sukut-primary bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        value={type}
                        checked={grantType === type}
                        onChange={() => setGrantType(type)}
                        className="sr-only"
                      />
                      <span className="font-medium capitalize">{type === 'users' ? 'Individual Users' : type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Selection based on grant type */}
              {grantType === 'role' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select roles:
                  </label>
                  {(['admin', 'manager', 'foreman', 'operator'] as UserRole[]).map((role) => {
                    const roleInfo = getRoleInfo(role)
                    return (
                      <label key={role} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={selectedRoles.includes(role)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRoles([...selectedRoles, role])
                            } else {
                              setSelectedRoles(selectedRoles.filter(r => r !== role))
                            }
                          }}
                          className="h-4 w-4 text-sukut-primary border-gray-300 rounded"
                        />
                        <span className={`ml-3 font-medium ${roleInfo?.color}`}>
                          {roleInfo?.name}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}

              {grantType === 'group' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select permission groups:
                  </label>
                  {PERMISSION_GROUPS.map((group) => (
                    <label key={group.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGroups([...selectedGroups, group.id])
                          } else {
                            setSelectedGroups(selectedGroups.filter(g => g !== group.id))
                          }
                        }}
                        className="h-4 w-4 text-sukut-primary border-gray-300 rounded"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{group.icon}</span>
                          <span className="font-medium">{group.name}</span>
                        </div>
                        <p className="text-xs text-gray-500">{group.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {grantType === 'users' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search and select users:
                  </label>
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="input mb-3"
                  />
                  <div className="text-sm text-gray-500">
                    User selection would be implemented here with a searchable list
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowGrantModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleGrantAccess}
                className="btn btn-primary"
                disabled={
                  (grantType === 'role' && selectedRoles.length === 0) ||
                  (grantType === 'group' && selectedGroups.length === 0) ||
                  (grantType === 'users' && selectedUsers.length === 0)
                }
              >
                Grant Access
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users with Access Modal */}
      {selectedApp && !showGrantModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div ref={viewUsersModalRef} className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Users with access to {SUKUT_APPS.find(a => a.id === selectedApp)?.name}
              </h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-8rem)]">
              <div className="space-y-3">
                {getUsersWithAccess(selectedApp).map((user) => {
                  const roleInfo = getRoleInfo(user.role)
                  return (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-sukut-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleInfo?.color} bg-gray-100`}>
                          {roleInfo?.name}
                        </span>
                        <button className="text-red-600 hover:text-red-900 text-sm">
                          Revoke
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppManagement