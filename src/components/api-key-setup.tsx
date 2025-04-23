'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ApiKeySetup() {
  const [youtubeKey, setYoutubeKey] = useState('')
  const [openaiKey, setOpenaiKey] = useState('')
  const [elevenLabsKey, setElevenLabsKey] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1500)
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">API Settings</h2>
        <p className="text-muted-foreground">
          Configure your API keys to enable automated video creation and uploads
        </p>
      </div>
      
      <Tabs defaultValue="youtube" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="youtube">YouTube API</TabsTrigger>
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="elevenlabs">ElevenLabs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="youtube" className="space-y-4">
          <Card className="p-6 space-bg">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">YouTube API Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  Your YouTube API key is required for uploading videos and accessing your channel
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="youtube-api-key">API Key</Label>
                  <Input
                    id="youtube-api-key"
                    type="password"
                    placeholder="Enter your YouTube API key"
                    value={youtubeKey}
                    onChange={(e) => setYoutubeKey(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="youtube-client-id">Client ID</Label>
                  <Input
                    id="youtube-client-id"
                    placeholder="Enter your YouTube Client ID"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="youtube-client-secret">Client Secret</Label>
                  <Input
                    id="youtube-client-secret"
                    type="password"
                    placeholder="Enter your YouTube Client Secret"
                  />
                </div>
              </div>
              
              <div>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save YouTube API Settings'}
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Don't have a YouTube API key?</p>
                <a 
                  href="https://developers.google.com/youtube/v3/getting-started" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Learn how to create one
                </a>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="openai" className="space-y-4">
          <Card className="p-6 space-bg">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">OpenAI API Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  Your OpenAI API key is used for generating video scripts and content
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-api-key">API Key</Label>
                  <Input
                    id="openai-api-key"
                    type="password"
                    placeholder="Enter your OpenAI API key"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="openai-model">Default Model</Label>
                  <select
                    id="openai-model"
                    className="w-full p-2 rounded-md bg-muted/50 border border-border"
                  >
                    <option value="gpt-4">GPT-4 (Recommended)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save OpenAI Settings'}
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Don't have an OpenAI API key?</p>
                <a 
                  href="https://platform.openai.com/account/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Get one from OpenAI
                </a>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="elevenlabs" className="space-y-4">
          <Card className="p-6 space-bg">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">ElevenLabs API Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  Your ElevenLabs API key is used for generating natural-sounding voiceovers
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="elevenlabs-api-key">API Key</Label>
                  <Input
                    id="elevenlabs-api-key"
                    type="password"
                    placeholder="Enter your ElevenLabs API key"
                    value={elevenLabsKey}
                    onChange={(e) => setElevenLabsKey(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="elevenlabs-voice">Default Voice</Label>
                  <select
                    id="elevenlabs-voice"
                    className="w-full p-2 rounded-md bg-muted/50 border border-border"
                  >
                    <option value="adam">Adam (Male)</option>
                    <option value="rachel">Rachel (Female)</option>
                    <option value="antoni">Antoni (Male)</option>
                    <option value="elli">Elli (Female)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save ElevenLabs Settings'}
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Don't have an ElevenLabs API key?</p>
                <a 
                  href="https://elevenlabs.io/app/api-key" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Get one from ElevenLabs
                </a>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
