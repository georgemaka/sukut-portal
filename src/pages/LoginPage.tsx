import React from 'react'
import LoginForm from '../components/auth/LoginForm'

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sukut-primary to-blue-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏗️</div>
          <h1 className="text-3xl font-bold text-white mb-2">Sukut Portal</h1>
          <p className="text-blue-100">Access your construction management tools</p>
        </div>
        
        <div className="card p-8">
          <LoginForm />
        </div>
        
        <div className="text-center mt-6">
          <p className="text-blue-100 text-sm">
            © 2024 Sukut Construction. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage