import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getRoleInfo } from '../../config/roles'

const Header: React.FC = () => {
  const { state, logout } = useAuth()
  const { user } = state
  const location = useLocation()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  if (!user) return null

  const roleInfo = getRoleInfo(user.role)

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <div className="text-xl font-bold text-sukut-primary">Sukut Portal</div>
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link
                to="/"
                className={isActive('/') ? 'nav-link-active' : 'nav-link'}
              >
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={isActive('/admin') ? 'nav-link-active' : 'nav-link'}
                >
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-3 text-left p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-sukut-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div className="hidden sm:block">
                  <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                  <div className={`text-sm ${roleInfo?.color} font-medium`}>
                    {roleInfo?.name}
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Settings
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-4 py-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') ? 'text-sukut-primary bg-blue-50' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Dashboard
          </Link>
          {user.role === 'admin' && (
            <Link
              to="/admin"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/admin') ? 'text-sukut-primary bg-blue-50' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Admin Panel
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header