import React from 'react'
import { Announcement } from '../../types'
import { useAuth } from '../../context/AuthContext'

interface AnnouncementBannerProps {
  announcement: Announcement | null
  onDismiss: (announcementId: string) => void
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ announcement, onDismiss }) => {
  const { state } = useAuth()
  const { user } = state

  if (!announcement || !user) return null

  // Check if user has already dismissed this announcement
  if (announcement.dismissedBy.includes(user.id)) return null

  // Check if announcement has expired
  if (announcement.expiresAt && new Date(announcement.expiresAt) < new Date()) return null

  const getPriorityStyles = () => {
    switch (announcement.priority) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getPriorityIcon = () => {
    switch (announcement.priority) {
      case 'high':
        return '🚨'
      case 'medium':
        return '⚠️'
      case 'low':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  return (
    <div className={`border-b ${getPriorityStyles()} transition-all duration-300 ease-in-out`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{getPriorityIcon()}</span>
            <p className="font-medium">{announcement.content}</p>
          </div>
          <button
            onClick={() => onDismiss(announcement.id)}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss announcement"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementBanner