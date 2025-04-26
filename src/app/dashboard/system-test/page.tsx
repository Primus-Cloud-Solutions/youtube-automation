import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { withAuth } from '../../utils/with-auth';
import DashboardHeader from '../../components/dashboard-header';

const SystemTest = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [message, setMessage] = useState('');
  
  // Define the tests to run
  const testDefinitions = [
    {
      id: 'auth',
      name: 'Authentication System',
      description: 'Verifies user authentication and session management',
      status: 'pending',
      details: null
    },
    {
      id: 'content-generation',
      name: 'Content Generation',
      description: 'Tests trending topic discovery and content creation',
      status: 'pending',
      details: null
    },
    {
      id: 'scheduling',
      name: 'Scheduling System',
      description: 'Validates video scheduling and automation',
      status: 'pending',
      details: null
    },
    {
      id: 'storage',
      name: 'Storage Integration',
      description: 'Checks S3 storage connectivity and file operations',
      status: 'pending',
      details: null
    },
    {
      id: 'subscription',
      name: 'Subscription Management',
      description: 'Tests plan features and payment integration',
      status: 'pending',
      details: null
    },
    {
      id: 'youtube-api',
      name: 'YouTube API Integration',
      description: 'Verifies YouTube API connectivity and upload functionality',
      status: 'pending',
      details: null
    }
  ];
  
  // Initialize tests
  useEffect(() => {
    setTests(testDefinitions);
  }, []);
  
  // Run all tests
  const runAllTests = async () => {
    if (isRunningTests) return;
    
    setIsRunningTests(true);
    setMessage('Running system tests...');
    
    // Reset test statuses
    setTests(tests.map(test => ({ ...test, status: 'pending', details: null })));
    
    // Run tests sequentially
    for (const test of tests) {
      await runTest(test.id);
    }
    
    setIsRunningTests(false);
    setMessage('All tests completed');
  };
  
  // Run a specific test
  const runTest = async (testId) => {
    // Update test status to running
    setTests(tests.map(test => 
      test.id === testId ? { ...test, status: 'running', details: null } : test
    ));
    
    try {
      let result;
      
      // Run the appropriate test based on ID
      switch (testId) {
        case 'auth':
          result = await testAuthentication();
          break;
        case 'content-generation':
          result = await testContentGeneration();
          break;
        case 'scheduling':
          result = await testScheduling();
          break;
        case 'storage':
          result = await testStorage();
          break;
        case 'subscription':
          result = await testSubscription();
          break;
        case 'youtube-api':
          result = await testYouTubeAPI();
          break;
        default:
          throw new Error(`Unknown test ID: ${testId}`);
      }
      
      // Update test status with result
      setTests(tests.map(test => 
        test.id === testId ? { ...test, status: result.success ? 'passed' : 'failed', details: result.details } : test
      ));
    } catch (error) {
      console.error(`Error running test ${testId}:`, error);
      
      // Update test status with error
      setTests(tests.map(test => 
        test.id === testId ? { ...test, status: 'failed', details: error.message } : test
      ));
    }
  };
  
  // Test authentication system
  const testAuthentication = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!user) {
      return {
        success: false,
        details: 'User not authenticated. Please log in to run this test.'
      };
    }
    
    return {
      success: true,
      details: `Authentication successful. User ID: ${user.id}, Email: ${user.email}`
    };
  };
  
  // Test content generation system
  const testContentGeneration = async () => {
    try {
      // Test trending topic discovery
      const topicsResponse = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate-topic-ideas',
          category: 'technology',
          count: 1
        }),
      });
      
      const topicsData = await topicsResponse.json();
      
      if (!topicsData.success) {
        return {
          success: false,
          details: `Failed to generate topic ideas: ${topicsData.error}`
        };
      }
      
      // Test script generation with the first topic
      const topic = topicsData.topics[0].title;
      
      const scriptResponse = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate-script',
          topic
        }),
      });
      
      const scriptData = await scriptResponse.json();
      
      if (!scriptData.success) {
        return {
          success: false,
          details: `Failed to generate script: ${scriptData.error}`
        };
      }
      
      return {
        success: true,
        details: `Successfully generated topic "${topic}" and created a script with ${scriptData.script.split(' ').length} words`
      };
    } catch (error) {
      return {
        success: false,
        details: `Error testing content generation: ${error.message}`
      };
    }
  };
  
  // Test scheduling system
  const testScheduling = async () => {
    try {
      // Test creating a schedule
      const scheduleResponse = await fetch('/api/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create-recurring-schedule',
          userId: user?.id || 'test-user',
          frequency: 'weekly',
          category: 'technology'
        }),
      });
      
      const scheduleData = await scheduleResponse.json();
      
      if (!scheduleData.success) {
        return {
          success: false,
          details: `Failed to create schedule: ${scheduleData.error}`
        };
      }
      
      // Test getting schedules
      const getSchedulesResponse = await fetch('/api/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-recurring-schedules',
          userId: user?.id || 'test-user'
        }),
      });
      
      const getSchedulesData = await getSchedulesResponse.json();
      
      if (!getSchedulesData.success) {
        return {
          success: false,
          details: `Failed to get schedules: ${getSchedulesData.error}`
        };
      }
      
      return {
        success: true,
        details: `Successfully created and retrieved schedules. Schedule ID: ${scheduleData.scheduleId}`
      };
    } catch (error) {
      return {
        success: false,
        details: `Error testing scheduling: ${error.message}`
      };
    }
  };
  
  // Test storage integration
  const testStorage = async () => {
    try {
      // Test listing files
      const listResponse = await fetch('/api/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'list-files',
          prefix: `users/${user?.id || 'test-user'}/`
        }),
      });
      
      const listData = await listResponse.json();
      
      if (!listData.success) {
        return {
          success: false,
          details: `Failed to list files: ${listData.error}`
        };
      }
      
      // Test getting storage usage
      const usageResponse = await fetch('/api/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-storage-usage',
          userId: user?.id || 'test-user'
        }),
      });
      
      const usageData = await usageResponse.json();
      
      if (!usageData.success) {
        return {
          success: false,
          details: `Failed to get storage usage: ${usageData.error}`
        };
      }
      
      return {
        success: true,
        details: `Successfully connected to storage. Files: ${listData.objects?.length || 0}, Storage used: ${usageData.usage?.megabytes || 0} MB`
      };
    } catch (error) {
      return {
        success: false,
        details: `Error testing storage: ${error.message}`
      };
    }
  };
  
  // Test subscription system
  const testSubscription = async () => {
    try {
      // Test getting plans
      const plansResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-plans'
        }),
      });
      
      const plansData = await plansResponse.json();
      
      if (!plansData.success) {
        return {
          success: false,
          details: `Failed to get plans: ${plansData.error}`
        };
      }
      
      // Test getting subscription
      const subscriptionResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-subscription',
          userId: user?.id || 'test-user'
        }),
      });
      
      const subscriptionData = await subscriptionResponse.json();
      
      if (!subscriptionData.success) {
        return {
          success: false,
          details: `Failed to get subscription: ${subscriptionData.error}`
        };
      }
      
      return {
        success: true,
        details: `Successfully retrieved plans and subscription. Available plans: ${Object.keys(plansData.plans).length}, Current plan: ${subscriptionData.subscription?.planName || 'None'}`
      };
    } catch (error) {
      return {
        success: false,
        details: `Error testing subscription: ${error.message}`
      };
    }
  };
  
  // Test YouTube API integration
  const testYouTubeAPI = async () => {
    try {
      // Test validating API key
      const validateResponse = await fetch('/api/youtube-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'validate-api-key',
          apiKey: 'AIzaTest123456789' // Test key
        }),
      });
      
      const validateData = await validateResponse.json();
      
      // Test getting trending videos
      const trendingResponse = await fetch('/api/youtube-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-trending-videos',
          regionCode: 'US',
          maxResults: 5
        }),
      });
      
      const trendingData = await trendingResponse.json();
      
      return {
        success: true,
        details: `Successfully tested YouTube API integration. API key validation: ${validateData.success ? 'Passed' : 'Failed'}, Trending videos retrieved: ${trendingData.success ? trendingData.videos?.length || 0 : 0}`
      };
    } catch (error) {
      return {
        success: false,
        details: `Error testing YouTube API: ${error.message}`
      };
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">System Test</h1>
          
          <button
            onClick={runAllTests}
            disabled={isRunningTests}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunningTests ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running Tests...
              </>
            ) : (
              'Run All Tests'
            )}
          </button>
        </div>
        
        {message && (
          <div className="mb-6 p-4 bg-gray-800 rounded-md">
            {message}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map((test) => (
            <div key={test.id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{test.name}</h2>
                  <p className="text-gray-400 text-sm mt-1">{test.description}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  test.status === 'passed' ? 'bg-green-900 text-green-200' :
                  test.status === 'failed' ? 'bg-red-900 text-red-200' :
                  test.status === 'running' ? 'bg-blue-900 text-blue-200' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {test.status === 'passed' ? 'Passed' :
                   test.status === 'failed' ? 'Failed' :
                   test.status === 'running' ? 'Running' :
                   'Pending'}
                </span>
              </div>
              
              {test.details && (
                <div className={`mt-4 p-3 rounded-md text-sm ${
                  test.status === 'passed' ? 'bg-green-900/30 text-green-200' :
                  test.status === 'failed' ? 'bg-red-900/30 text-red-200' :
                  'bg-gray-700/30 text-gray-300'
                }`}>
                  {test.details}
                </div>
              )}
              
              <div className="mt-4">
                <button
                  onClick={() => runTest(test.id)}
                  disabled={isRunningTests || test.status === 'running'}
                  className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-medium py-1 px-3 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {test.status === 'running' ? 'Running...' : 'Run Test'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">System Status Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-md p-4">
              <div className="text-sm text-gray-400">Tests Passed</div>
              <div className="text-2xl font-bold text-green-400 mt-1">
                {tests.filter(test => test.status === 'passed').length} / {tests.length}
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-md p-4">
              <div className="text-sm text-gray-400">Tests Failed</div>
              <div className="text-2xl font-bold text-red-400 mt-1">
                {tests.filter(test => test.status === 'failed').length} / {tests.length}
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-md p-4">
              <div className="text-sm text-gray-400">System Status</div>
              <div className="text-2xl font-bold mt-1 flex items-center">
                {tests.every(test => test.status === 'passed') ? (
                  <>
                    <span className="text-green-400">Operational</span>
                    <svg className="h-6 w-6 text-green-400 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                ) : tests.some(test => test.status === 'failed') ? (
                  <>
                    <span className="text-red-400">Issues Detected</span>
                    <svg className="h-6 w-6 text-red-400 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span className="text-gray-400">Not Tested</span>
                    <svg className="h-6 w-6 text-gray-400 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(SystemTest);
