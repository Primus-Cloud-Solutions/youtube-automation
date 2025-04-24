'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth-context';
import { useContent } from '../../context/content-context';
import withAuth from '../../utils/with-auth';
import DashboardHeader from '../../app/components/dashboard-header';

function ManualTopicsPage() {
  const { user } = useAuth();
  const { generateScript, scheduleVideo, loading } = useContent();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [script, setScript] = useState('');
  const [tags, setTags] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [tagsList, setTagsList] = useState([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Handle tag input
  const handleAddTag = () => {
    if (currentTag.trim() && !tagsList.includes(currentTag.trim())) {
      setTagsList([...tagsList, currentTag.trim()]);
      setCurrentTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTagsList(tagsList.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  // Update tags string when tagsList changes
  useEffect(() => {
    setTags(tagsList.join(', '));
  }, [tagsList]);
  
  const handleScheduleVideo = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setScheduling(true);
    
    if (!title || !description || !script || !scheduledDate || !scheduledTime) {
      setError('Please fill in all required fields');
      setScheduling(false);
      return;
    }
    
    try {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      
      if (isNaN(scheduledDateTime.getTime())) {
        setError('Invalid date or time');
        setScheduling(false);
        return;
      }
      
      const result = await scheduleVideo({
        title,
        description,
        tags: tagsList,
        scheduledTime: scheduledDateTime.toISOString()
      });
      
      if (result.success) {
        setSuccess('Video scheduled successfully!');
        // Reset form
        setTitle('');
        setDescription('');
        setScript('');
        setTags('');
        setTagsList([]);
        setScheduledDate('');
        setScheduledTime('');
      } else {
        setError(result.error || 'Failed to schedule video');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div>
      <DashboardHeader />
      
      <main className="container mt-4 fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Manual Topic Submission</h1>
          <p className="text-muted-foreground">Create and schedule custom content for your YouTube channel</p>
        </div>
        
        {error && (
          <div className="glass-card p-4 mb-6 border border-destructive/30 bg-destructive/10">
            <p className="text-destructive">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="glass-card p-4 mb-6 border border-green-500/30 bg-green-500/10">
            <p className="text-green-400">{success}</p>
          </div>
        )}
        
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">Create Custom Video</h2>
          
          <form onSubmit={handleScheduleVideo}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Video Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your video title"
                    className="w-full p-2.5 bg-muted border border-border rounded-md"
                    disabled={scheduling || loading}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Video Description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter your video description"
                    className="w-full p-2.5 bg-muted border border-border rounded-md h-32"
                    disabled={scheduling || loading}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium mb-2">
                    Tags
                  </label>
                  <div className="flex mb-2">
                    <input
                      id="currentTag"
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add a tag and press Enter"
                      className="flex-1 p-2.5 bg-muted border border-border rounded-l-md"
                      disabled={scheduling || loading}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2.5 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={scheduling || loading || !currentTag.trim()}
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tagsList.map((tag, index) => (
                      <div 
                        key={index}
                        className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-primary hover:text-primary-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Tags help viewers find your video. Add relevant keywords separated by Enter.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="script" className="block text-sm font-medium mb-2">
                    Video Script <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="script"
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder="Enter your video script"
                    className="w-full p-2.5 bg-muted border border-border rounded-md h-40"
                    disabled={scheduling || loading}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="scheduledDate" className="block text-sm font-medium mb-2">
                      Scheduled Date <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="scheduledDate"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full p-2.5 bg-muted border border-border rounded-md"
                      disabled={scheduling || loading}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="scheduledTime" className="block text-sm font-medium mb-2">
                      Scheduled Time <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="scheduledTime"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full p-2.5 bg-muted border border-border rounded-md"
                      disabled={scheduling || loading}
                      required
                    />
                  </div>
                </div>
                
                <div className="bg-muted/30 border border-border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Tips for Creating Great Content</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Keep titles under 60 characters for optimal display</li>
                    <li>• Include keywords in your title and description</li>
                    <li>• Write scripts with clear sections: intro, main points, conclusion</li>
                    <li>• Use tags that are specific to your content niche</li>
                    <li>• Schedule videos when your audience is most active</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={scheduling || loading || !title || !description || !script || !scheduledDate || !scheduledTime}
                className="btn w-full py-3"
              >
                {scheduling ? 'Scheduling...' : 'Schedule Video'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default withAuth(ManualTopicsPage);
