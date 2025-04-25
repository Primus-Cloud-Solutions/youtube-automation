import { NextResponse } from 'next/server';

// Middleware to handle API errors consistently
export async function withErrorHandling(handler)  {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error('API Error:', error);
      
      // Determine if this is a known error type or an unexpected error
      if (error.code && error.status) {
        return createApiError(error.message, error.status, error.code);
      }
      
      // Handle unexpected errors
      return createApiError(
        'An unexpected error occurred',
        500,
        'INTERNAL_SERVER_ERROR'
      );
    }
  };
}

// Helper to create consistent API responses
export async function createApiResponse(data, status = 200) {
  return NextResponse.json(
    { success: true, ...data },
    { 
      status,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );
}

// Helper to create consistent error responses
export async function createApiError(message, status = 400, code = 'BAD_REQUEST') {
  return NextResponse.json(
    { 
      success: false, 
      error: message,
      code 
    },
    { 
      status,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );
}
