'use client'

import { createContext, useContext, useState } from 'react'
import { stripePayment } from '../../../stripe-payment-integration'
import { useAuth } from './auth-context'

// Create subscription context
const SubscriptionContext = createContext(null)

export function SubscriptionProvider({ children }) {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState(null)
  
  // Get current subscription
  const getSubscription = async () => {
    if (!user) return null
    
    try {
      setLoading(true)
      const sub = await stripePayment.getSubscription(user.id)
      setSubscription(sub)
      return sub
    } catch (error) {
      console.error('Error getting subscription:', error)
      return null
    } finally {
      setLoading(false)
    }
  }
  
  // Create checkout session for new subscription
  const createCheckoutSession = async () => {
    if (!user) return { success: false, error: 'Not authenticated' }
    
    try {
      setLoading(true)
      const session = await stripePayment.createCheckoutSession(user.id, user.email)
      return { success: true, url: session.url }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }
  
  // Create customer portal session for managing subscription
  const createCustomerPortalSession = async () => {
    if (!user) return { success: false, error: 'Not authenticated' }
    
    try {
      setLoading(true)
      const session = await stripePayment.createCustomerPortalSession(user.id)
      return { success: true, url: session.url }
    } catch (error) {
      console.error('Error creating customer portal session:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }
  
  // Cancel subscription
  const cancelSubscription = async () => {
    if (!user) return { success: false, error: 'Not authenticated' }
    
    try {
      setLoading(true)
      await stripePayment.cancelSubscription(user.id)
      
      // Refresh subscription data
      await getSubscription()
      
      return { success: true }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }
  
  // Reactivate subscription
  const reactivateSubscription = async () => {
    if (!user) return { success: false, error: 'Not authenticated' }
    
    try {
      setLoading(true)
      await stripePayment.reactivateSubscription(user.id)
      
      // Refresh subscription data
      await getSubscription()
      
      return { success: true }
    } catch (error) {
      console.error('Error reactivating subscription:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }
  
  // Check if user has active subscription
  const hasActiveSubscription = () => {
    if (!profile) return false
    return profile.subscription_status === 'active'
  }
  
  // Format subscription end date
  const formatSubscriptionEndDate = () => {
    if (!subscription?.current_period_end) return ''
    
    return new Date(subscription.current_period_end).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  // Subscription context value
  const value = {
    subscription,
    loading,
    getSubscription,
    createCheckoutSession,
    createCustomerPortalSession,
    cancelSubscription,
    reactivateSubscription,
    hasActiveSubscription,
    formatSubscriptionEndDate
  }
  
  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

// Subscription hook
export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}
