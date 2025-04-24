'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Upload, Calendar as CalendarIcon, Clock, Plus, Trash2 } from 'lucide-react'
import Logo from '@/components/logo'

export function ManualTopicSubmission() {
  const [topics, setTopics] = useState([{ topic: '', description: '', date: new Date(), time: '18' }])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [humanLikeness, setHumanLikeness] = useState(80)
  const [videoLength, setVideoLength] = useState(5)
  const [activeTab, setActiveTab] = useState('single')
  
  const addTopic = () => {
    setTopics([...topics, { topic: '', description: '', date: new Date(), time: '18' }])
  }
  
  const removeTopic = (index) => {
    const newTopics = [...topics]
    newTopics.splice(index, 1)
    setTopics(newTopics)
  }
  
  const updateTopic = (index, field, value) => {
    const newTopics = [...topics]
    newTopics[index][field] = value
    setTopics(newTopics)
  }
  
  const handleGenerate = () => {
    if (topics.some(t => !t.topic)) return
    
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
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Topic Submission</h2>
          <p className="text-muted-foreground">
            Create videos on specific topics of your choice
          </p>
        </div>
        <Logo size={48} className="hidden md:block" />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="single" className="text-sm md:text-base">Single Topic</TabsTrigger>
          <TabsTrigger value="batch" className="text-sm md:text-base">Batch Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="space-y-4">
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
                      value={topics[0].topic}
                      onChange={(e) => updateTopic(0, 'topic', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Additional Details (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Add any specific details you want included in the video"
                      value={topics[0].description}
                      onChange={(e) => updateTopic(0, 'description', e.target.value)}
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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Schedule Date</Label>
                      <div className="border rounded-md p-2">
                        <Calendar
                          mode="single"
                          selected={topics[0].date}
                          onSelect={(date) => updateTopic(0, 'date', date)}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Upload Time</Label>
                      <Select 
                        value={topics[0].time} 
                        onValueChange={(value) => updateTopic(0, 'time', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9">9:00 AM</SelectItem>
                          <SelectItem value="12">12:00 PM</SelectItem>
                          <SelectItem value="15">3:00 PM</SelectItem>
                          <SelectItem value="18">6:00 PM (Recommended)</SelectItem>
                          <SelectItem value="21">9:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
              disabled={!topics[0].topic || isGenerating}
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
        </TabsContent>
        
        <TabsContent value="batch" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Batch Topic Scheduling</h3>
            <Button onClick={addTopic} size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-1" /> Add Topic
            </Button>
          </div>
          
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {topics.map((topic, index) => (
              <Card key={index} className="p-4 space-bg">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-md font-medium">Topic #{index + 1}</h4>
                  {topics.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeTopic(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 -mt-1 -mr-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`topic-${index}`}>Video Topic</Label>
                      <Input
                        id={`topic-${index}`}
                        placeholder="Enter your video topic"
                        value={topic.topic}
                        onChange={(e) => updateTopic(index, 'topic', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`description-${index}`}>Additional Details</Label>
                      <Textarea
                        id={`description-${index}`}
                        placeholder="Add specific details for this video"
                        value={topic.description}
                        onChange={(e) => updateTopic(index, 'description', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Schedule Date</Label>
                      <div className="flex items-center space-x-2 border rounded-md p-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <input
                          type="date"
                          className="bg-transparent flex-1 outline-none"
                          value={topic.date instanceof Date ? topic.date.toISOString().split('T')[0] : ''}
                          onChange={(e) => updateTopic(index, 'date', new Date(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Upload Time</Label>
                      <div className="flex items-center space-x-2 border rounded-md p-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Select 
                          value={topic.time} 
                          onValueChange={(value) => updateTopic(index, 'time', value)}
                        >
                          <SelectTrigger className="border-0 p-0 bg-transparent">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9">9:00 AM</SelectItem>
                            <SelectItem value="12">12:00 PM</SelectItem>
                            <SelectItem value="15">3:00 PM</SelectItem>
                            <SelectItem value="18">6:00 PM</SelectItem>
                            <SelectItem value="21">9:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
            ))}
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button 
              onClick={handleGenerate} 
              disabled={topics.some(t => !t.topic) || isGenerating}
              className="glow"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling Videos...
                </>
              ) : (
                'Schedule All Videos'
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="p-4 border-muted/50 bg-muted/10">
        <p className="text-sm">
          <span className="font-medium">Pro Tip:</span> For best results, provide clear and specific topics. The AI will handle research, script writing, voiceover, and visual creation automatically.
        </p>
      </Card>
    </div>
  )
}
