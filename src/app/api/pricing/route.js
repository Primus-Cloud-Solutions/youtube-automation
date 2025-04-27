import { createApiResponse, createApiError } from '../../../lib/api-helpers';

/**
 * Pricing API
 * This API handles pricing plans and subscription management
 */

// Define pricing plans
const PRICING_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    billingCycle: 'monthly',
    features: [
      'Connect to 1 YouTube channel',
      'Generate up to 5 videos per month',
      'Basic content research',
      'Manual scheduling',
      'Standard video quality'
    ],
    limits: {
      channels: 1,
      videosPerMonth: 5,
      niches: 1,
      platforms: ['youtube']
    }
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 29.99,
    billingCycle: 'monthly',
    features: [
      'Connect to 1 YouTube channel',
      'Generate up to 20 videos per month',
      'Advanced content research',
      'Automated scheduling',
      'HD video quality',
      'Email support'
    ],
    limits: {
      channels: 1,
      videosPerMonth: 20,
      niches: 3,
      platforms: ['youtube']
    }
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 79.99,
    billingCycle: 'monthly',
    features: [
      'Connect to 3 YouTube channels',
      'Generate up to 50 videos per month',
      'Advanced content research with trend analysis',
      'Multi-platform content (YouTube, Facebook, Instagram)',
      'Automated scheduling with optimization',
      '4K video quality',
      'Priority email support',
      'Channel performance analytics'
    ],
    limits: {
      channels: 3,
      videosPerMonth: 50,
      niches: 5,
      platforms: ['youtube', 'facebook', 'instagram']
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199.99,
    billingCycle: 'monthly',
    features: [
      'Automated YouTube channel creation',
      'Connect to unlimited YouTube channels',
      'Generate up to 200 videos per month',
      'Advanced content research with AI recommendations',
      'Multi-platform content (All supported platforms)',
      'Custom branding and thumbnails',
      'Advanced scheduling with audience optimization',
      '4K video quality with premium effects',
      'Dedicated account manager',
      'Comprehensive analytics dashboard',
      'White-label option'
    ],
    limits: {
      channels: 'unlimited',
      videosPerMonth: 200,
      niches: 'unlimited',
      platforms: ['youtube', 'facebook', 'instagram', 'tiktok', 'twitter']
    }
  }
};

// API route handler
export async function GET(request) {
  try {
    // Get pricing plans
    return createApiResponse({
      plans: PRICING_PLANS
    });
  } catch (error) {
    console.error('Pricing API error:', error);
    return createApiError('Internal server error', 500);
  }
}

export async function POST(request) {
  try {
    const { 
      action, 
      userId,
      planId,
      paymentMethod,
      couponCode
    } = await request.json();
    
    if (!action) {
      return createApiError('Action is required', 400);
    }
    
    // Get available plans
    if (action === 'get-plans') {
      return createApiResponse({
        plans: PRICING_PLANS
      });
    }
    
    // Subscribe to a plan
    if (action === 'subscribe') {
      if (!userId || !planId) {
        return createApiError('User ID and plan ID are required', 400);
      }
      
      // Check if plan exists
      if (!PRICING_PLANS[planId]) {
        return createApiError('Invalid plan ID', 400);
      }
      
      // In a production environment, this would handle payment processing
      // For development, we'll simulate a successful subscription
      
      const plan = PRICING_PLANS[planId];
      const subscriptionId = `sub_${Date.now()}`;
      const startDate = new Date();
      const endDate = new Date();
      
      // Set end date based on billing cycle
      if (plan.billingCycle === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (plan.billingCycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      
      return createApiResponse({
        subscriptionId,
        planId,
        planName: plan.name,
        price: plan.price,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: 'active'
      });
    }
    
    // Cancel subscription
    if (action === 'cancel-subscription') {
      if (!userId) {
        return createApiError('User ID is required', 400);
      }
      
      // In a production environment, this would handle subscription cancellation
      // For development, we'll simulate a successful cancellation
      
      return createApiResponse({
        status: 'cancelled',
        cancellationDate: new Date().toISOString()
      });
    }
    
    // Change plan
    if (action === 'change-plan') {
      if (!userId || !planId) {
        return createApiError('User ID and plan ID are required', 400);
      }
      
      // Check if plan exists
      if (!PRICING_PLANS[planId]) {
        return createApiError('Invalid plan ID', 400);
      }
      
      // In a production environment, this would handle plan changes
      // For development, we'll simulate a successful plan change
      
      const plan = PRICING_PLANS[planId];
      const startDate = new Date();
      const endDate = new Date();
      
      // Set end date based on billing cycle
      if (plan.billingCycle === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (plan.billingCycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      
      return createApiResponse({
        planId,
        planName: plan.name,
        price: plan.price,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: 'active'
      });
    }
    
    // Apply coupon
    if (action === 'apply-coupon') {
      if (!couponCode) {
        return createApiError('Coupon code is required', 400);
      }
      
      // In a production environment, this would validate the coupon
      // For development, we'll simulate a valid coupon
      
      // Check if coupon is valid (mock validation)
      const isValid = couponCode.startsWith('DISCOUNT');
      const discountPercent = isValid ? 20 : 0;
      
      return createApiResponse({
        valid: isValid,
        couponCode,
        discountPercent,
        message: isValid ? 'Coupon applied successfully' : 'Invalid coupon code'
      });
    }
    
    return createApiError('Invalid action', 400);
  } catch (error) {
    console.error('Pricing API error:', error);
    return createApiError('Internal server error', 500);
  }
}
