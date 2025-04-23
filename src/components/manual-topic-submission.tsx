'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import { Loader2, Upload } from 'lucide-react'

export function ManualTopicSubmission() {
  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [humanLikeness, setHumanLikeness] = useState(80)
  const [videoLength, setVideoLength] = useState(5)
  
  const handleGenerate = () => {
    if (!topic) return
    
    setIsGenerating(true)
    // Simulate video generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }
  
  const handleUpload = () => {
    setIsUploading(true)
    // Simulate video upload
    setTimeout(() => {
      setIsUploading(false)
    }, 2000)
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Manual Topic Submission</h2>
        <p className="text-muted-foreground">
          Create videos on specific topics of your choice
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-bg">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Topic Details</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Video Topic</Label>
                <Input
                  id="topic"
                  placeholder="Enter your video topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Additional Details (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add any specific details you want included in the video"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Video Style</Label>
                <Select defaultValue="educational">
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="entertaining">Entertaining</SelectItem>
                    <SelectItem value="news">News Style</SelectItem>
                    <SelectItem value="commentary">Commentary</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 space-bg">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Generation Settings</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Human-like Content</Label>
                  <span className="text-sm text-muted-foreground">{humanLikeness}%</span>
                </div>
                <Slider
                  defaultValue={[80]}
                  max={100}
                  step={5}
                  onValueChange={(value) => setHumanLikeness(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Higher values create more natural-sounding content
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Video Length (minutes)</Label>
                  <span className="text-sm text-muted-foreground">{videoLength} min</span>
                </div>
                <Slider
                  defaultValue={[5]}
                  min={2}
                  max={15}
                  step={1}
                  onValueChange={(value) => setVideoLength(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="research" defaultChecked />
                  <Label htmlFor="research">Research topic automatically</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  AI will research the topic to ensure accurate information
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="compliance-check" defaultChecked />
                  <Label htmlFor="compliance-check">Ensure content compliance</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatically check videos against YouTube's community guidelines
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button 
          onClick={handleGenerate} 
          disabled={!topic || isGenerating}
          className="glow"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Video...
            </>
          ) : (
            'Generate Video'
          )}
        </Button>
        
        <Button 
          onClick={handleUpload}
          disabled={isGenerating || isUploading}
          variant="outline"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Now
            </>
          )}
        </Button>
      </div>
      
      <Card className="p-4 border-muted/50 bg-muted/10">
        <p className="text-sm">
          <span className="font-medium">Pro Tip:</span> For best results, provide a clear and specific topic. The AI will handle research, script writing, voiceover, and visual creation automatically.
        </p>
      </Card>
    </div>
  )
}
