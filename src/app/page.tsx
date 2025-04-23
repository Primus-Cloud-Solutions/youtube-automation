'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { AutomatedScheduling } from '@/components/automated-scheduling'
import { ManualTopicSubmission } from '@/components/manual-topic-submission'
import { ApiKeySetup } from '@/components/api-key-setup'
import { DashboardHeader } from '@/components/dashboard-header'
import { VideoAnalytics } from '@/components/video-analytics'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Mock authentication for demo purposes
  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 sm:p-24">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">
              <span className="text-accent">Cosmic</span>Tube
            </h1>
            <p className="text-xl text-muted-foreground">
              AI-Powered YouTube Automation
            </p>
          </div>
          
          <Card className="p-6 space-bg glow">
            <div className="space-y-4">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold">Sign In</h2>
                <p className="text-muted-foreground">
                  Enter your credentials to access your dashboard
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="w-full p-2 rounded-md bg-muted/50 border border-border"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-2 rounded-md bg-muted/50 border border-border"
                  />
                </div>
                
                <Button 
                  className="w-full pulse" 
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
                
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <a href="#" className="text-accent hover:underline">
                    Sign Up
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <DashboardHeader />
      
      <div className="container mx-auto mt-8">
        <Tabs defaultValue="automated" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="automated" className="text-sm md:text-base">Automated Scheduling</TabsTrigger>
            <TabsTrigger value="manual" className="text-sm md:text-base">Manual Submission</TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm md:text-base">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="text-sm md:text-base">API Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="automated" className="space-y-4">
            <AutomatedScheduling />
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <ManualTopicSubmission />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <VideoAnalytics />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <ApiKeySetup />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
