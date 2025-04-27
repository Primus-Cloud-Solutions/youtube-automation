// This file contains the Netlify Functions handler for API routes
const { createRequestHandler } = require('next-server/dist/server/next-server');
const path = require('path');

// Create a Next.js request handler
const nextApp = createRequestHandler({
  dir: path.join(__dirname, '../../'),
  conf: require('../../next.config.js'),
  dev: false,
});

// Export the handler function for Netlify Functions
exports.handler = async (event, context) => {
  // Extract the path from the event
  const { path: requestPath } = event;
  
  // Remove the /.netlify/functions/api prefix to get the actual API path
  const apiPath = requestPath.replace('/.netlify/functions/api', '/api');
  
  // Create a modified event with the correct path
  const modifiedEvent = {
    ...event,
    path: apiPath,
  };
  
  try {
    // Pass the request to the Next.js handler
    return await nextApp(modifiedEvent, context);
  } catch (error) {
    console.error('API route error:', error);
    
    // Return a fallback response for errors
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};
