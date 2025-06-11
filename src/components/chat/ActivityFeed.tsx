import React, { useState } from 'react'
import { ChatMessage } from '../../types'
import { getRoleInfo } from '../../config/roles'
import { SUKUT_APPS } from '../../config/apps'

interface ActivityFeedProps {
  messages: ChatMessage[]
  isOpen: boolean
  onToggle: () => void
  onOpenChat: () => void
  onMessageClick?: (message: ChatMessage) => void
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  messages, 
  isOpen, 
  onToggle, 
  onOpenChat,
  onMessageClick 
}) => {
  const [filter, setFilter] = useState<'all' | ChatMessage['type']>('all')

  const filteredMessages = messages.filter(msg => 
    filter === 'all' || msg.type === filter
  ).slice(0, 10) // Show only recent 10 messages

  const getMessageIcon = (type: ChatMessage['type']) => {
    switch (type) {
      case 'announcement':
        return '📢'
      case 'comment':
        return '💬'
      case 'question':
        return '❓'
      case 'feedback':
        return '💡'
      default:
        return '💬'
    }
  }

  const getMessageTypeColor = (type: ChatMessage['type']) => {
    switch (type) {
      case 'announcement':
        return 'text-red-600'
      case 'comment':
        return 'text-blue-600'
      case 'question':
        return 'text-purple-600'
      case 'feedback':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    
    if (diffInMinutes < 1) return 'just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={`
      fixed right-0 top-16 h-[calc(100vh-4rem)] bg-white border-l border-gray-200 shadow-lg
      transition-all duration-300 ease-in-out z-40
      ${isOpen ? 'w-80' : 'w-0'}
    `}>
      {isOpen && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button
                onClick={onToggle}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2">
              {(['all', 'announcement', 'comment', 'question', 'feedback'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`
                    px-3 py-1 text-xs font-medium rounded-full transition-colors
                    ${filter === type
                      ? 'bg-sukut-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <div className="text-3xl mb-2">💬</div>
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredMessages.map((message) => {
                  const roleInfo = getRoleInfo(message.userRole)
                  const app = message.appId ? SUKUT_APPS.find(a => a.id === message.appId) : null
                  
                  return (
                    <div
                      key={message.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onMessageClick?.(message)}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">{getMessageIcon(message.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm text-gray-900">
                                {message.userName}
                              </span>
                              <span className={`text-xs ${roleInfo?.color}`}>
                                {roleInfo?.name}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(message.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {message.content}
                          </p>
                          
                          {/* Tags and App */}
                          <div className="mt-1 flex items-center space-x-2">
                            {app && (
                              <span className="inline-flex items-center text-xs text-gray-500">
                                {app.icon} {app.name}
                              </span>
                            )}
                            {message.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Message Type Badge */}
                          <div className="mt-1">
                            <span className={`text-xs font-medium ${getMessageTypeColor(message.type)}`}>
                              {message.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onOpenChat}
              className="w-full btn btn-primary text-sm"
            >
              Open Full Chat
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button (when closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 bg-white border border-gray-200 rounded-l-lg p-2 shadow-md hover:bg-gray-50"
          aria-label="Open activity feed"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default ActivityFeed