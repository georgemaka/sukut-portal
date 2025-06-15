import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'
import AppGrid from '../components/apps/AppGrid'
import AnnouncementBanner from '../components/chat/AnnouncementBanner'
import ActivityFeed from '../components/chat/ActivityFeed'
import EmbeddedChat from '../components/chat/EmbeddedChat'

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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Applications section - spans 2 columns on xl screens */}
          <div className="xl:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Applications</h2>
            <AppGrid />
          </div>

          {/* Chat section - spans 1 column on xl screens */}
          <div className="xl:col-span-1">
            <EmbeddedChat
              messages={chatState.messages}
              onSendMessage={sendMessage}
              onReaction={addReaction}
            />
          </div>
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
        }}
      />
    </>
  )
}

export default DashboardPage