'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { auth, userProfiles } from '../../../supabase-auth-setup'
import { useRouter } from 'next/navigation'

// Create auth context
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for existing session
        const session = await auth.getSession()
        
        if (session?.session) {
          const userData = await auth.getUser()
          setUser(userData)
          
          // Get user profile
          if (userData) {
            const userProfile = await userProfiles.getProfile(userData.id)
            setProfile(userProfile)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    initAuth()
    
    // Set up auth state listener
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const userData = await auth.getUser()
          setUser(userData)
          
          // Get user profile
          if (userData) {
            const userProfile = await userProfiles.getProfile(userData.id)
            setProfile(userProfile)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )
    
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])
  
  // Sign up function
  const signUp = async (email, password, fullName) => {
    try {
      const { user: newUser } = await auth.signUp(email, password)
      
      if (newUser) {
        // Create user profile
        await userProfiles.createProfile(newUser.id, { full_name: fullName })
        
        // Get updated user and profile
        const userData = await auth.getUser()
        setUser(userData)
        
        if (userData) {
          const userProfile = await userProfiles.getProfile(userData.id)
          setProfile(userProfile)
        }
        
        return { success: true, user: newUser }
      }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Sign in function
  const signIn = async (email, password) => {
    try {
      const { user: signedInUser } = await auth.signIn(email, password)
      
      if (signedInUser) {
        // Get user profile
        const userProfile = await userProfiles.getProfile(signedInUser.id)
        setProfile(userProfile)
        
        return { success: true, user: signedInUser }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Sign out function
  const signOut = async () => {
    try {
      await auth.signOut()
      router.push('/login')
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Check if user has active subscription
  const hasActiveSubscription = async () => {
    if (!user) return false
    
    try {
      return await userProfiles.hasActiveSubscription(user.id)
    } catch (error) {
      console.error('Subscription check error:', error)
      return false
    }
  }
  
  // Check if user is admin
  const isAdmin = async () => {
    if (!user) return false
    
    try {
      return profile?.role === 'admin'
    } catch (error) {
      console.error('Admin check error:', error)
      return false
    }
  }
  
  // Update user profile
  const updateUserProfile = async (updates) => {
    if (!user) return { success: false, error: 'Not authenticated' }
    
    try {
      await userProfiles.updateProfile(user.id, updates)
      
      // Get updated profile
      const updatedProfile = await userProfiles.getProfile(user.id)
      setProfile(updatedProfile)
      
      return { success: true, profile: updatedProfile }
    } catch (error) {
      console.error('Profile update error:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Reset password
  const resetPassword = async (email) => {
    try {
      await auth.resetPassword(email)
      return { success: true }
    } catch (error) {
      console.error('Password reset error:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Update password
  const updatePassword = async (newPassword) => {
    try {
      await auth.updatePassword(newPassword)
      return { success: true }
    } catch (error) {
      console.error('Password update error:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Auth context value
  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    hasActiveSubscription,
    isAdmin,
    updateUserProfile,
    resetPassword,
    updatePassword
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Auth hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
