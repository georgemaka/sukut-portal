import React from 'react'

interface ChatBubbleProps {
  unreadCount: number
  onClick: () => void
  isOpen: boolean
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ unreadCount, onClick, isOpen }) => {
  if (isOpen) return null // Don't show bubble when chat modal is open

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-sukut-primary hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-110 z-50"
      aria-label="Open chat"
    >
      <div className="relative">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </div>
    </button>
  )
}

export default ChatBubble