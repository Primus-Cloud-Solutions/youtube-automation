'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export function AutomatedScheduling() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [frequency, setFrequency] = useState('weekly')
  const [category, setCategory] = useState('technology')
  const [isScheduled, setIsScheduled] = useState(false)
  const [humanLikeness, setHumanLikeness] = useState(80)
  
  const handleSchedule = () => {
    setIsScheduled(true)
    // In a real app, this would send the schedule to the backend
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Automated Video Scheduling</h2>
        <p className="text-muted-foreground">
          Let AI generate trending videos for your channel on a schedule
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-bg">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Schedule Settings</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly (Recommended)</SelectItem>
                    <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Start Date</Label>
                <div className="border rounded-md p-2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="mx-auto"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Upload Time</Label>
                <Select defaultValue="18">
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
        </Card>
        
        <Card className="p-6 space-bg">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Content Settings</h3>
            
            <div className="space-y-4">
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
              </div>
              
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
                  Higher values create more natural-sounding content but may reduce trending topic accuracy
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="trending" defaultChecked />
                  <Label htmlFor="trending">Focus on trending topics</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatically detect and create videos about trending topics in your category
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="compliance" defaultChecked />
                  <Label htmlFor="compliance">Ensure content compliance</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatically check videos against YouTube's community guidelines
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSchedule} 
          className="glow"
          disabled={isScheduled}
        >
          {isScheduled ? 'Schedule Active' : 'Activate Schedule'}
        </Button>
      </div>
      
      {isScheduled && (
        <Card className="p-4 border-accent/50 bg-accent/10">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-accent mr-2 pulse"></div>
            <p>
              <span className="font-medium">Schedule active!</span> Next video will be generated and uploaded on{' '}
              {date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at 6:00 PM
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
