import React, { useState } from 'react'
import { BulkOperation, UserRole } from '../../types'
import { SUKUT_APPS } from '../../config/apps'
import { PERMISSION_GROUPS } from '../../config/permissionGroups'
import { getRoleInfo } from '../../config/roles'
import { useModalClose } from '../../hooks/useModalClose'

interface BulkActionsProps {
  selectedUserIds: string[]
  onBulkAction: (operation: BulkOperation) => void
  onClearSelection: () => void
}

const BulkActions: React.FC<BulkActionsProps> = ({ 
  selectedUserIds, 
  onBulkAction, 
  onClearSelection 
}) => {
  const [showModal, setShowModal] = useState(false)
  const [actionType, setActionType] = useState<BulkOperation['type'] | null>(null)
  
  const modalRef = useModalClose(showModal, () => {
    setShowModal(false)
    setActionType(null)
  })
  
  // State for different action types
  const [selectedApps, setSelectedApps] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [selectedRole, setSelectedRole] = useState<UserRole>('user')
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'inactive'>('active')

  const handleAction = () => {
    if (!actionType) return

    const payload: BulkOperation['payload'] = {}

    switch (actionType) {
      case 'grant_access':
      case 'revoke_access':
        payload.apps = selectedApps
        payload.groups = selectedGroups
        break
      case 'update_role':
        payload.role = selectedRole
        break
      case 'update_status':
        payload.status = selectedStatus
        break
    }

    onBulkAction({
      type: actionType,
      userIds: selectedUserIds,
      payload
    })

    // Reset state
    setShowModal(false)
    setActionType(null)
    setSelectedApps([])
    setSelectedGroups([])
    onClearSelection()
  }

  const openModal = (type: BulkOperation['type']) => {
    setActionType(type)
    setShowModal(true)
  }

  if (selectedUserIds.length === 0) return null

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="bg-blue-50 border-t border-b border-blue-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-blue-900">
              {selectedUserIds.length} user{selectedUserIds.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={onClearSelection}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear selection
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => openModal('grant_access')}
              className="btn btn-secondary text-sm"
            >
              Grant Access
            </button>
            <button
              onClick={() => openModal('revoke_access')}
              className="btn btn-secondary text-sm"
            >
              Revoke Access
            </button>
            <button
              onClick={() => openModal('update_role')}
              className="btn btn-secondary text-sm"
            >
              Change Role
            </button>
            <button
              onClick={() => openModal('update_status')}
              className="btn btn-secondary text-sm"
            >
              Change Status
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Modal */}
      {showModal && actionType && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {actionType === 'grant_access' && 'Grant Access'}
                {actionType === 'revoke_access' && 'Revoke Access'}
                {actionType === 'update_role' && 'Change User Role'}
                {actionType === 'update_status' && 'Change User Status'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                This action will affect {selectedUserIds.length} selected user{selectedUserIds.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="px-6 py-4">
              {/* Grant/Revoke Access */}
              {(actionType === 'grant_access' || actionType === 'revoke_access') && (
                <div className="space-y-4">
                  {/* Permission Groups */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Permission Groups</h4>
                    <div className="space-y-2">
                      {PERMISSION_GROUPS.map((group) => (
                        <label
                          key={group.id}
                          className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
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
                  </div>

                  {/* Individual Apps */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Individual Apps</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {SUKUT_APPS.map((app) => (
                        <label
                          key={app.id}
                          className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedApps.includes(app.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedApps([...selectedApps, app.id])
                              } else {
                                setSelectedApps(selectedApps.filter(a => a !== app.id))
                              }
                            }}
                            className="h-4 w-4 text-sukut-primary border-gray-300 rounded"
                          />
                          <div className="ml-3 flex items-center">
                            <span className="text-lg mr-2">{app.icon}</span>
                            <span className="text-sm font-medium">{app.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Change Role */}
              {actionType === 'update_role' && (
                <div className="space-y-2">
                  {(['admin', 'user'] as UserRole[]).map((role) => {
                    const roleInfo = getRoleInfo(role)
                    return (
                      <label
                        key={role}
                        className={`
                          flex items-center p-4 border rounded-lg cursor-pointer
                          ${selectedRole === role
                            ? 'border-sukut-primary bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role}
                          checked={selectedRole === role}
                          onChange={() => setSelectedRole(role)}
                          className="sr-only"
                        />
                        <div>
                          <div className={`font-medium ${roleInfo?.color}`}>{roleInfo?.name}</div>
                          <div className="text-sm text-gray-500">{roleInfo?.description}</div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}

              {/* Change Status */}
              {actionType === 'update_status' && (
                <div className="space-y-2">
                  <label
                    className={`
                      flex items-center p-4 border rounded-lg cursor-pointer
                      ${selectedStatus === 'active'
                        ? 'border-sukut-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={selectedStatus === 'active'}
                      onChange={() => setSelectedStatus('active')}
                      className="sr-only"
                    />
                    <div>
                      <div className="font-medium text-green-600">Active</div>
                      <div className="text-sm text-gray-500">Users can log in and access applications</div>
                    </div>
                  </label>
                  
                  <label
                    className={`
                      flex items-center p-4 border rounded-lg cursor-pointer
                      ${selectedStatus === 'inactive'
                        ? 'border-sukut-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={selectedStatus === 'inactive'}
                      onChange={() => setSelectedStatus('inactive')}
                      className="sr-only"
                    />
                    <div>
                      <div className="font-medium text-red-600">Inactive</div>
                      <div className="text-sm text-gray-500">Users cannot log in or access any applications</div>
                    </div>
                  </label>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false)
                  setActionType(null)
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className="btn btn-primary"
                disabled={
                  (actionType === 'grant_access' || actionType === 'revoke_access') &&
                  selectedApps.length === 0 && selectedGroups.length === 0
                }
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BulkActions