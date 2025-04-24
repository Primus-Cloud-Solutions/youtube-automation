'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, Sparkles, Zap, BarChart3, Loader2 } from 'lucide-react'
import Logo from '@/components/logo'

export function AutomatedScheduling() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [frequency, setFrequency] = useState('weekly')
  const [category, setCategory] = useState('technology')
  const [humanLikeness, setHumanLikeness] = useState(80)
  const [videoLength, setVideoLength] = useState(5)
  const [uploadDays, setUploadDays] = useState(['monday', 'wednesday', 'friday'])
  const [uploadTime, setUploadTime] = useState('18')
  const [activeTab, setActiveTab] = useState('schedule')
  const [trendingTopics, setTrendingTopics] = useState([
    { topic: 'AI Image Generation Breakthroughs', score: 98 },
    { topic: 'Quantum Computing Explained', score: 92 },
    { topic: 'Space Tourism Future', score: 89 },
    { topic: 'Blockchain Beyond Crypto', score: 85 },
    { topic: 'Sustainable Tech Innovations', score: 82 }
  ])
  
  const toggleDay = (day) => {
    if (uploadDays.includes(day)) {
      setUploadDays(uploadDays.filter(d => d !== day))
    } else {
      setUploadDays([...uploadDays, day])
    }
  }
  
  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate video generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }
  
  const refreshTrendingTopics = () => {
    // Simulate API call to get trending topics
    setTrendingTopics([
      { topic: 'Next-Gen AR Glasses Review', score: 97 },
      { topic: 'Machine Learning for Beginners', score: 94 },
      { topic: 'Future of Electric Vehicles', score: 91 },
      { topic: 'Smart Home Security Tips', score: 88 },
      { topic: 'Coding Bootcamps vs CS Degrees', score: 84 }
    ])
  }
  
  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Automated Content</h2>
          <p className="text-muted-foreground">
            Let AI generate trending videos on a schedule
          </p>
        </div>
        <Logo size={48} className="hidden md:block" />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="schedule" className="text-sm md:text-base">Schedule Setup</TabsTrigger>
          <TabsTrigger value="trending" className="text-sm md:text-base">Trending Topics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-bg">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Upload Schedule</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Upload Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly (3 days)</SelectItem>
                        <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Upload Days</Label>
                    <div className="grid grid-cols-7 gap-2">
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                        <Button
                          key={day}
                          type="button"
                          variant={uploadDays.includes(day) ? "default" : "outline"}
                          className={`h-10 ${uploadDays.includes(day) ? 'glow-sm' : ''}`}
                          onClick={() => toggleDay(day)}
                        >
                          {day.charAt(0).toUpperCase()}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Select the days you want videos to be uploaded
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Upload Time</Label>
                    <div className="flex items-center space-x-2 border rounded-md p-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Select value={uploadTime} onValueChange={setUploadTime}>
                        <SelectTrigger className="border-0 p-0 bg-transparent">
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
                    <p className="text-xs text-muted-foreground">
                      6:00 PM typically has the highest engagement
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Content Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      AI will find trending topics in this category
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 space-bg">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Content Settings</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Human-like Content</Label>
                      <span className="text-sm text-muted-foreground">{humanLikeness}%</span>
                    </div>
                    <Slider
                      value={[humanLikeness]}
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
                      value={[videoLength]}
                      min={2}
                      max={15}
                      step={1}
                      onValueChange={(value) => setVideoLength(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="trending" defaultChecked />
                      <Label htmlFor="trending">Use trending topics only</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      AI will select topics with the highest viral potential
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-optimize" defaultChecked />
                      <Label htmlFor="auto-optimize">Auto-optimize for engagement</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Automatically adjust content based on performance data
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
              disabled={uploadDays.length === 0 || isGenerating}
              className="glow"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting Up Schedule...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Activate Schedule
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="trending" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Current Trending Topics</h3>
            <Button onClick={refreshTrendingTopics} variant="outline" size="sm" className="flex items-center">
              <Zap className="h-4 w-4 mr-1" /> Refresh Topics
            </Button>
          </div>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Card className="p-4 space-bg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Top Trending in {category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                  <span className="text-xs text-muted-foreground">Updated 2 hours ago</span>
                </div>
                
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-muted/30 rounded-md bg-muted/10 hover:bg-muted/20 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index < 3 ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-muted/30'}`}>
                          {index < 3 ? <Sparkles className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
                        </div>
                        <span className="font-medium">{topic.topic}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${index < 3 ? 'text-purple-400' : 'text-muted-foreground'}`}>
                          {topic.score} viral score
                        </span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Input 
                            type="checkbox" 
                            className="h-4 w-4" 
                            defaultChecked={index < 3}
                          />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            
            <Card className="p-4 space-bg">
              <div className="space-y-4">
                <h4 className="font-medium">Custom Topic Filters</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="include-keywords">Include Keywords</Label>
                    <Input
                      id="include-keywords"
                      placeholder="e.g., AI, future, innovation"
                    />
                    <p className="text-xs text-muted-foreground">
                      Only select topics containing these keywords
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="exclude-keywords">Exclude Keywords</Label>
                    <Input
                      id="exclude-keywords"
                      placeholder="e.g., politics, controversy"
                    />
                    <p className="text-xs text-muted-foreground">
                      Skip topics containing these keywords
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
          <Card className="p-4 border-muted/50 bg-muted/10">
            <p className="text-sm">
              <span className="font-medium">Pro Tip:</span> Our AI analyzes millions of videos to identify topics with the highest viral potential. Selected topics are automatically researched and fact-checked before video creation.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
