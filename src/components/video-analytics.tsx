import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Users, Clock, ArrowUpRight } from 'lucide-react';

interface VideoAnalyticsProps {}

export const VideoAnalytics: React.FC<VideoAnalyticsProps> = () => {
  // Sample data for charts
  const viewsData = [
    { name: 'Jan', views: 4000 },
    { name: 'Feb', views: 3000 },
    { name: 'Mar', views: 5000 },
    { name: 'Apr', views: 7000 },
    { name: 'May', views: 6000 },
    { name: 'Jun', views: 8000 },
  ];
  
  const demographicData = [
    { name: '18-24', value: 30 },
    { name: '25-34', value: 40 },
    { name: '35-44', value: 15 },
    { name: '45-54', value: 10 },
    { name: '55+', value: 5 },
  ];
  
  const COLORS = ['#3b82f6', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444'];
  
  const topVideos = [
    { title: 'How AI is Changing the Future of Work', views: 45892, growth: 12 },
    { title: 'Top 10 Programming Languages in 2025', views: 38721, growth: 8 },
    { title: 'Quantum Computing Explained Simply', views: 32456, growth: 15 },
    { title: 'The Future of Electric Vehicles', views: 28934, growth: 5 },
  ];
  
  return (
    <div className="space-y-8 fade-in">
      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stats-card">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-muted-foreground">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span>Total Views</span>
            </div>
            <span className="stats-value">248.7K</span>
            <div className="stats-trend stats-trend-up">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+18% from last month</span>
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span>Subscribers</span>
            </div>
            <span className="stats-value">12.4K</span>
            <div className="stats-trend stats-trend-up">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+7% from last month</span>
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span>Watch Time</span>
            </div>
            <span className="stats-value">18.2K hrs</span>
            <div className="stats-trend stats-trend-up">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+22% from last month</span>
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-muted-foreground">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              <span>Engagement Rate</span>
            </div>
            <span className="stats-value">8.7%</span>
            <div className="stats-trend stats-trend-up">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+3% from last month</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">Views Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={viewsData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }} 
                />
                <Bar dataKey="views" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">Audience Demographics</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Top Performing Videos */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-6">Top Performing Videos</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Video Title</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Views</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Growth</th>
              </tr>
            </thead>
            <tbody>
              {topVideos.map((video, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">{video.title}</td>
                  <td className="py-3 px-4 text-right">{video.views.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center text-green-400">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {video.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalytics;
