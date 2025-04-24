import React, { useState } from 'react';
import DashboardHeader from '../../components/dashboard-header';

export default function ApiKeys() {
  const [apiKey, setApiKey] = useState('');
  const [channelId, setChannelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Sample API keys
  const [savedKeys, setSavedKeys] = useState([
    { id: 1, name: 'Main Channel', apiKey: 'AIza...XdQ', channelId: 'UC1a...3kQ', status: 'Active', lastUsed: '2025-04-22' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Add new API key to the list
      const newKey = {
        id: savedKeys.length + 1,
        name: 'YouTube API Key',
        apiKey: apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 3),
        channelId: channelId,
        status: 'Active',
        lastUsed: new Date().toISOString().split('T')[0]
      };
      
      setSavedKeys([...savedKeys, newKey]);
      
      // Reset form
      setApiKey('');
      setChannelId('');
      setLoading(false);
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div>
      <DashboardHeader />
      
      <main className="container mt-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">API Keys Management</h1>
          <p>Manage your YouTube API keys for channel integration</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add New API Key Form */}
          <div>
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Add New API Key</h2>
              
              {success && (
                <div className="card mb-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981' }}>
                  <p style={{ color: '#10b981' }}>API key added successfully!</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="apiKey">YouTube API Key</label>
                  <input
                    id="apiKey"
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your YouTube API key"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-primary">
                      How to get an API key
                    </a>
                  </p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="channelId">YouTube Channel ID</label>
                  <input
                    id="channelId"
                    type="text"
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                    placeholder="Enter your YouTube channel ID"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn w-full"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add API Key'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Saved API Keys List */}
          <div>
            <h2 className="text-xl font-bold mb-4">Your API Keys</h2>
            
            {savedKeys.length === 0 ? (
              <div className="card">
                <p>No API keys added yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {savedKeys.map((item) => (
                  <div className="card" key={item.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm mb-1">
                          <span className="text-muted-foreground">API Key: </span>
                          {item.apiKey}
                        </p>
                        <p className="text-sm mb-1">
                          <span className="text-muted-foreground">Channel ID: </span>
                          {item.channelId}
                        </p>
                        <p className="text-sm mb-1">
                          <span className="text-muted-foreground">Status: </span>
                          <span className="text-green-500">{item.status}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Last used on {item.lastUsed}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-outline btn-sm">Test</button>
                        <button 
                          className="btn btn-sm" 
                          style={{ backgroundColor: 'var(--destructive)' }}
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this API key?')) {
                              setSavedKeys(savedKeys.filter(k => k.id !== item.id));
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
