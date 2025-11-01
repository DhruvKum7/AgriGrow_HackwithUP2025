
import { useState, useEffect } from 'react'
import { lumi } from '../lib/lumi'

interface User {
  projectId: string
  userId: string
  email: string
  userName: string
  userRole: 'ADMIN' | 'USER'
  createdTime: string
  accessToken: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(lumi.auth.user)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check existing session
    const checkSession = () => {
      const existingUser = lumi.auth.user
      const isLoggedIn = lumi.auth.isAuthenticated

      if (isLoggedIn && existingUser) {
        setUser(existingUser)
      }
    }

    checkSession()

    // Listen to state changes
    const unsubscribe = lumi.auth.onAuthChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async () => {
    try {
      setLoading(true)
      await lumi.auth.signIn()
    } catch (error) {
      console.error('Login failed:', error)
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(false)
      await lumi.auth.signOut()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return {
    user,
    isAuthenticated: !!user,
    userRole: user?.userRole,
    loading,
    signIn: login,
    signOut: logout
  }
}
