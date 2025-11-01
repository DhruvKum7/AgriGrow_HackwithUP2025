import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import { User, LogOut, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

interface AuthProviderProps {
  children?: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isAuthenticated, loading, signIn, signOut } = useAuth()
  const { language } = useLanguage() // removed unused `t`

  const handleLogin = async () => {
    try {
      await signIn()
      toast.success(language === 'hi' ? 'सफलतापूर्वक लॉगिन हो गए!' : 'Successfully logged in!')
    } catch {
      toast.error(language === 'hi' ? 'लॉगिन में समस्या हुई' : 'Login failed')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success(language === 'hi' ? 'सफलतापूर्वक लॉगआउट हो गए!' : 'Successfully logged out!')
    } catch {
      toast.error(language === 'hi' ? 'लॉगआउट में समस्या हुई' : 'Logout failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {language === 'hi' ? 'एग्रीग्रो में आपका स्वागत है' : 'Welcome to AgriGrow'}
            </h1>

            <p className="text-gray-600 mb-8">
              {language === 'hi'
                ? 'कृपया अपने खाते में लॉगिन करें या नया खाता बनाएं। ईमेल और मोबाइल OTP के साथ सुरक्षित प्रवेश।'
                : 'Please login to your account or create a new one. Secure access with email and mobile OTP verification.'}
            </p>

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <User className="w-5 h-5 mr-3" />
              {language === 'hi' ? 'लॉगिन / साइन अप करें' : 'Login / Sign Up'}
            </button>

            <div className="mt-6 text-sm text-gray-500">
              <p>
                {language === 'hi'
                  ? '🔐 सुरक्षित लॉगिन • 📱 मोबाइल OTP • 📧 ईमेल सत्यापन'
                  : '🔐 Secure Login • 📱 Mobile OTP • 📧 Email Verification'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {language === 'hi' ? 'स्वागत है' : 'Welcome'}
                  {user?.userName ? `, ${user.userName}` : ''}
                </p>
                <p className="text-xs text-gray-500">
                  {(user?.userRole ?? 'User')}{user?.email ? ` • ${user.email}` : ''}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {language === 'hi' ? 'लॉगआउट' : 'Logout'}
            </button>
          </div>
        </div>
      </div>

      {children}
    </div>
  )
}
