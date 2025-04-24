'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ManualTopicSubmission } from '@/components/manual-topic-submission'
import { AutomatedScheduling } from '@/components/automated-scheduling'
import { TopicScheduler } from '@/components/topic-scheduler'
import { VideoAnalytics } from '@/components/video-analytics'
import { ApiKeySetup } from '@/components/api-key-setup'
import { DashboardHeader } from '@/components/dashboard-header'
import Logo from '@/components/logo'
import Favicon from '@/components/favicon'
import { Home, Calendar, Settings, BarChart3, Key, LogOut, Menu, X } from 'lucide-react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <>
      <Favicon />
      <div className="dashboard-layout">
        {/* Mobile sidebar toggle */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-background/80 backdrop-blur-sm"
          >
            {sidebarOpen ? <X /> : <Menu />}
          </Button>
        </div>
        
        {/* Sidebar */}
        <div className={`sidebar fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center space-x-2 mb-8 mt-2">
              <Logo size={36} />
              <div>
                <h1 className="text-xl font-bold">YT Automation</h1>
                <p className="text-xs text-muted-foreground">v1.0.0</p>
              </div>
            </div>
            
            <nav className="space-y-1 flex-1">
              <Button 
                variant={activeTab === 'overview' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('overview')}
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              
              <Button 
                variant={activeTab === 'manual' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('manual')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Manual Topics
              </Button>
              
              <Button 
                variant={activeTab === 'automated' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('automated')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Automated Content
              </Button>
              
              <Button 
                variant={activeTab === 'scheduler' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('scheduler')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Topic Scheduler
              </Button>
              
              <Button 
                variant={activeTab === 'analytics' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              
              <Button 
                variant={activeTab === 'api-keys' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('api-keys')}
              >
                <Key className="mr-2 h-4 w-4" />
                API Keys
              </Button>
            </nav>
            
            <div className="pt-4 border-t border-muted/20">
              <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="main-content w-full">
          <DashboardHeader activeTab={activeTab} />
          
          <div className="mt-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 space-bg hover-card">
                    <div className="flex flex-col space-y-2">
                      <span className="text-muted-foreground text-sm">Videos Created</span>
                      <span className="text-2xl font-bold">24</span>
                      <span className="text-green-400 text-xs">+12% from last month</span>
                    </div>
                  </Card>
                  
                  <Card className="p-4 space-bg hover-card">
                    <div className="flex flex-col space-y-2">
                      <span className="text-muted-foreground text-sm">Total Views</span>
                      <span className="text-2xl font-bold">142.5K</span>
                      <span className="text-green-400 text-xs">+18% from last month</span>
                    </div>
                  </Card>
                  
                  <Card className="p-4 space-bg hover-card">
                    <div className="flex flex-col space-y-2">
                      <span className="text-muted-foreground text-sm">Subscription Status</span>
                      <span className="text-2xl font-bold text-purple-400">Active</span>
                      <span className="text-muted-foreground text-xs">Next billing: May 24, 2025</span>
                    </div>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 space-bg">
                    <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        className="h-auto py-4 flex flex-col items-center space-y-2 glow-sm"
                        onClick={() => setActiveTab('manual')}
                      >
                        <Calendar className="h-6 w-6" />
                        <span>Create Video</span>
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="h-auto py-4 flex flex-col items-center space-y-2"
                        onClick={() => setActiveTab('scheduler')}
                      >
                        <Settings className="h-6 w-6" />
                        <span>Schedule Content</span>
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="h-auto py-4 flex flex-col items-center space-y-2"
                        onClick={() => setActiveTab('analytics')}
                      >
                        <BarChart3 className="h-6 w-6" />
                        <span>View Analytics</span>
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="h-auto py-4 flex flex-col items-center space-y-2"
                        onClick={() => setActiveTab('api-keys')}
                      >
                        <Key className="h-6 w-6" />
                        <span>Manage API Keys</span>
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-6 space-bg">
                    <h3 className="text-lg font-medium mb-4">Upcoming Videos</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 border border-muted/30 rounded-md bg-muted/10">
                        <div>
                          <h4 className="font-medium">Future of AI in Healthcare</h4>
                          <p className="text-sm text-muted-foreground">Scheduled for Apr 25, 2025</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 border border-muted/30 rounded-md bg-muted/10">
                        <div>
                          <h4 className="font-medium">Quantum Computing Breakthroughs</h4>
                          <p className="text-sm text-muted-foreground">Scheduled for Apr 27, 2025</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 border border-muted/30 rounded-md bg-muted/10">
                        <div>
                          <h4 className="font-medium">Elden Ring DLC Review</h4>
                          <p className="text-sm text-muted-foreground">Scheduled for Apr 30, 2025</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      
                      <div className="text-center">
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('scheduler')}>
                          View All Scheduled Content
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
            
            {activeTab === 'manual' && <ManualTopicSubmission />}
            {activeTab === 'automated' && <AutomatedScheduling />}
            {activeTab === 'scheduler' && <TopicScheduler />}
            {activeTab === 'analytics' && <VideoAnalytics />}
            {activeTab === 'api-keys' && <ApiKeySetup />}
          </div>
        </div>
      </div>
    </>
  )
}
