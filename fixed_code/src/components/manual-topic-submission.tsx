import React, { useState } from 'react';
import { PlusCircle, X, Send, FileText } from 'lucide-react';

interface ManualTopicSubmissionProps {}

export const ManualTopicSubmission: React.FC<ManualTopicSubmissionProps> = () => {
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [description, setDescription] = useState('');
  
  const addTopic = () => {
    if (newTopic.trim()) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic('');
    }
  };
  
  const removeTopic = (index: number) => {
    const newTopics = [...topics];
    newTopics.splice(index, 1);
    setTopics(newTopics);
  };
  
  return (
    <div className="space-y-8 fade-in">
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-400" />
          Manual Topic Submission
        </h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium mb-2">
              Add Video Topics
            </label>
            <div className="flex space-x-2">
              <input
                id="topic"
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Enter a video topic idea"
                className="flex-1 p-2.5 bg-muted border border-border rounded-md"
                onKeyPress={(e) => e.key === 'Enter' && addTopic()}
              />
              <button
                onClick={addTopic}
                className="p-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {topics.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Your Topics</h3>
              <div className="space-y-2">
                {topics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-md">
                    <span>{topic}</span>
                    <button
                      onClick={() => removeTopic(index)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Additional Details
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any specific details, keywords, or instructions for your video topics..."
              className="w-full p-2.5 bg-muted border border-border rounded-md min-h-[120px]"
            />
          </div>
          
          <div className="pt-4">
            <button 
              className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
              disabled={topics.length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Topics for Production
            </button>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Submissions</h2>
        
        <div className="space-y-4">
          <div className="p-4 border border-border/50 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Top 10 AI Developments in 2025</h3>
                <p className="text-sm text-muted-foreground mt-1">Submitted on Apr 20, 2025</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                In Progress
              </span>
            </div>
          </div>
          
          <div className="p-4 border border-border/50 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">The Future of Remote Work</h3>
                <p className="text-sm text-muted-foreground mt-1">Submitted on Apr 18, 2025</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                Completed
              </span>
            </div>
          </div>
          
          <div className="p-4 border border-border/50 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Cryptocurrency Market Analysis</h3>
                <p className="text-sm text-muted-foreground mt-1">Submitted on Apr 15, 2025</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualTopicSubmission;
