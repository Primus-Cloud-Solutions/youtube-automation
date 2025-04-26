import React from 'react';
import { Calendar, Clock, Tag, Check, Plus } from 'lucide-react';

const TopicScheduler = () => {
  // Sample scheduled topics
  const scheduledTopics = [
    { id: 1, title: 'Future of AI in Healthcare', date: 'Apr 25, 2025', time: '10:00 AM', tags: ['Technology', 'Healthcare'] },
    { id: 2, title: 'Quantum Computing Breakthroughs', date: 'Apr 27, 2025', time: '2:30 PM', tags: ['Technology', 'Science'] },
    { id: 3, title: 'Elden Ring DLC Review', date: 'Apr 30, 2025', time: '4:00 PM', tags: ['Gaming', 'Review'] },
    { id: 4, title: 'Web Development Trends 2025', date: 'May 3, 2025', time: '11:00 AM', tags: ['Technology', 'Web'] },
    { id: 5, title: 'Sustainable Energy Solutions', date: 'May 5, 2025', time: '1:00 PM', tags: ['Environment', 'Technology'] },
  ];
  
  return (
    <div className="space-y-8 fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Content Calendar</h2>
          <p className="text-muted-foreground">Schedule and manage your upcoming video content</p>
        </div>
        
        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center md:w-auto w-full">
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Topic
        </button>
      </div>
      
      <div className="glass-card p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Topic</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tags</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scheduledTopics.map((topic) => (
                <tr key={topic.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-medium">{topic.title}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{topic.date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{topic.time}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-2">
                      {topic.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary-foreground border border-primary/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                        <Check className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                        <Tag className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                        <Calendar className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Publishing Schedule</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Monday</span>
              <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Wednesday</span>
              <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Friday</span>
              <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Saturday</span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30">
                Inactive
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Sunday</span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30">
                Inactive
              </span>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Optimal Publishing Times</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Morning (8AM - 11AM)</span>
                <span className="text-sm text-green-400">High Engagement</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Afternoon (12PM - 4PM)</span>
                <span className="text-sm text-yellow-400">Medium Engagement</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Evening (5PM - 8PM)</span>
                <span className="text-sm text-green-400">High Engagement</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Night (9PM - 12AM)</span>
                <span className="text-sm text-red-400">Low Engagement</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicScheduler;
