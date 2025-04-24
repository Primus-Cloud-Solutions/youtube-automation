'use client';

import React from 'react';
import { useAuth } from '../../context/auth-context';
import { useYouTubeApi } from '../../context/youtube-api-context';
import withAuth from '../../utils/with-auth';
import DashboardHeader from '../../app/components/dashboard-header';

function ApiKeysPage() {
  const { user } = useAuth();
  const { 
    apiKeys, 
    saveApiKeys, 
    testYouTubeApiKey, 
    testOpenAIApiKey, 
    testElevenLabsApiKey,
    loading 
  } = useYouTubeApi();
  
  const [youtubeApiKey, setYoutubeApiKey] = React.useState(apiKeys.youtube || '');
  const [openaiApiKey, setOpenaiApiKey] = React.useState(apiKeys.openai || '');
  const [elevenlabsApiKey, setElevenlabsApiKey] = React.useState(apiKeys.elevenlabs || '');
  
  const [testingYoutube, setTestingYoutube] = React.useState(false);
  const [testingOpenai, setTestingOpenai] = React.useState(false);
  const [testingElevenlabs, setTestingElevenlabs] = React.useState(false);
  
  const [youtubeStatus, setYoutubeStatus] = React.useState({ success: false, message: '' });
  const [openaiStatus, setOpenaiStatus] = React.useState({ success: false, message: '' });
  const [elevenlabsStatus, setElevenlabsStatus] = React.useState({ success: false, message: '' });
  
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');

  const handleSaveKeys = async () => {
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      const result = await saveApiKeys({
        youtube: youtubeApiKey,
        openai: openaiApiKey,
        elevenlabs: elevenlabsApiKey
      });
      
      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(result.error || 'Failed to save API keys');
      }
    } catch (error) {
      setSaveError('An unexpected error occurred');
      console.error(error);
    }
  };
  
  const handleTestYouTubeKey = async () => {
    setTestingYoutube(true);
    setYoutubeStatus({ success: false, message: '' });
    
    try {
      const result = await testYouTubeApiKey(youtubeApiKey);
      
      if (result.success) {
        setYoutubeStatus({ success: true, message: 'YouTube API key is valid!' });
      } else {
        setYoutubeStatus({ success: false, message: result.error || 'Failed to validate YouTube API key' });
      }
    } catch (error) {
      setYoutubeStatus({ success: false, message: 'An unexpected error occurred' });
      console.error(error);
    } finally {
      setTestingYoutube(false);
    }
  };
  
  const handleTestOpenAIKey = async () => {
    setTestingOpenai(true);
    setOpenaiStatus({ success: false, message: '' });
    
    try {
      const result = await testOpenAIApiKey(openaiApiKey);
      
      if (result.success) {
        setOpenaiStatus({ success: true, message: 'OpenAI API key is valid!' });
      } else {
        setOpenaiStatus({ success: false, message: result.error || 'Failed to validate OpenAI API key' });
      }
    } catch (error) {
      setOpenaiStatus({ success: false, message: 'An unexpected error occurred' });
      console.error(error);
    } finally {
      setTestingOpenai(false);
    }
  };
  
  const handleTestElevenLabsKey = async () => {
    setTestingElevenlabs(true);
    setElevenlabsStatus({ success: false, message: '' });
    
    try {
      const result = await testElevenLabsApiKey(elevenlabsApiKey);
      
      if (result.success) {
        setElevenlabsStatus({ success: true, message: 'ElevenLabs API key is valid!' });
      } else {
        setElevenlabsStatus({ success: false, message: result.error || 'Failed to validate ElevenLabs API key' });
      }
    } catch (error) {
      setElevenlabsStatus({ success: false, message: 'An unexpected error occurred' });
      console.error(error);
    } finally {
      setTestingElevenlabs(false);
    }
  };

  return (
    <div>
      <DashboardHeader />
      
      <main className="container mt-4 fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">API Keys Management</h1>
          <p className="text-muted-foreground">Configure your API keys to enable video automation</p>
        </div>
        
        {saveSuccess && (
          <div className="glass-card p-4 mb-6 border border-green-500/30 bg-green-500/10">
            <p className="text-green-400">API keys saved successfully!</p>
          </div>
        )}
        
        {saveError && (
          <div className="glass-card p-4 mb-6 border border-destructive/30 bg-destructive/10">
            <p className="text-destructive">{saveError}</p>
          </div>
        )}
        
        <div className="space-y-6">
          {/* YouTube API Key */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="text-red-500 mr-2">▶️</span>
              YouTube API Key
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="youtubeApiKey" className="block text-sm font-medium mb-2">
                  API Key
                </label>
                <div className="flex space-x-2">
                  <input
                    id="youtubeApiKey"
                    type="text"
                    value={youtubeApiKey}
                    onChange={(e) => setYoutubeApiKey(e.target.value)}
                    placeholder="Enter your YouTube API key"
                    className="flex-1 p-2.5 bg-muted border border-border rounded-md font-mono text-sm"
                    disabled={loading || testingYoutube}
                  />
                  <button
                    onClick={handleTestYouTubeKey}
                    disabled={loading || testingYoutube || !youtubeApiKey.trim()}
                    className="px-4 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {testingYoutube ? 'Testing...' : 'Test Key'}
                  </button>
                </div>
                
                {youtubeStatus.message && (
                  <div className={`mt-2 text-sm ${youtubeStatus.success ? 'text-green-400' : 'text-destructive'}`}>
                    {youtubeStatus.message}
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground mt-2">
                  Required for accessing YouTube data and uploading videos.{' '}
                  <a 
                    href="https://console.cloud.google.com/apis/credentials" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline"
                  >
                    Get a YouTube API key
                  </a>
                </p>
              </div>
              
              <div className="bg-muted/30 border border-border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">Required YouTube API Permissions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>YouTube Data API v3</li>
                  <li>YouTube Analytics API</li>
                  <li>YouTube Reporting API</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* OpenAI API Key */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="text-green-500 mr-2">🧠</span>
              OpenAI API Key
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="openaiApiKey" className="block text-sm font-medium mb-2">
                  API Key
                </label>
                <div className="flex space-x-2">
                  <input
                    id="openaiApiKey"
                    type="text"
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                    placeholder="Enter your OpenAI API key"
                    className="flex-1 p-2.5 bg-muted border border-border rounded-md font-mono text-sm"
                    disabled={loading || testingOpenai}
                  />
                  <button
                    onClick={handleTestOpenAIKey}
                    disabled={loading || testingOpenai || !openaiApiKey.trim()}
                    className="px-4 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {testingOpenai ? 'Testing...' : 'Test Key'}
                  </button>
                </div>
                
                {openaiStatus.message && (
                  <div className={`mt-2 text-sm ${openaiStatus.success ? 'text-green-400' : 'text-destructive'}`}>
                    {openaiStatus.message}
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground mt-2">
                  Required for generating video scripts, titles, and descriptions.{' '}
                  <a 
                    href="https://platform.openai.com/account/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline"
                  >
                    Get an OpenAI API key
                  </a>
                </p>
              </div>
              
              <div className="bg-muted/30 border border-border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">OpenAI Models Used</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>GPT-4 for script generation</li>
                  <li>GPT-3.5 Turbo for titles and descriptions</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* ElevenLabs API Key */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="text-blue-500 mr-2">🔊</span>
              ElevenLabs API Key
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="elevenlabsApiKey" className="block text-sm font-medium mb-2">
                  API Key
                </label>
                <div className="flex space-x-2">
                  <input
                    id="elevenlabsApiKey"
                    type="text"
                    value={elevenlabsApiKey}
                    onChange={(e) => setElevenlabsApiKey(e.target.value)}
                    placeholder="Enter your ElevenLabs API key"
                    className="flex-1 p-2.5 bg-muted border border-border rounded-md font-mono text-sm"
                    disabled={loading || testingElevenlabs}
                  />
                  <button
                    onClick={handleTestElevenLabsKey}
                    disabled={loading || testingElevenlabs || !elevenlabsApiKey.trim()}
                    className="px-4 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {testingElevenlabs ? 'Testing...' : 'Test Key'}
                  </button>
                </div>
                
                {elevenlabsStatus.message && (
                  <div className={`mt-2 text-sm ${elevenlabsStatus.success ? 'text-green-400' : 'text-destructive'}`}>
                    {elevenlabsStatus.message}
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground mt-2">
                  Required for generating natural-sounding voiceovers.{' '}
                  <a 
                    href="https://elevenlabs.io/app/api-key" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline"
                  >
                    Get an ElevenLabs API key
                  </a>
                </p>
              </div>
              
              <div className="bg-muted/30 border border-border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">Voice Synthesis Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>Natural-sounding voices</li>
                  <li>Multiple voice options</li>
                  <li>Adjustable speaking styles</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveKeys}
              disabled={loading}
              className="btn py-3 px-6 text-lg"
            >
              {loading ? 'Saving...' : 'Save All API Keys'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(ApiKeysPage);
