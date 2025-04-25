'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const ApiTestDashboard = () => {
  const [endpoints] = useState([
    { name: 'Session Check', url: '/api/auth?action=session', method: 'GET' },
    { name: 'Login Demo', url: '/api/auth', method: 'POST', body: { action: 'signin', email: 'test@example.com', password: 'password123' } },
    { name: 'Content API', url: '/api/content', method: 'GET' },
    { name: 'Analytics API', url: '/api/analytics', method: 'GET' }
  ]);
  
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [activeTest, setActiveTest] = useState(null);

  const testEndpoint = async (endpoint, index) => {
    setLoading(prev => ({ ...prev, [index]: true }));
    setErrors(prev => ({ ...prev, [index]: null }));
    setActiveTest(index);
    
    try {
      const options = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      if (endpoint.method !== 'GET' && endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }
      
      const response = await fetch(endpoint.url, options);
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType}`);
      }
      
      const data = await response.json();
      setResults(prev => ({
        ...prev,
        [index]: {
          status: response.status,
          contentType,
          data
        }
      }));
    } catch (err) {
      setErrors(prev => ({ ...prev, [index]: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">API Endpoint Tester</h1>
          <Link href="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded">
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test API Endpoints</h2>
          <p className="mb-4">This page tests the API endpoints to ensure they return proper JSON responses with the correct content type headers.</p>
          
          <div className="grid gap-6 mt-6">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{endpoint.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span className={`mr-2 px-2 py-1 rounded ${endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {endpoint.method}
                      </span>
                      <code>{endpoint.url}</code>
                    </div>
                  </div>
                  <button 
                    onClick={() => testEndpoint(endpoint, index)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    disabled={loading[index]}
                  >
                    {loading[index] ? 'Testing...' : 'Test Endpoint'}
                  </button>
                </div>
                
                {errors[index] && (
                  <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <h4 className="font-bold">Error:</h4>
                    <pre className="mt-2 whitespace-pre-wrap text-sm">{errors[index]}</pre>
                  </div>
                )}
                
                {results[index] && (
                  <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    <h4 className="font-bold">Response:</h4>
                    <div className="mt-2 text-sm">
                      <p><strong>Status:</strong> {results[index].status}</p>
                      <p><strong>Content-Type:</strong> {results[index].contentType}</p>
                      <div className="mt-2">
                        <strong>Data:</strong>
                        <pre className="mt-1 bg-gray-100 p-2 rounded whitespace-pre-wrap">
                          {JSON.stringify(results[index].data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>If you see <strong>"Unexpected token '&lt;', "<!DOCTYPE "... is not valid JSON"</strong>, it means HTML is being returned instead of JSON</li>
            <li>Check that the Content-Type header is set to application/json in API responses</li>
            <li>Verify that Netlify is configured to use the Next.js plugin for serverless functions</li>
            <li>Ensure API routes are properly redirected in netlify.toml</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiTestDashboard;
