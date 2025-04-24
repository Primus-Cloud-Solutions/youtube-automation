'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth-context';
import withAuth from '../../utils/with-auth';
import DashboardHeader from '../../app/components/dashboard-header';

function AnalyticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [channelStats, setChannelStats] = useState(null);
  const [recentVideos, setRecentVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoStats, setVideoStats] = useState(null);
  
  // Simulated data for demonstration
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would fetch data from the YouTube API
        // Simulated channel stats
        setChannelStats({
          subscribers: 24850,
          subscribersGrowth: 12.5,
          totalViews: 1458720,
          viewsGrowth: 8.3,
          totalVideos: 87,
          averageViewDuration: '4:32',
          topCountries: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany']
        });
        
        // Simulated recent videos
        setRecentVideos([
          {
            id: 'video1',
            title: 'How to Build a YouTube Automation System',
            publishedAt: '2025-04-15T14:30:00Z',
            thumbnail: 'https://i.ytimg.com/vi/placeholder1/maxresdefault.jpg',
            views: 12450,
            likes: 876,
            comments: 143
          },
          {
            id: 'video2',
            title: '10 AI Tools Every Content Creator Needs in 2025',
            publishedAt: '2025-04-08T10:15:00Z',
            thumbnail: 'https://i.ytimg.com/vi/placeholder2/maxresdefault.jpg',
            views: 28750,
            likes: 1543,
            comments: 287
          },
          {
            id: 'video3',
            title: 'The Future of Content Creation: AI vs Human Creators',
            publishedAt: '2025-03-29T16:45:00Z',
            thumbnail: 'https://i.ytimg.com/vi/placeholder3/maxresdefault.jpg',
            views: 35210,
            likes: 2104,
            comments: 412
          },
          {
            id: 'video4',
            title: 'How I Grew My YouTube Channel to 25K Subscribers',
            publishedAt: '2025-03-22T12:00:00Z',
            thumbnail: 'https://i.ytimg.com/vi/placeholder4/maxresdefault.jpg',
            views: 19870,
            likes: 1245,
            comments: 231
          }
        ]);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Load video stats when a video is selected
  useEffect(() => {
    if (selectedVideo) {
      setLoading(true);
      
      // Simulated video stats
      setTimeout(() => {
        setVideoStats({
          dailyViews: [320, 480, 520, 610, 590, 730, 850],
          demographics: {
            ageGroups: [
              { group: '18-24', percentage: 28 },
              { group: '25-34', percentage: 42 },
              { group: '35-44', percentage: 18 },
              { group: '45-54', percentage: 8 },
              { group: '55+', percentage: 4 }
            ],
            genderSplit: { male: 64, female: 34, other: 2 }
          },
          trafficSources: [
            { source: 'YouTube Search', percentage: 42 },
            { source: 'Suggested Videos', percentage: 28 },
            { source: 'External', percentage: 15 },
            { source: 'Channel Pages', percentage: 10 },
            { source: 'Other', percentage: 5 }
          ],
          retention: {
            averageViewDuration: '4:12',
            retentionRate: 68,
            retentionGraph: [95, 88, 82, 76, 72, 68, 65, 62, 58, 55]
          }
        });
        setLoading(false);
      }, 500);
    }
  }, [selectedVideo]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  return (
    <div>
      <DashboardHeader />
      
      <main className="container mt-4 fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Channel Analytics</h1>
          <p className="text-muted-foreground">Track your YouTube channel performance and video metrics</p>
        </div>
        
        {error && (
          <div className="glass-card p-4 mb-6 border border-destructive/30 bg-destructive/10">
            <p className="text-destructive">{error}</p>
          </div>
        )}
        
        {loading && !channelStats ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-center">
              <div className="text-xl font-semibold mb-2">Loading analytics...</div>
              <p className="text-muted-foreground">Fetching your channel data</p>
            </div>
          </div>
        ) : (
          <>
            {/* Channel Overview */}
            {channelStats && (
              <div className="glass-card p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Channel Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="stats-card">
                    <div className="text-muted-foreground text-sm mb-1">Subscribers</div>
                    <div className="stats-value">{formatNumber(channelStats.subscribers)}</div>
                    <div className="stats-trend stats-trend-up text-xs">
                      ↑ {channelStats.subscribersGrowth}% from last month
                    </div>
                  </div>
                  
                  <div className="stats-card">
                    <div className="text-muted-foreground text-sm mb-1">Total Views</div>
                    <div className="stats-value">{formatNumber(channelStats.totalViews)}</div>
                    <div className="stats-trend stats-trend-up text-xs">
                      ↑ {channelStats.viewsGrowth}% from last month
                    </div>
                  </div>
                  
                  <div className="stats-card">
                    <div className="text-muted-foreground text-sm mb-1">Videos</div>
                    <div className="stats-value">{channelStats.totalVideos}</div>
                    <div className="text-xs text-muted-foreground">
                      Avg. view duration: {channelStats.averageViewDuration}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Audience Geography</h3>
                    <div className="bg-muted/30 border border-border rounded-md p-4">
                      <div className="text-sm mb-2">Top Countries</div>
                      <div className="space-y-2">
                        {channelStats.topCountries.map((country, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div 
                                className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full" 
                                style={{ width: `${100 - index * 15}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm">{country}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Growth Trends</h3>
                    <div className="bg-muted/30 border border-border rounded-md p-4 h-48 flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">
                        Interactive growth chart will be displayed here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Recent Videos */}
            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Recent Videos</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Video</th>
                      <th>Published</th>
                      <th>Views</th>
                      <th>Likes</th>
                      <th>Comments</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentVideos.map((video) => (
                      <tr key={video.id} className="hover:bg-muted/20">
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-16 h-9 bg-muted rounded mr-3"></div>
                            <div className="font-medium truncate max-w-xs">{video.title}</div>
                          </div>
                        </td>
                        <td>{formatDate(video.publishedAt)}</td>
                        <td>{formatNumber(video.views)}</td>
                        <td>{formatNumber(video.likes)}</td>
                        <td>{formatNumber(video.comments)}</td>
                        <td>
                          <button
                            onClick={() => handleVideoSelect(video)}
                            className="btn btn-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Video Details */}
            {selectedVideo && videoStats && (
              <div className="glass-card p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedVideo.title}</h2>
                    <p className="text-muted-foreground">
                      Published on {formatDate(selectedVideo.publishedAt)}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{formatNumber(selectedVideo.views)}</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{formatNumber(selectedVideo.likes)}</div>
                      <div className="text-xs text-muted-foreground">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{formatNumber(selectedVideo.comments)}</div>
                      <div className="text-xs text-muted-foreground">Comments</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Views (Last 7 Days)</h3>
                    <div className="bg-muted/30 border border-border rounded-md p-4 h-48">
                      <div className="h-full flex items-end justify-between">
                        {videoStats.dailyViews.map((views, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div 
                              className="w-8 bg-gradient-to-t from-primary to-secondary rounded-t"
                              style={{ 
                                height: `${(views / Math.max(...videoStats.dailyViews)) * 100}%`,
                                minHeight: '10%'
                              }}
                            ></div>
                            <div className="text-xs mt-2">Day {index + 1}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Traffic Sources</h3>
                    <div className="bg-muted/30 border border-border rounded-md p-4">
                      <div className="space-y-3">
                        {videoStats.trafficSources.map((source, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{source.source}</span>
                              <span>{source.percentage}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div 
                                className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full" 
                                style={{ width: `${source.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default withAuth(AnalyticsPage);
