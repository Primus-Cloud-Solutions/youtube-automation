'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data for demonstration
const viewsData = [
  { name: 'Apr 16', views: 1240 },
  { name: 'Apr 17', views: 1580 },
  { name: 'Apr 18', views: 2390 },
  { name: 'Apr 19', views: 3490 },
  { name: 'Apr 20', views: 2800 },
  { name: 'Apr 21', views: 3200 },
  { name: 'Apr 22', views: 4100 },
]

const videosData = [
  {
    id: 1,
    title: 'Top 10 SpaceX Innovations That Changed Space Travel',
    views: 24890,
    likes: 1830,
    comments: 342,
    date: '2025-04-20',
    thumbnail: '/video1.jpg',
    status: 'published'
  },
  {
    id: 2,
    title: 'How Neuralink Will Transform Human Capabilities',
    views: 18650,
    likes: 1420,
    comments: 287,
    date: '2025-04-15',
    thumbnail: '/video2.jpg',
    status: 'published'
  },
  {
    id: 3,
    title: 'The Future of Electric Vehicles: Beyond Tesla',
    views: 12340,
    likes: 980,
    comments: 156,
    date: '2025-04-10',
    thumbnail: '/video3.jpg',
    status: 'published'
  },
  {
    id: 4,
    title: 'Mars Colonization: Timeline and Challenges',
    views: 0,
    likes: 0,
    comments: 0,
    date: '2025-04-24',
    thumbnail: '/video4.jpg',
    status: 'scheduled'
  }
]

export function VideoAnalytics() {
  const [timeRange, setTimeRange] = useState('week')
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Channel Analytics</h2>
        <p className="text-muted-foreground">
          Track performance and engagement of your automated videos
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 space-bg">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-3xl font-bold">58,940</p>
                <p className="text-xs text-accent">↑ 24% from last week</p>
              </div>
            </Card>
            
            <Card className="p-4 space-bg">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Subscribers</p>
                <p className="text-3xl font-bold">2,845</p>
                <p className="text-xs text-accent">↑ 12% from last week</p>
              </div>
            </Card>
            
            <Card className="p-4 space-bg">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-3xl font-bold">7.8%</p>
                <p className="text-xs text-accent">↑ 3% from last week</p>
              </div>
            </Card>
          </div>
          
          <Card className="p-6 space-bg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Views Over Time</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant={timeRange === 'week' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTimeRange('week')}
                  >
                    Week
                  </Button>
                  <Button 
                    variant={timeRange === 'month' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTimeRange('month')}
                  >
                    Month
                  </Button>
                  <Button 
                    variant={timeRange === 'year' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTimeRange('year')}
                  >
                    Year
                  </Button>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={viewsData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        borderColor: 'rgba(66, 153, 225, 0.5)',
                        color: '#fff'
                      }} 
                    />
                    <Bar dataKey="views" fill="rgba(66, 153, 225, 0.8)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="videos" className="space-y-6">
          <Card className="p-6 space-bg">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Recent Videos</h3>
              
              <div className="space-y-4">
                {videosData.map((video) => (
                  <div 
                    key={video.id} 
                    className={`flex flex-col md:flex-row gap-4 p-4 rounded-lg ${
                      video.status === 'scheduled' ? 'bg-muted/20' : 'bg-muted/10'
                    }`}
                  >
                    <div className="w-full md:w-40 h-24 bg-muted/30 rounded-md flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">Thumbnail</span>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{video.title}</h4>
                        {video.status === 'scheduled' ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">
                            Scheduled
                          </span>
                        ) : null}
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <span>Published: {video.date}</span>
                        {video.status !== 'scheduled' && (
                          <>
                            <span>{video.views.toLocaleString()} views</span>
                            <span>{video.likes.toLocaleString()} likes</span>
                            <span>{video.comments.toLocaleString()} comments</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="audience" className="space-y-6">
          <Card className="p-6 space-bg">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Audience Demographics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Age Groups</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">18-24</span>
                      <span className="text-sm text-muted-foreground">28%</span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">25-34</span>
                      <span className="text-sm text-muted-foreground">42%</span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">35-44</span>
                      <span className="text-sm text-muted-foreground">18%</span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">45+</span>
                      <span className="text-sm text-muted-foreground">12%</span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Top Geographies</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">United States</span>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">United Kingdom</span>
                      <span className="text-sm text-muted-foreground">15%</span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Canada</span>
                      <span className="text-sm text-muted-foreground">12%</span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Australia</span>
                      <span className="text-sm text-muted-foreground">8%</span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '8%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
