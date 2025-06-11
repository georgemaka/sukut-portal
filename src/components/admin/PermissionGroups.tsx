import React, { useState } from 'react'
import { PERMISSION_GROUPS } from '../../config/permissionGroups'
import { SUKUT_APPS } from '../../config/apps'
import { PermissionGroup } from '../../types'
import { useModalClose } from '../../hooks/useModalClose'

const PermissionGroups: React.FC = () => {
  const [groups, setGroups] = useState(PERMISSION_GROUPS)
  const [editingGroup, setEditingGroup] = useState<PermissionGroup | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleSaveGroup = (group: PermissionGroup) => {
    if (editingGroup) {
      setGroups(groups.map(g => g.id === group.id ? group : g))
    } else {
      setGroups([...groups, { ...group, id: `group-${Date.now()}` }])
    }
    setEditingGroup(null)
    setShowCreateModal(false)
  }

  const handleDeleteGroup = (groupId: string) => {
    if (confirm('Are you sure you want to delete this permission group?')) {
      setGroups(groups.filter(g => g.id !== groupId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Permission Groups</h2>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage permission groups to simplify access control
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          + Create Group
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className={`p-3 ${group.color} rounded-lg text-white text-2xl`}>
                  {group.icon}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                  <p className="text-sm text-gray-500">{group.description}</p>
                </div>
              </div>
            </div>

            {/* Apps in Group */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Apps in this group:</p>
              <div className="flex flex-wrap gap-2">
                {group.apps.map(appId => {
                  const app = SUKUT_APPS.find(a => a.id === appId)
                  return app ? (
                    <span key={appId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {app.icon} {app.name}
                    </span>
                  ) : null
                })}
              </div>
            </div>

            {/* Usage Stats */}
            <div className="mb-4 text-sm text-gray-600">
              <p>Used by 12 users</p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setEditingGroup(group)
                  setShowCreateModal(true)
                }}
                className="btn btn-secondary text-sm flex-1"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteGroup(group.id)}
                className="btn btn-secondary text-sm flex-1 text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <GroupModal
          group={editingGroup}
          onSave={handleSaveGroup}
          onClose={() => {
            setShowCreateModal(false)
            setEditingGroup(null)
          }}
        />
      )}
    </div>
  )
}

interface GroupModalProps {
  group: PermissionGroup | null
  onSave: (group: PermissionGroup) => void
  onClose: () => void
}

const GroupModal: React.FC<GroupModalProps> = ({ group, onSave, onClose }) => {
  const modalRef = useModalClose(true, onClose)
  const [formData, setFormData] = useState<Omit<PermissionGroup, 'id'>>({
    name: group?.name || '',
    description: group?.description || '',
    apps: group?.apps || [],
    icon: group?.icon || '📁',
    color: group?.color || 'bg-gray-500'
  })

  const icons = ['📁', '💼', '🔐', '🎯', '🚀', '⭐', '💎', '🛡️']
  const colors = [
    'bg-gray-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: group?.id || '',
      ...formData
    })
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {group ? 'Edit Permission Group' : 'Create Permission Group'}
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                required
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-8 gap-2">
                {icons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`
                      p-3 text-2xl rounded-lg border-2 transition-all
                      ${formData.icon === icon
                        ? 'border-sukut-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="grid grid-cols-8 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`
                      h-10 rounded-lg border-2 transition-all ${color}
                      ${formData.color === color
                        ? 'border-gray-900 scale-110'
                        : 'border-transparent'
                      }
                    `}
                  />
                ))}
              </div>
            </div>

            {/* Apps Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apps in this group
              </label>
              <div className="space-y-2">
                {SUKUT_APPS.map((app) => (
                  <label
                    key={app.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.apps.includes(app.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, apps: [...formData.apps, app.id] })
                        } else {
                          setFormData({ ...formData, apps: formData.apps.filter(a => a !== app.id) })
                        }
                      }}
                      className="h-4 w-4 text-sukut-primary border-gray-300 rounded"
                    />
                    <div className="ml-3 flex items-center">
                      <span className="text-lg mr-2">{app.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{app.name}</div>
                        <div className="text-xs text-gray-500">{app.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {group ? 'Update Group' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PermissionGroups