'use server';

import { NextResponse } from 'next/server';

// Middleware to handle API errors consistently
export function withErrorHandling(handler) {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error('API Error:', error);
      
      // Return a properly formatted JSON error response
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'An unexpected error occurred',
          code: error.code || 'INTERNAL_SERVER_ERROR'
        }, 
        { 
          status: error.status || 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  };
}

// Helper to validate request body against a schema
export async function validateRequest(request, schema) {
  try {
    const body = await request.json();
    
    // Simple validation - check required fields
    if (schema) {
      for (const field of schema.required || []) {
        if (body[field] === undefined) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
    }
    
    return { body, valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: error.message || 'Invalid request body'
    };
  }
}

// Helper to create consistent API responses
export function createApiResponse(data, status = 200) {
  return NextResponse.json(
    { success: true, ...data },
    { 
      status,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

// Helper to create consistent error responses
export function createApiError(message, status = 400, code = 'BAD_REQUEST') {
  return NextResponse.json(
    { 
      success: false, 
      error: message,
      code
    },
    { 
      status,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
