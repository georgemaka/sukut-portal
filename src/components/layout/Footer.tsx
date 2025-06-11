import React from 'react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="text-lg">🏗️</div>
              <span className="font-semibold text-gray-900">Sukut Construction</span>
            </div>
            <div className="text-gray-400">|</div>
            <span className="text-gray-600 text-sm">
              Portal v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
            </span>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <a 
              href="#" 
              className="hover:text-sukut-primary transition-colors"
            >
              Support
            </a>
            <a 
              href="#" 
              className="hover:text-sukut-primary transition-colors"
            >
              Documentation
            </a>
            <a 
              href="#" 
              className="hover:text-sukut-primary transition-colors"
            >
              Privacy Policy
            </a>
          </div>

          <div className="text-sm text-gray-500">
            © {currentYear} Sukut Construction. All rights reserved.
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 space-y-2 sm:space-y-0">
            <div>
              Built with React, TypeScript, and Tailwind CSS
            </div>
            <div className="flex items-center space-x-4">
              <span>System Status: 🟢 All Systems Operational</span>
              <span>Last Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer