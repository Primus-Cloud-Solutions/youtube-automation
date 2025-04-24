'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Calendar, Save } from 'lucide-react'
import Logo from '@/components/logo'

export function TopicScheduler() {
  const [schedules, setSchedules] = useState([
    { id: 1, name: 'Tech News', frequency: 'weekly', days: ['monday', 'wednesday', 'friday'], time: '18', category: 'technology', active: true },
    { id: 2, name: 'Gaming Reviews', frequency: 'biweekly', days: ['tuesday', 'saturday'], time: '15', category: 'gaming', active: false }
  ])
  
  const [topics, setTopics] = useState([
    { id: 1, topic: 'Future of AI in Healthcare', scheduleId: 1, date: new Date(2025, 3, 25), time: '18', status: 'scheduled' },
    { id: 2, topic: 'Quantum Computing Breakthroughs', scheduleId: 1, date: new Date(2025, 3, 27), time: '18', status: 'scheduled' },
    { id: 3, topic: 'Elden Ring DLC Review', scheduleId: 2, date: new Date(2025, 3, 30), time: '15', status: 'scheduled' }
  ])
  
  const [newTopic, setNewTopic] = useState({ topic: '', scheduleId: 1, date: new Date(), time: '18' })
  const [activeTab, setActiveTab] = useState('schedules')
  const [editingSchedule, setEditingSchedule] = useState(null)
  
  // Initialize new schedule form
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    frequency: 'weekly',
    days: ['monday', 'wednesday', 'friday'],
    time: '18',
    category: 'technology'
  })
  
  // Handle adding a new topic
  const handleAddTopic = () => {
    if (!newTopic.topic) return
    
    const topicId = topics.length > 0 ? Math.max(...topics.map(t => t.id)) + 1 : 1
    
    setTopics([
      ...topics,
      {
        id: topicId,
        topic: newTopic.topic,
        scheduleId: newTopic.scheduleId,
        date: newTopic.date,
        time: newTopic.time,
        status: 'scheduled'
      }
    ])
    
    setNewTopic({ topic: '', scheduleId: newTopic.scheduleId, date: new Date(), time: '18' })
  }
  
  // Handle removing a topic
  const handleRemoveTopic = (id) => {
    setTopics(topics.filter(topic => topic.id !== id))
  }
  
  // Handle adding a new schedule
  const handleAddSchedule = () => {
    if (!newSchedule.name) return
    
    const scheduleId = schedules.length > 0 ? Math.max(...schedules.map(s => s.id)) + 1 : 1
    
    setSchedules([
      ...schedules,
      {
        id: scheduleId,
        name: newSchedule.name,
        frequency: newSchedule.frequency,
        days: newSchedule.days,
        time: newSchedule.time,
        category: newSchedule.category,
        active: false
      }
    ])
    
    setNewSchedule({
      name: '',
      frequency: 'weekly',
      days: ['monday', 'wednesday', 'friday'],
      time: '18',
      category: 'technology'
    })
  }
  
  // Handle editing a schedule
  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule)
  }
  
  // Handle saving edited schedule
  const handleSaveSchedule = () => {
    if (!editingSchedule) return
    
    setSchedules(schedules.map(schedule => 
      schedule.id === editingSchedule.id ? editingSchedule : schedule
    ))
    
    setEditingSchedule(null)
  }
  
  // Handle removing a schedule
  const handleRemoveSchedule = (id) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id))
    // Also remove associated topics
    setTopics(topics.filter(topic => topic.scheduleId !== id))
  }
  
  // Handle toggling a day in schedule
  const toggleDay = (day) => {
    if (!editingSchedule) return
    
    const days = editingSchedule.days.includes(day)
      ? editingSchedule.days.filter(d => d !== day)
      : [...editingSchedule.days, day]
    
    setEditingSchedule({ ...editingSchedule, days })
  }
  
  // Handle toggling schedule active status
  const toggleScheduleActive = (id) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, active: !schedule.active } : schedule
    ))
  }
  
  // Get schedule name by ID
  const getScheduleName = (id) => {
    const schedule = schedules.find(s => s.id === id)
    return schedule ? schedule.name : 'Unknown'
  }
  
  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }
  
  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Topic Scheduler</h2>
          <p className="text-muted-foreground">
            Manage your content schedules and upcoming topics
          </p>
        </div>
        <Logo size={48} className="hidden md:block" />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="schedules" className="text-sm md:text-base">Content Schedules</TabsTrigger>
          <TabsTrigger value="topics" className="text-sm md:text-base">Upcoming Topics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedules" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Your Content Schedules</h3>
            {!editingSchedule && (
              <Button onClick={() => setActiveTab('new-schedule')} size="sm" className="flex items-center">
                <Plus className="h-4 w-4 mr-1" /> New Schedule
              </Button>
            )}
          </div>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {schedules.map((schedule) => (
              <Card key={schedule.id} className={`p-4 ${editingSchedule?.id === schedule.id ? 'border-purple-500 space-bg' : 'space-bg'}`}>
                {editingSchedule?.id === schedule.id ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2 flex-1 mr-4">
                        <Label htmlFor="schedule-name">Schedule Name</Label>
                        <Input
                          id="schedule-name"
                          value={editingSchedule.name}
                          onChange={(e) => setEditingSchedule({ ...editingSchedule, name: e.target.value })}
                          placeholder="Enter schedule name"
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label>Frequency</Label>
                        <Select 
                          value={editingSchedule.frequency} 
                          onValueChange={(value) => setEditingSchedule({ ...editingSchedule, frequency: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Upload Days</Label>
                      <div className="grid grid-cols-7 gap-2">
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                          <Button
                            key={day}
                            type="button"
                            variant={editingSchedule.days.includes(day) ? "default" : "outline"}
                            className={`h-10 ${editingSchedule.days.includes(day) ? 'glow-sm' : ''}`}
                            onClick={() => toggleDay(day)}
                          >
                            {day.charAt(0).toUpperCase()}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Upload Time</Label>
                        <Select 
                          value={editingSchedule.time} 
                          onValueChange={(value) => setEditingSchedule({ ...editingSchedule, time: value })}
                        >
                          <SelectTrigger>
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
                      
                      <div className="space-y-2">
                        <Label>Content Category</Label>
                        <Select 
                          value={editingSchedule.category} 
                          onValueChange={(value) => setEditingSchedule({ ...editingSchedule, category: value })}
                        >
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
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setEditingSchedule(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveSchedule} className="glow">
                        <Save className="h-4 w-4 mr-1" /> Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${schedule.active ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                        <h4 className="font-medium text-lg">{schedule.name}</h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditSchedule(schedule)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => handleRemoveSchedule(schedule.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Frequency:</span>
                        <p className="capitalize">{schedule.frequency}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Days:</span>
                        <p>{schedule.days.map(d => d.charAt(0).toUpperCase()).join(', ')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time:</span>
                        <p>{schedule.time === '9' ? '9:00 AM' : 
                           schedule.time === '12' ? '12:00 PM' : 
                           schedule.time === '15' ? '3:00 PM' : 
                           schedule.time === '18' ? '6:00 PM' : 
                           schedule.time === '21' ? '9:00 PM' : schedule.time}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <p className="capitalize">{schedule.category}</p>
                      </div>
                    </div>
                    
                    <div className="pt-2 flex justify-end">
                      <Button 
                        variant={schedule.active ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleScheduleActive(schedule.id)}
                        className={schedule.active ? "" : "glow-sm"}
                      >
                        {schedule.active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="new-schedule" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Create New Schedule</h3>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab('schedules')}>
              Back to Schedules
            </Button>
          </div>
          
          <Card className="p-6 space-bg">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-schedule-name">Schedule Name</Label>
                <Input
                  id="new-schedule-name"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                  placeholder="E.g., Tech News Weekly"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select 
                  value={newSchedule.frequency} 
                  onValueChange={(value) => setNewSchedule({ ...newSchedule, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
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
                      variant={newSchedule.days.includes(day) ? "default" : "outline"}
                      className={`h-10 ${newSchedule.days.includes(day) ? 'glow-sm' : ''}`}
                      onClick={() => {
                        const days = newSchedule.days.includes(day)
                          ? newSchedule.days.filter(d => d !== day)
                          : [...newSchedule.days, day]
                        setNewSchedule({ ...newSchedule, days })
                      }}
                    >
                      {day.charAt(0).toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Upload Time</Label>
                  <Select 
                    value={newSchedule.time} 
                    onValueChange={(value) => setNewSchedule({ ...newSchedule, time: value })}
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
                
                <div className="space-y-2">
                  <Label>Content Category</Label>
                  <Select 
                    value={newSchedule.category} 
                    onValueChange={(value) => setNewSchedule({ ...newSchedule, category: value })}
                  >
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
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={handleAddSchedule} 
                  disabled={!newSchedule.name || newSchedule.days.length === 0}
                  className="glow"
                >
                  <Plus className="h-4 w-4 mr-1" /> Create Schedule
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="topics" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Upcoming Topics</h3>
          </div>
          
          <Card className="p-6 space-bg">
            <div className="space-y-4">
              <h4 className="font-medium">Add New Topic</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="new-topic">Topic</Label>
                  <Input
                    id="new-topic"
                    value={newTopic.topic}
                    onChange={(e) => setNewTopic({ ...newTopic, topic: e.target.value })}
                    placeholder="Enter video topic"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Schedule</Label>
                  <Select 
                    value={newTopic.scheduleId.toString()} 
                    onValueChange={(value) => setNewTopic({ ...newTopic, scheduleId: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      {schedules.map(schedule => (
                        <SelectItem key={schedule.id} value={schedule.id.toString()}>
                          {schedule.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={handleAddTopic} 
                    disabled={!newTopic.topic}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Topic
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <h4 className="font-medium">Scheduled Topics</h4>
            
            {topics.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No topics scheduled yet. Add your first topic above.
              </div>
            ) : (
              topics.map((topic) => (
                <Card key={topic.id} className="p-4 space-bg hover-card">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h5 className="font-medium">{topic.topic}</h5>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{formatDate(topic.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>
                            {topic.time === '9' ? '9:00 AM' : 
                             topic.time === '12' ? '12:00 PM' : 
                             topic.time === '15' ? '3:00 PM' : 
                             topic.time === '18' ? '6:00 PM' : 
                             topic.time === '21' ? '9:00 PM' : topic.time}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          {getScheduleName(topic.scheduleId)}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      onClick={() => handleRemoveTopic(topic.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
