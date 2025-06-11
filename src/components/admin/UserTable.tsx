import React, { useState } from 'react'
import { User, BulkOperation } from '../../types'
import { getRoleInfo } from '../../config/roles'
import { getUserAccessibleApps } from '../../config/permissionGroups'
import UserModal from './UserModal'
import BulkActions from './BulkActions'

// Mock additional users for the admin panel
const MOCK_ADMIN_USERS: User[] = [
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
  {
    id: '2',
    email: 'manager@sukut.com',
    firstName: 'Sarah',
    lastName: 'Manager',
    role: 'manager',
    permissions: { apps: ['market-forecast', 'project-management'], features: ['view_reports'] },
    company: 'Sukut Construction',
    department: 'Operations',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-19T14:15:00Z',
    status: 'active'
  },
  {
    id: '3',
    email: 'foreman@sukut.com',
    firstName: 'Mike',
    lastName: 'Foreman',
    role: 'foreman',
    permissions: { apps: ['project-management', 'equipment-tracking'], features: ['view_projects'] },
    company: 'Sukut Construction',
    department: 'Field Operations',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-20T08:45:00Z',
    status: 'active'
  },
  {
    id: '4',
    email: 'operator@sukut.com',
    firstName: 'David',
    lastName: 'Operator',
    role: 'operator',
    permissions: { apps: ['equipment-tracking'], features: ['view_equipment'] },
    company: 'Sukut Construction',
    department: 'Equipment',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-20T06:30:00Z',
    status: 'active'
  },
  {
    id: '5',
    email: 'jane.smith@sukut.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'manager',
    permissions: { apps: ['market-forecast', 'reports-analytics'], features: ['view_reports'] },
    company: 'Sukut Construction',
    department: 'Finance',
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: '2024-01-18T16:20:00Z',
    status: 'active'
  },
  {
    id: '6',
    email: 'carlos.rodriguez@sukut.com',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    role: 'foreman',
    permissions: { apps: ['project-management', 'equipment-tracking'], features: ['view_projects'] },
    company: 'Sukut Construction',
    department: 'Field Operations',
    createdAt: '2024-01-10T00:00:00Z',
    lastLogin: '2024-01-19T07:15:00Z',
    status: 'active'
  },
  {
    id: '7',
    email: 'new.user@sukut.com',
    firstName: 'New',
    lastName: 'User',
    role: 'operator',
    permissions: { apps: ['equipment-tracking'], features: ['view_equipment'] },
    company: 'Sukut Construction',
    department: 'Equipment',
    createdAt: '2024-01-19T00:00:00Z',
    status: 'pending'
  }
]

interface UserTableProps {
  showUserModal: boolean
  setShowUserModal: (show: boolean) => void
}

const UserTable: React.FC<UserTableProps> = ({ showUserModal, setShowUserModal }) => {
  const [users, setUsers] = useState<User[]>(MOCK_ADMIN_USERS)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(filteredUsers.map(u => u.id))
    } else {
      setSelectedUserIds([])
    }
  }

  const handleSelectUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId))
    } else {
      setSelectedUserIds([...selectedUserIds, userId])
    }
  }

  const handleBulkAction = (operation: BulkOperation) => {
    console.log('Bulk operation:', operation)
    // In a real app, this would make an API call
    // For now, just clear selection
    setSelectedUserIds([])
  }

  const handleSaveUser = (userData: any) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } : u))
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        ...userData,
        createdAt: new Date().toISOString(),
        status: 'active'
      }
      setUsers([...users, newUser])
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="foreman">Foreman</option>
            <option value="operator">Operator</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedUserIds={selectedUserIds}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedUserIds([])}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  checked={filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-sukut-primary border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Apps Access
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => {
              const roleInfo = getRoleInfo(user.role)
              const accessibleApps = getUserAccessibleApps(user.permissions)
              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="h-4 w-4 text-sukut-primary border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-sukut-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleInfo?.color} bg-gray-100`}>
                      {roleInfo?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatLastLogin(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {accessibleApps.length} apps
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setEditingUser(user)
                          setShowUserModal(true)
                        }}
                        className="text-sukut-primary hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false)
          setEditingUser(null)
        }}
        user={editingUser}
        users={users}
        onSave={handleSaveUser}
      />
    </div>
  )
}

export default UserTable