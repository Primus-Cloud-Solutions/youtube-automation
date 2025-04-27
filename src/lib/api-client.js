// This file contains client-side API fetching functions for static export
// It replaces direct server API calls with Netlify Function calls

/**
 * Base function to fetch data from API endpoints
 */
export async function fetchFromApi(endpoint, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const url = `${baseUrl}/.netlify/functions/${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Authentication API functions
 */
export async function loginUser(email, password) {
  return fetchFromApi('auth-login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(email, password, name) {
  return fetchFromApi('auth-register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

export async function logoutUser() {
  return fetchFromApi('auth-logout', {
    method: 'POST',
  });
}

export async function checkAuthStatus() {
  return fetchFromApi('auth-check');
}

export async function socialLogin(provider) {
  return fetchFromApi('social-login', {
    method: 'POST',
    body: JSON.stringify({ provider }),
  });
}

/**
 * Payment API functions
 */
export async function getPlans() {
  return fetchFromApi('api', {
    method: 'POST',
    body: JSON.stringify({ 
      path: '/payment',
      action: 'get-plans' 
    }),
  });
}

export async function getSubscription(userId) {
  return fetchFromApi('api', {
    method: 'POST',
    body: JSON.stringify({ 
      path: '/payment',
      action: 'get-subscription',
      userId 
    }),
  });
}

export async function createCheckout(planId, userId) {
  return fetchFromApi('api', {
    method: 'POST',
    body: JSON.stringify({ 
      path: '/payment',
      action: 'create-checkout',
      planId,
      userId 
    }),
  });
}

/**
 * Storage API functions
 */
export async function getStorageFiles(userId) {
  return fetchFromApi('api', {
    method: 'POST',
    body: JSON.stringify({ 
      path: '/storage',
      userId 
    }),
  });
}

export async function deleteStorageFile(fileId, userId) {
  return fetchFromApi('api', {
    method: 'POST',
    body: JSON.stringify({ 
      path: '/storage',
      action: 'delete',
      fileId,
      userId 
    }),
  });
}

/**
 * YouTube API functions
 */
export async function getYoutubeVideos(userId) {
  return fetchFromApi('api', {
    method: 'POST',
    body: JSON.stringify({ 
      path: '/youtube',
      userId 
    }),
  });
}

export async function uploadYoutubeVideo(videoData, userId) {
  return fetchFromApi('api', {
    method: 'POST',
    body: JSON.stringify({ 
      path: '/youtube',
      action: 'upload',
      videoData,
      userId 
    }),
  });
}

/**
 * Viral Video API functions
 */
export async function searchViralVideos(topic, userId) {
  return fetchFromApi('api', {
    method: 'POST',
    body: JSON.stringify({ 
      path: '/viral-video',
      action: 'search',
      topic,
      userId 
    }),
  });
}

export async function processViralVideo(videoId, options, userId) {
  return fetchFromApi('api', {
    method: 'POST',
    body: JSON.stringify({ 
      path: '/viral-video',
      action: 'process',
      videoId,
      options,
      userId 
    }),
  });
}
