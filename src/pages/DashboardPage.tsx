import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'
import AppGrid from '../components/apps/AppGrid'
import AnnouncementBanner from '../components/chat/AnnouncementBanner'
import ActivityFeed from '../components/chat/ActivityFeed'
import ChatBubble from '../components/chat/ChatBubble'
import FullChatModal from '../components/chat/FullChatModal'

const DashboardPage: React.FC = () => {
  const { state } = useAuth()
  const { user } = state
  const { 
    state: chatState, 
    dismissAnnouncement,
    toggleActivityFeed,
    toggleChatModal,
    sendMessage,
    addReaction,
    togglePin,
    markAsRead
  } = useChat()

  // Get the latest non-dismissed announcement
  const currentAnnouncement = chatState.announcements.find(ann => 
    !ann.dismissedBy.includes(user?.id || '') &&
    (!ann.expiresAt || new Date(ann.expiresAt) > new Date())
  )

  return (
    <>
      {/* Announcement Banner */}
      <AnnouncementBanner 
        announcement={currentAnnouncement || null}
        onDismiss={dismissAnnouncement}
      />

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Access your applications
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Applications</h2>
          <AppGrid />
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed
        messages={chatState.messages}
        isOpen={chatState.isActivityFeedOpen}
        onToggle={toggleActivityFeed}
        onOpenChat={toggleChatModal}
        onMessageClick={(message) => {
          markAsRead(message.id)
          toggleChatModal()
        }}
      />

      {/* Chat Bubble */}
      <ChatBubble
        unreadCount={chatState.unreadCount}
        onClick={toggleChatModal}
        isOpen={chatState.isChatModalOpen}
      />

      {/* Full Chat Modal */}
      <FullChatModal
        isOpen={chatState.isChatModalOpen}
        onClose={toggleChatModal}
        messages={chatState.messages}
        onSendMessage={sendMessage}
        onReaction={addReaction}
        onPin={togglePin}
      />
    </>
  )
}

export default DashboardPage