'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import { usePayment } from '../../context/payment-context';
import withAuth from '../../utils/with-auth';
import DashboardHeader from '../../components/dashboard-header';

function YouTubeChannelPage() {
  const { user } = useAuth();
  const { subscription } = usePayment();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [channel, setChannel] = useState(null);
  const [hasChannel, setHasChannel] = useState(false);
  
  // Form state
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#FF0000');
  
  // Check if user has a channel already
  useEffect(() => {
    if (user && subscription) {
      checkExistingChannel();
    }
  }, [user, subscription]);
  
  // Check if user has Pro or Enterprise plan
  const canCreateChannel = subscription && (subscription.planId === 'pro' || subscription.planId === 'enterprise');
  
  // Check if user already has a YouTube channel
  const checkExistingChannel = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/youtube-channel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-channel',
          userId: user.id,
          email: user.email,
          plan: subscription?.planId
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.hasChannel) {
        setHasChannel(true);
        setChannel(data.channel);
      } else {
        setHasChannel(false);
        setChannel(null);
      }
    } catch (err) {
      console.error('Error checking channel:', err);
      setError('Failed to check if you have an existing YouTube channel');
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new YouTube channel
  const createChannel = async (e) => {
    e.preventDefault();
    
    if (!channelName.trim()) {
      setError('Channel name is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await fetch('/api/youtube-channel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create-channel',
          userId: user.id,
          email: user.email,
          channelName: channelName.trim(),
          description: description.trim(),
          color,
          plan: subscription?.planId
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(data.message || 'YouTube channel created successfully!');
        setChannel(data.channel);
        setHasChannel(true);
      } else {
        setError(data.error || 'Failed to create YouTube channel');
      }
    } catch (err) {
      console.error('Error creating channel:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DashboardHeader />
      
      <main className="container mt-4 fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">YouTube Channel Management</h1>
          <p className="text-muted-foreground">Create and manage your YouTube channel</p>
        </div>
        
        {!canCreateChannel && (
          <div className="glass-card p-6 mb-6 border border-yellow-500/30 bg-yellow-500/10">
            <h2 className="text-xl font-semibold mb-2">Upgrade Required</h2>
            <p className="text-muted-foreground">
              YouTube channel creation is only available for Pro and Enterprise plans.
              Please upgrade your subscription to access this feature.
            </p>
            <button
              onClick={() => router.push('/pricing')}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              View Pricing Plans
            </button>
          </div>
        )}
        
        {error && (
          <div className="glass-card p-4 mb-6 border border-destructive/30 bg-destructive/10">
            <p className="text-destructive">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="glass-card p-4 mb-6 border border-green-500/30 bg-green-500/10">
            <p className="text-green-400">{success}</p>
          </div>
        )}
        
        {canCreateChannel && hasChannel && channel && (
          <div className="glass-card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Your YouTube Channel</h2>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img 
                  src={channel.thumbnails?.default?.url || 'https://via.placeholder.com/88'} 
                  alt="Channel Logo" 
                  className="w-20 h-20 rounded-full"
                />
              </div>
              
              <div className="flex-grow">
                <h3 className="text-lg font-medium">{channel.title}</h3>
                <p className="text-muted-foreground text-sm mb-2">{channel.customUrl}</p>
                <p className="text-sm mb-4">{channel.description}</p>
                
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div className="bg-muted/30 p-2 rounded-md">
                    <div className="font-semibold">{channel.statistics?.subscriberCount || '0'}</div>
                    <div className="text-muted-foreground">Subscribers</div>
                  </div>
                  <div className="bg-muted/30 p-2 rounded-md">
                    <div className="font-semibold">{channel.statistics?.videoCount || '0'}</div>
                    <div className="text-muted-foreground">Videos</div>
                  </div>
                  <div className="bg-muted/30 p-2 rounded-md">
                    <div className="font-semibold">{channel.statistics?.viewCount || '0'}</div>
                    <div className="text-muted-foreground">Views</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border">
              <h3 className="text-lg font-medium mb-2">API Key</h3>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={channel.apiKey || ''}
                  readOnly
                  className="flex-grow p-2 bg-muted border border-border rounded-md font-mono text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(channel.apiKey || '');
                    setSuccess('API key copied to clipboard!');
                    setTimeout(() => setSuccess(''), 3000);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This API key is used to access your YouTube channel. Keep it secure and do not share it with others.
              </p>
            </div>
          </div>
        )}
        
        {canCreateChannel && !hasChannel && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Create YouTube Channel</h2>
            
            <form onSubmit={createChannel}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="channelName" className="block text-sm font-medium mb-2">
                    Channel Name *
                  </label>
                  <input
                    id="channelName"
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="Enter your channel name"
                    className="w-full p-2.5 bg-muted border border-border rounded-md"
                    disabled={loading}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Channel Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your channel (optional)"
                    className="w-full p-2.5 bg-muted border border-border rounded-md h-24"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="color" className="block text-sm font-medium mb-2">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="color"
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-10 h-10 p-1 bg-muted border border-border rounded-md"
                      disabled={loading}
                    />
                    <span className="text-sm text-muted-foreground">
                      This color will be used for your channel logo and branding
                    </span>
                  </div>
                </div>
                
                <div className="bg-muted/30 border border-border rounded-md p-4 mt-4">
                  <h3 className="text-sm font-medium mb-3">What You'll Get</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>A new YouTube channel linked to your email</li>
                    <li>Custom channel logo based on your brand color</li>
                    <li>YouTube API key for managing your channel</li>
                    <li>Email confirmation with all channel details</li>
                  </ul>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={loading || !channelName.trim()}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Channel...' : 'Create YouTube Channel'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default withAuth(YouTubeChannelPage);
