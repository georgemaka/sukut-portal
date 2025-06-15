import React, { useState, useRef, useEffect } from 'react'
import { ChatMessage, MessageType } from '../../types'
import { useAuth } from '../../context/AuthContext'
import { getRoleInfo } from '../../config/roles'

interface EmbeddedChatProps {
  messages: ChatMessage[]
  onSendMessage: (content: string, type: MessageType, tags?: string[], appId?: string) => void
  onReaction: (messageId: string, emoji: string) => void
}

const EmbeddedChat: React.FC<EmbeddedChatProps> = ({
  messages,
  onSendMessage,
  onReaction
}) => {
  const { state } = useAuth()
  const { user } = state
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [newMessage, setNewMessage] = useState('')
  const [messageType] = useState<MessageType>('comment')

  const emojis = ['👍', '❤️', '😊', '🎉', '🤔', '👏']

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    onSendMessage(newMessage.trim(), messageType)
    setNewMessage('')
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getUserDisplayName = (msg: ChatMessage) => {
    if (msg.userRole) {
      const roleInfo = getRoleInfo(msg.userRole)
      return `${msg.userName} (${roleInfo?.name || msg.userRole})`
    }
    return msg.userName
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Team Chat</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.userId === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md ${message.userId === user?.id ? 'order-1' : ''}`}>
                <div className={`rounded-lg px-4 py-2 ${
                  message.userId === user?.id
                    ? 'bg-sukut-primary text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className={`text-xs font-medium ${
                      message.userId === user?.id ? 'text-blue-100' : 'text-gray-600'
                    }`}>
                      {getUserDisplayName(message)}
                    </span>
                    <span className={`text-xs ml-2 ${
                      message.userId === user?.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                  
                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(
                        message.reactions.reduce((acc, reaction) => {
                          if (!acc[reaction.emoji]) {
                            acc[reaction.emoji] = { count: 0, userIds: [] };
                          }
                          acc[reaction.emoji].count++;
                          acc[reaction.emoji].userIds.push(reaction.userId);
                          return acc;
                        }, {} as Record<string, { count: number; userIds: string[] }>)
                      ).map(([emoji, data]) => (
                        <button
                          key={emoji}
                          onClick={() => onReaction(message.id, emoji)}
                          className={`text-xs px-2 py-1 rounded-full ${
                            data.userIds.includes(user?.id || '')
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-200 text-gray-700'
                          } hover:bg-opacity-80`}
                        >
                          {emoji} {data.count}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Quick reactions */}
                <div className="flex items-center gap-1 mt-1">
                  {emojis.slice(0, 3).map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => onReaction(message.id, emoji)}
                      className="text-xs p-1 hover:bg-gray-100 rounded"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sukut-primary focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-sukut-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default EmbeddedChat