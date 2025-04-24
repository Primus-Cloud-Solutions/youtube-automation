import React from 'react';
import { Sparkles } from 'lucide-react';

interface AutomatedSchedulingProps {}

export const AutomatedScheduling: React.FC<AutomatedSchedulingProps> = () => {
  const [selectedDays, setSelectedDays] = React.useState<string[]>(['Monday', 'Wednesday', 'Friday']);
  const [frequency, setFrequency] = React.useState<number>(3);
  const [topicSources, setTopicSources] = React.useState<string[]>(['trending', 'news']);
  
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sources = [
    { id: 'trending', label: 'Trending Topics' },
    { id: 'news', label: 'Current News' },
    { id: 'evergreen', label: 'Evergreen Content' },
    { id: 'niche', label: 'Niche Specific' }
  ];
  
  return (
    <div className="space-y-8 fade-in">
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-blue-400" />
          Automated Content Schedule
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium mb-3">Publishing Days</h3>
            <div className="grid grid-cols-7 gap-2">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`py-2 px-1 rounded-md transition-all text-sm ${
                    selectedDays.includes(day)
                      ? 'bg-primary/20 border border-primary/30 text-primary-foreground'
                      : 'bg-muted border border-border hover:bg-muted/80'
                  }`}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-3">Publishing Frequency</h3>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="7"
                value={frequency}
                onChange={(e) => setFrequency(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-medium bg-primary/20 py-1 px-3 rounded-full">
                {frequency} video{frequency > 1 ? 's' : ''} per week
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-3">Content Sources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sources.map(source => (
                <label
                  key={source.id}
                  className={`flex items-center space-x-2 p-3 rounded-md border cursor-pointer transition-all ${
                    topicSources.includes(source.id)
                      ? 'bg-primary/20 border-primary/30'
                      : 'bg-muted/50 border-border hover:bg-muted'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={topicSources.includes(source.id)}
                    onChange={() => {
                      if (topicSources.includes(source.id)) {
                        setTopicSources(topicSources.filter(s => s !== source.id));
                      } else {
                        setTopicSources([...topicSources, source.id]);
                      }
                    }}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    topicSources.includes(source.id)
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground'
                  }`}>
                    {topicSources.includes(source.id) && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-white">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <span>{source.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="pt-4">
            <button className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md font-medium hover:opacity-90 transition-opacity">
              Save Automation Settings
            </button>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-6">AI Content Preferences</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium mb-3">Content Style</h3>
            <select className="w-full p-2.5 bg-muted border border-border rounded-md">
              <option value="educational">Educational</option>
              <option value="entertaining">Entertaining</option>
              <option value="news">News & Updates</option>
              <option value="tutorial">Tutorial & How-to</option>
              <option value="review">Reviews & Opinions</option>
            </select>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-3">Video Length</h3>
            <div className="grid grid-cols-3 gap-2">
              <button className="py-2 px-3 bg-primary/20 border border-primary/30 rounded-md text-primary-foreground">
                Short (3-5 min)
              </button>
              <button className="py-2 px-3 bg-muted border border-border rounded-md hover:bg-muted/80">
                Medium (8-12 min)
              </button>
              <button className="py-2 px-3 bg-muted border border-border rounded-md hover:bg-muted/80">
                Long (15+ min)
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-3">Target Audience</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary/20 text-primary-foreground py-1 px-3 rounded-full text-sm">
                Tech Enthusiasts
                <button className="ml-1 text-primary-foreground/70 hover:text-primary-foreground">×</button>
              </span>
              <span className="bg-primary/20 text-primary-foreground py-1 px-3 rounded-full text-sm">
                Professionals
                <button className="ml-1 text-primary-foreground/70 hover:text-primary-foreground">×</button>
              </span>
              <span className="bg-muted py-1 px-3 rounded-full text-sm border border-border">
                + Add audience
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedScheduling;
