import React, { createContext, useContext, useState, useEffect } from 'react'
import { ChatState, ChatMessage, Announcement, MessageType, MessageReaction } from '../types'
import { useAuth } from './AuthContext'

// Mock data for demonstration
const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    userId: 'user-2',
    userName: 'Sarah Manager',
    userRole: 'manager',
    content: 'Great work on the Market Forecast dashboard! The new features are really helpful.',
    type: 'comment',
    appId: 'market-forecast',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    reactions: [
      { emoji: '👍', userId: 'user-1', userName: 'John Admin' },
      { emoji: '❤️', userId: 'user-3', userName: 'Mike Foreman' }
    ]
  },
  {
    id: '2',
    userId: 'user-3',
    userName: 'Mike Foreman',
    userRole: 'foreman',
    content: 'Is there a way to export the revenue projections to Excel?',
    type: 'question',
    appId: 'market-forecast',
    tags: ['export', 'excel'],
    timestamp: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '3',
    userId: 'user-1',
    userName: 'John Admin',
    userRole: 'admin',
    content: 'System maintenance scheduled for this Friday at 5 PM PST. Please save your work before then.',
    type: 'announcement',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isPinned: true
  }
]

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    content: 'New Deferred Rent app will be available next week! Get ready for streamlined rent management.',
    priority: 'medium',
    createdBy: 'admin@sukut.com',
    createdAt: new Date().toISOString(),
    dismissedBy: []
  }
]

interface ChatContextType {
  state: ChatState
  sendMessage: (content: string, type: MessageType, tags?: string[], appId?: string) => void
  addReaction: (messageId: string, emoji: string) => void
  togglePin: (messageId: string) => void
  dismissAnnouncement: (announcementId: string) => void
  toggleActivityFeed: () => void
  toggleChatModal: () => void
  markAsRead: (messageId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

interface ChatProviderProps {
  children: React.ReactNode
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { state: authState } = useAuth()
  const { user } = authState

  const [state, setState] = useState<ChatState>({
    messages: MOCK_MESSAGES,
    announcements: MOCK_ANNOUNCEMENTS,
    unreadCount: 2,
    isActivityFeedOpen: false,
    isChatModalOpen: false
  })

  // Calculate unread count
  useEffect(() => {
    const unread = state.messages.filter(m => !m.isRead && m.userId !== user?.id).length
    setState(prev => ({ ...prev, unreadCount: unread }))
  }, [state.messages, user])

  const sendMessage = (content: string, type: MessageType, tags?: string[], appId?: string) => {
    if (!user) return

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      content,
      type,
      tags,
      appId,
      timestamp: new Date().toISOString(),
      isRead: true
    }

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }))

    // If it's an announcement from admin, also add to announcements
    if (type === 'announcement' && user.role === 'admin') {
      const newAnnouncement: Announcement = {
        id: `ann-${Date.now()}`,
        content,
        priority: 'medium',
        createdBy: user.email,
        createdAt: new Date().toISOString(),
        dismissedBy: []
      }
      setState(prev => ({
        ...prev,
        announcements: [...prev.announcements, newAnnouncement]
      }))
    }
  }

  const addReaction = (messageId: string, emoji: string) => {
    if (!user) return

    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => {
        if (msg.id !== messageId) return msg

        const reactions = msg.reactions || []
        const existingReaction = reactions.find(
          r => r.userId === user.id && r.emoji === emoji
        )

        if (existingReaction) {
          // Remove reaction
          return {
            ...msg,
            reactions: reactions.filter(
              r => !(r.userId === user.id && r.emoji === emoji)
            )
          }
        } else {
          // Add reaction
          const newReaction: MessageReaction = {
            emoji,
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`
          }
          return {
            ...msg,
            reactions: [...reactions, newReaction]
          }
        }
      })
    }))
  }

  const togglePin = (messageId: string) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg =>
        msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
      )
    }))
  }

  const dismissAnnouncement = (announcementId: string) => {
    if (!user) return

    setState(prev => ({
      ...prev,
      announcements: prev.announcements.map(ann =>
        ann.id === announcementId
          ? { ...ann, dismissedBy: [...ann.dismissedBy, user.id] }
          : ann
      )
    }))
  }

  const toggleActivityFeed = () => {
    setState(prev => ({
      ...prev,
      isActivityFeedOpen: !prev.isActivityFeedOpen
    }))
  }

  const toggleChatModal = () => {
    setState(prev => ({
      ...prev,
      isChatModalOpen: !prev.isChatModalOpen
    }))
  }

  const markAsRead = (messageId: string) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    }))
  }

  const value: ChatContextType = {
    state,
    sendMessage,
    addReaction,
    togglePin,
    dismissAnnouncement,
    toggleActivityFeed,
    toggleChatModal,
    markAsRead
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}