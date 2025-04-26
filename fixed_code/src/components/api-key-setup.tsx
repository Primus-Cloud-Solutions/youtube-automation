import React from 'react';
import { Key, RefreshCw, Save } from 'lucide-react';

interface ApiKeySetupProps {}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = () => {
  const [apiKey, setApiKey] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleSaveKey = () => {
    if (!apiKey.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success message or handle accordingly
    }, 1500);
  };
  
  return (
    <div className="space-y-8 fade-in">
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Key className="h-5 w-5 mr-2 text-blue-400" />
          YouTube API Configuration
        </h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
              YouTube API Key
            </label>
            <div className="flex space-x-2">
              <input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your YouTube API key"
                className="flex-1 p-2.5 bg-muted border border-border rounded-md font-mono text-sm"
              />
              <button
                onClick={handleSaveKey}
                disabled={isLoading || !apiKey.trim()}
                className="px-4 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Your API key is stored securely and used to interact with the YouTube API.
            </p>
          </div>
          
          <div className="bg-muted/30 border border-border rounded-md p-4">
            <h3 className="text-sm font-medium mb-3">How to get a YouTube API Key</h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Go to the <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Developers Console</a></li>
              <li>Create a new project or select an existing one</li>
              <li>Enable the YouTube Data API v3</li>
              <li>Create credentials for an API key</li>
              <li>Copy the API key and paste it above</li>
            </ol>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-6">API Usage & Quotas</h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Daily Quota Usage</span>
              <span className="text-sm text-muted-foreground">3,450 / 10,000 units</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" style={{ width: '34.5%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              YouTube API has a daily quota limit. Monitor your usage to avoid disruptions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 border border-border rounded-md p-4">
              <div className="text-2xl font-semibold mb-1">3,450</div>
              <div className="text-sm text-muted-foreground">Units used today</div>
            </div>
            
            <div className="bg-muted/30 border border-border rounded-md p-4">
              <div className="text-2xl font-semibold mb-1">6,550</div>
              <div className="text-sm text-muted-foreground">Units remaining</div>
            </div>
            
            <div className="bg-muted/30 border border-border rounded-md p-4">
              <div className="text-2xl font-semibold mb-1">10,000</div>
              <div className="text-sm text-muted-foreground">Daily quota limit</div>
            </div>
          </div>
          
          <div className="pt-4">
            <button className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Quota Status
            </button>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-6">OAuth Configuration</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium mb-2">
              OAuth Client ID
            </label>
            <input
              id="clientId"
              type="text"
              placeholder="Enter your OAuth Client ID"
              className="w-full p-2.5 bg-muted border border-border rounded-md font-mono text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="clientSecret" className="block text-sm font-medium mb-2">
              OAuth Client Secret
            </label>
            <input
              id="clientSecret"
              type="password"
              placeholder="Enter your OAuth Client Secret"
              className="w-full p-2.5 bg-muted border border-border rounded-md font-mono text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="redirectUri" className="block text-sm font-medium mb-2">
              Redirect URI
            </label>
            <input
              id="redirectUri"
              type="text"
              value="https://video-automation.netlify.app/oauth/callback"
              readOnly
              className="w-full p-2.5 bg-muted/50 border border-border rounded-md font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Use this URL as the authorized redirect URI in your Google OAuth settings.
            </p>
          </div>
          
          <div className="pt-4">
            <button className="w-full py-2.5 bg-secondary/80 text-white rounded-md font-medium hover:bg-secondary transition-colors">
              Save OAuth Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;
