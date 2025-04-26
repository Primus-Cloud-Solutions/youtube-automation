export const createApiResponse = (data) => {
  return Response.json({ success: true, ...data });
};

export const createApiError = (message, status = 400) => {
  return Response.json({ success: false, error: message }, { status });
};

export const withErrorHandling = (handler) => {
  return async (request) => {
    try {
      return await handler(request);
    } catch (error) {
      console.error('API error:', error);
      return createApiError('Internal server error', 500);
    }
  };
};