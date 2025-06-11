import React, { useState, useRef, useEffect } from 'react'
import { ChatMessage, MessageType } from '../../types'
import { useAuth } from '../../context/AuthContext'
import { getRoleInfo } from '../../config/roles'
import { SUKUT_APPS } from '../../config/apps'
import { useModalClose } from '../../hooks/useModalClose'

interface FullChatModalProps {
  isOpen: boolean
  onClose: () => void
  messages: ChatMessage[]
  onSendMessage: (content: string, type: MessageType, tags?: string[], appId?: string) => void
  onReaction: (messageId: string, emoji: string) => void
  onPin: (messageId: string) => void
}

const FullChatModal: React.FC<FullChatModalProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  onReaction,
  onPin
}) => {
  const modalRef = useModalClose(isOpen, onClose)
  const { state } = useAuth()
  const { user } = state
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [newMessage, setNewMessage] = useState('')
  const [messageType, setMessageType] = useState<MessageType>('comment')
  const [selectedApp, setSelectedApp] = useState<string>('')
  const [tags, setTags] = useState<string>('')
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null)

  const messageTypes: { value: MessageType; label: string; icon: string }[] = [
    { value: 'comment', label: 'Comment', icon: '💬' },
    { value: 'question', label: 'Question', icon: '❓' },
    { value: 'feedback', label: 'Feedback', icon: '💡' },
    { value: 'announcement', label: 'Announcement', icon: '📢' }
  ]

  const emojis = ['👍', '❤️', '😊', '🎉', '🤔', '👏']

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = () => {
    if (!newMessage.trim()) return
    
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean)
    onSendMessage(newMessage, messageType, tagArray, selectedApp || undefined)
    
    // Reset form
    setNewMessage('')
    setTags('')
    setSelectedApp('')
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toDateString()
    if (!groups[date]) groups[date] = []
    groups[date].push(message)
    return groups
  }, {} as Record<string, ChatMessage[]>)

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Team Chat</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-3 text-sm text-gray-500">{date}</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {/* Messages */}
              {dateMessages.map((message) => {
                const roleInfo = getRoleInfo(message.userRole)
                const app = message.appId ? SUKUT_APPS.find(a => a.id === message.appId) : null
                const isOwnMessage = user?.id === message.userId

                return (
                  <div
                    key={message.id}
                    className={`mb-4 ${isOwnMessage ? 'flex justify-end' : ''}`}
                  >
                    <div className={`max-w-2xl ${isOwnMessage ? 'text-right' : ''}`}>
                      {/* User Info */}
                      <div className={`flex items-center space-x-2 mb-1 ${isOwnMessage ? 'justify-end' : ''}`}>
                        <span className="font-medium text-sm text-gray-900">
                          {message.userName}
                        </span>
                        <span className={`text-xs ${roleInfo?.color}`}>
                          {roleInfo?.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(message.timestamp)}
                        </span>
                        {message.isPinned && <span className="text-xs">📌</span>}
                      </div>

                      {/* Message Content */}
                      <div className={`
                        inline-block px-4 py-2 rounded-lg
                        ${isOwnMessage 
                          ? 'bg-sukut-primary text-white' 
                          : 'bg-gray-100 text-gray-900'
                        }
                      `}>
                        <p className="text-sm">{message.content}</p>
                      </div>

                      {/* Message Metadata */}
                      <div className={`mt-1 flex items-center space-x-2 text-xs ${isOwnMessage ? 'justify-end' : ''}`}>
                        <span className={`font-medium ${
                          message.type === 'announcement' ? 'text-red-600' :
                          message.type === 'question' ? 'text-purple-600' :
                          message.type === 'feedback' ? 'text-green-600' :
                          'text-blue-600'
                        }`}>
                          {message.type}
                        </span>
                        {app && (
                          <span className="text-gray-500">
                            {app.icon} {app.name}
                          </span>
                        )}
                        {message.tags?.map((tag) => (
                          <span key={tag} className="text-gray-500">#{tag}</span>
                        ))}
                      </div>

                      {/* Reactions and Actions */}
                      <div className={`mt-2 flex items-center space-x-2 ${isOwnMessage ? 'justify-end' : ''}`}>
                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex items-center space-x-1">
                            {Object.entries(
                              message.reactions.reduce((acc, r) => {
                                acc[r.emoji] = (acc[r.emoji] || 0) + 1
                                return acc
                              }, {} as Record<string, number>)
                            ).map(([emoji, count]) => (
                              <button
                                key={emoji}
                                onClick={() => onReaction(message.id, emoji)}
                                className="px-2 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200"
                              >
                                {emoji} {count}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
                            className="text-gray-400 hover:text-gray-600 text-xs"
                          >
                            React
                          </button>
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => onPin(message.id)}
                              className="text-gray-400 hover:text-gray-600 text-xs"
                            >
                              {message.isPinned ? 'Unpin' : 'Pin'}
                            </button>
                          )}
                        </div>

                        {/* Emoji Picker */}
                        {showEmojiPicker === message.id && (
                          <div className="absolute mt-8 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex space-x-1">
                            {emojis.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => {
                                  onReaction(message.id, emoji)
                                  setShowEmojiPicker(null)
                                }}
                                className="hover:bg-gray-100 p-1 rounded"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-gray-200">
          {/* Message Type and Options */}
          <div className="mb-3 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {messageTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setMessageType(type.value)}
                  className={`
                    px-3 py-1 text-sm font-medium rounded-full flex items-center space-x-1
                    ${messageType === type.value
                      ? 'bg-sukut-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                  disabled={type.value === 'announcement' && user?.role !== 'admin'}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>

            <select
              value={selectedApp}
              onChange={(e) => setSelectedApp(e.target.value)}
              className="input text-sm"
            >
              <option value="">Select app (optional)</option>
              {SUKUT_APPS.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.icon} {app.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="input text-sm flex-1"
            />
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Type your ${messageType}...`}
              className="input flex-1"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="btn btn-primary"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullChatModal