import React, { useState, useEffect } from 'react'
import { User, CreateUserData, UserRole } from '../../types'
import { SUKUT_APPS } from '../../config/apps'
import { PERMISSION_GROUPS, getDefaultPermissions } from '../../config/permissionGroups'
import { getRoleInfo } from '../../config/roles'
import { useModalClose } from '../../hooks/useModalClose'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  user?: User | null
  users?: User[]
  onSave: (userData: CreateUserData | Partial<User>) => void
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user, users = [], onSave }) => {
  const modalRef = useModalClose(isOpen, onClose)
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'user',
    company: 'Sukut Construction',
    department: '',
    permissions: { apps: [], features: [], groups: [] }
  })
  const [copyFromUserId, setCopyFromUserId] = useState<string>('')

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        company: user.company,
        department: user.department || '',
        permissions: user.permissions
      })
    } else {
      // Reset form for new user
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'user',
        company: 'Sukut Construction',
        department: '',
        permissions: { apps: [], features: [], groups: [] }
      })
      setCopyFromUserId('')
    }
  }, [user])

  const handleRoleChange = (role: UserRole) => {
    const defaultPerms = getDefaultPermissions(role)
    setFormData({
      ...formData,
      role,
      permissions: {
        apps: defaultPerms.apps,
        features: defaultPerms.features,
        groups: defaultPerms.groups
      }
    })
  }

  const handleCopyPermissions = (userId: string) => {
    const sourceUser = users.find(u => u.id === userId)
    if (sourceUser) {
      setFormData({
        ...formData,
        permissions: { ...sourceUser.permissions }
      })
    }
  }

  const handleGroupToggle = (groupId: string) => {
    const currentGroups = formData.permissions.groups || []
    const newGroups = currentGroups.includes(groupId)
      ? currentGroups.filter(g => g !== groupId)
      : [...currentGroups, groupId]
    
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        groups: newGroups
      }
    })
  }

  const handleAppToggle = (appId: string) => {
    const currentApps = formData.permissions.apps
    const newApps = currentApps.includes(appId)
      ? currentApps.filter(a => a !== appId)
      : [...currentApps, appId]
    
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        apps: newApps
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(user ? { ...user, ...formData } : formData)
    onClose()
  }

  if (!isOpen) return null

  const roleInfo = getRoleInfo(formData.role)

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {user ? 'Edit User' : 'Add New User'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="px-6 py-4 space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="input"
                    placeholder="e.g., Finance, Operations"
                  />
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Role</h4>
              <div className="grid grid-cols-2 gap-4">
                {(['admin', 'user'] as UserRole[]).map((role) => {
                  const info = getRoleInfo(role)
                  return (
                    <label
                      key={role}
                      className={`
                        relative flex items-center p-4 border rounded-lg cursor-pointer
                        ${formData.role === role
                          ? 'border-sukut-primary bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={formData.role === role}
                        onChange={() => handleRoleChange(role)}
                        className="sr-only"
                      />
                      <div>
                        <div className={`font-medium ${info?.color}`}>{info?.name}</div>
                        <div className="text-sm text-gray-500">{info?.description}</div>
                      </div>
                    </label>
                  )
                })}
              </div>
              {formData.role && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Default permissions applied:</span> Role-based defaults for {roleInfo?.name}
                </div>
              )}
            </div>

            {/* Copy Permissions */}
            {!user && users.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Copy Permissions From</h4>
                <select
                  value={copyFromUserId}
                  onChange={(e) => {
                    setCopyFromUserId(e.target.value)
                    if (e.target.value) {
                      handleCopyPermissions(e.target.value)
                    }
                  }}
                  className="input"
                >
                  <option value="">Select a user to copy permissions...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.firstName} {u.lastName} ({getRoleInfo(u.role)?.name})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Permission Groups */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Permission Groups</h4>
              <div className="space-y-2">
                {PERMISSION_GROUPS.map((group) => (
                  <label
                    key={group.id}
                    className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(formData.permissions.groups || []).includes(group.id)}
                      onChange={() => handleGroupToggle(group.id)}
                      className="mt-1 h-4 w-4 text-sukut-primary border-gray-300 rounded focus:ring-sukut-primary"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{group.icon}</span>
                        <span className="font-medium text-gray-900">{group.name}</span>
                      </div>
                      <p className="text-sm text-gray-500">{group.description}</p>
                      <div className="mt-1 text-xs text-gray-400">
                        Apps: {group.apps.map(appId => 
                          SUKUT_APPS.find(a => a.id === appId)?.name
                        ).filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Individual App Permissions */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Individual App Access</h4>
              <div className="grid grid-cols-2 gap-3">
                {SUKUT_APPS.map((app) => (
                  <label
                    key={app.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.permissions.apps.includes(app.id) || formData.permissions.apps.includes('*')}
                      onChange={() => handleAppToggle(app.id)}
                      disabled={formData.permissions.apps.includes('*')}
                      className="h-4 w-4 text-sukut-primary border-gray-300 rounded focus:ring-sukut-primary"
                    />
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{app.icon}</span>
                        <span className="font-medium text-gray-900">{app.name}</span>
                      </div>
                      <p className="text-xs text-gray-500">{app.description}</p>
                    </div>
                  </label>
                ))}
              </div>
              {formData.permissions.apps.includes('*') && (
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Note:</span> This user has access to all applications
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {user ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserModal