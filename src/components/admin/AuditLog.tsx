import React, { useState } from 'react'
import { AuditLogEntry } from '../../types'

// Mock audit log entries
const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: '1',
    userId: 'user-1',
    performedBy: 'admin@sukut.com',
    action: 'User Created',
    details: { 
      user: 'jane.smith@sukut.com',
      role: 'manager',
      apps: ['market-forecast', 'amex-review']
    },
    timestamp: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    userId: 'user-2',
    performedBy: 'admin@sukut.com',
    action: 'Permissions Updated',
    details: { 
      user: 'mike.foreman@sukut.com',
      added: ['company-equity'],
      removed: []
    },
    timestamp: '2024-01-20T09:15:00Z'
  },
  {
    id: '3',
    userId: 'bulk-operation',
    performedBy: 'admin@sukut.com',
    action: 'Bulk Access Grant',
    details: { 
      userCount: 5,
      apps: ['deferred-rent'],
      role: 'manager'
    },
    timestamp: '2024-01-19T16:45:00Z'
  },
  {
    id: '4',
    userId: 'user-3',
    performedBy: 'manager@sukut.com',
    action: 'User Status Changed',
    details: { 
      user: 'operator@sukut.com',
      from: 'active',
      to: 'inactive'
    },
    timestamp: '2024-01-19T14:20:00Z'
  },
  {
    id: '5',
    userId: 'group-1',
    performedBy: 'admin@sukut.com',
    action: 'Permission Group Created',
    details: { 
      groupName: 'Finance Team',
      apps: ['market-forecast', 'company-equity', 'deferred-rent']
    },
    timestamp: '2024-01-18T11:30:00Z'
  }
]

const AuditLog: React.FC = () => {
  const [auditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOG)
  const [filterAction, setFilterAction] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all')

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 168) { // 7 days
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'User Created':
        return '👤'
      case 'Permissions Updated':
        return '🔐'
      case 'Bulk Access Grant':
        return '👥'
      case 'User Status Changed':
        return '🔄'
      case 'Permission Group Created':
        return '📁'
      default:
        return '📋'
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'User Created':
        return 'bg-green-100 text-green-800'
      case 'Permissions Updated':
        return 'bg-blue-100 text-blue-800'
      case 'Bulk Access Grant':
        return 'bg-purple-100 text-purple-800'
      case 'User Status Changed':
        return 'bg-yellow-100 text-yellow-800'
      case 'Permission Group Created':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderDetails = (action: string, details: Record<string, any>) => {
    switch (action) {
      case 'User Created':
        return (
          <div className="text-sm text-gray-600">
            Created user <span className="font-medium">{details.user}</span> with role{' '}
            <span className="font-medium">{details.role}</span>
            {details.apps && details.apps.length > 0 && (
              <span> and access to {details.apps.length} apps</span>
            )}
          </div>
        )
      case 'Permissions Updated':
        return (
          <div className="text-sm text-gray-600">
            Updated permissions for <span className="font-medium">{details.user}</span>
            {details.added?.length > 0 && (
              <span className="text-green-600"> +{details.added.length} apps</span>
            )}
            {details.removed?.length > 0 && (
              <span className="text-red-600"> -{details.removed.length} apps</span>
            )}
          </div>
        )
      case 'Bulk Access Grant':
        return (
          <div className="text-sm text-gray-600">
            Granted access to <span className="font-medium">{details.apps.join(', ')}</span> for{' '}
            <span className="font-medium">{details.userCount} users</span>
            {details.role && <span> with role {details.role}</span>}
          </div>
        )
      case 'User Status Changed':
        return (
          <div className="text-sm text-gray-600">
            Changed status for <span className="font-medium">{details.user}</span> from{' '}
            <span className={details.from === 'active' ? 'text-green-600' : 'text-red-600'}>
              {details.from}
            </span>{' '}
            to{' '}
            <span className={details.to === 'active' ? 'text-green-600' : 'text-red-600'}>
              {details.to}
            </span>
          </div>
        )
      case 'Permission Group Created':
        return (
          <div className="text-sm text-gray-600">
            Created group <span className="font-medium">{details.groupName}</span> with{' '}
            <span className="font-medium">{details.apps.length} apps</span>
          </div>
        )
      default:
        return <div className="text-sm text-gray-600">{JSON.stringify(details)}</div>
    }
  }

  // Filter logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAction = filterAction === 'all' || log.action === filterAction
    
    // Date range filtering would be implemented here
    
    return matchesSearch && matchesAction
  })

  // Get unique actions for filter
  const uniqueActions = [...new Set(auditLogs.map(log => log.action))]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="input w-auto"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredLogs.length} of {auditLogs.length} entries
      </div>

      {/* Audit Log List */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div key={log.id} className="card p-6">
            <div className="flex items-start space-x-4">
              <div className="text-2xl">{getActionIcon(log.action)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="text-sm text-gray-500">
                      by <span className="font-medium text-gray-900">{log.performedBy}</span>
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{formatTimestamp(log.timestamp)}</span>
                </div>
                {renderDetails(log.action, log.details)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}

      {/* Export Button */}
      <div className="flex justify-end">
        <button className="btn btn-secondary">
          Export Audit Log
        </button>
      </div>
    </div>
  )
}

export default AuditLog