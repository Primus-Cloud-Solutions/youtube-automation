'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ManualTopicSubmission } from '@/components/manual-topic-submission'
import { AutomatedScheduling } from '@/components/automated-scheduling'
import TopicScheduler from '@/components/topic-scheduler'
import { VideoAnalytics } from '@/components/video-analytics'
import { ApiKeySetup } from '@/components/api-key-setup'
import { DashboardHeader } from '@/components/dashboard-header'
import Logo from '@/components/logo'
import Favicon from '@/components/favicon'
import { Home, Calendar, Settings, BarChart3, Key, LogOut, Menu, X, Youtube, Sparkles, TrendingUp, Clock, Film } from 'lucide-react'

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
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Sidebar */}
        <div className={`sidebar fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center space-x-3 mb-10 mt-2">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Youtube className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">TubeAutomator</h1>
                <p className="text-xs text-muted-foreground flex items-center">
                  <Sparkles className="h-3 w-3 mr-1 text-blue-400" />
                  AI-Powered Automation
                </p>
              </div>
            </div>
            
            <nav className="space-y-1.5 flex-1">
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
                <Film className="mr-2 h-4 w-4" />
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
            
            <div className="pt-4 border-t border-border/30">
              <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="main-content w-full fade-in">
          <DashboardHeader activeTab={activeTab} />
          
          <div className="mt-8">
            {activeTab === 'overview' && (
              <div className="space-y-8 stagger-children">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="stats-card">
                    <div className="flex flex-col space-y-2">
                      <span className="stats-label">Videos Created</span>
                      <span className="stats-value">24</span>
                      <div className="stats-trend stats-trend-up">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>+12% from last month</span>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="stats-card">
                    <div className="flex flex-col space-y-2">
                      <span className="stats-label">Total Views</span>
                      <span className="stats-value">142.5K</span>
                      <div className="stats-trend stats-trend-up">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>+18% from last month</span>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="stats-card">
                    <div className="flex flex-col space-y-2">
                      <span className="stats-label">Subscription Status</span>
                      <span className="stats-value text-purple-400">Active</span>
                      <div className="stats-trend">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">Next billing: May 24, 2025</span>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="p-6 glass-card">
                    <h3 className="text-lg font-medium mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        className="quick-action quick-action-primary"
                        onClick={() => setActiveTab('manual')}
                      >
                        <Film className="quick-action-icon h-6 w-6" />
                        <span>Create Video</span>
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="quick-action"
                        onClick={() => setActiveTab('scheduler')}
                      >
                        <Calendar className="quick-action-icon h-6 w-6" />
                        <span>Schedule Content</span>
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="quick-action"
                        onClick={() => setActiveTab('analytics')}
                      >
                        <BarChart3 className="quick-action-icon h-6 w-6" />
                        <span>View Analytics</span>
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="quick-action"
                        onClick={() => setActiveTab('api-keys')}
                      >
                        <Key className="quick-action-icon h-6 w-6" />
                        <span>Manage API Keys</span>
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-6 glass-card">
                    <h3 className="text-lg font-medium mb-6">Upcoming Videos</h3>
                    <div className="space-y-4">
                      <div className="upcoming-video">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="upcoming-video-title">Future of AI in Healthcare</h4>
                            <p className="upcoming-video-date">Scheduled for Apr 25, 2025</p>
                          </div>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                      
                      <div className="upcoming-video">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="upcoming-video-title">Quantum Computing Breakthroughs</h4>
                            <p className="upcoming-video-date">Scheduled for Apr 27, 2025</p>
                          </div>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                      
                      <div className="upcoming-video">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="upcoming-video-title">Elden Ring DLC Review</h4>
                            <p className="upcoming-video-date">Scheduled for Apr 30, 2025</p>
                          </div>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                      
                      <div className="text-center mt-6">
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('scheduler')} className="text-primary hover:text-primary/80">
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
