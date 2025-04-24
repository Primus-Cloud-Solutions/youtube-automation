import React, { useState } from 'react';
import DashboardHeader from '../../components/dashboard-header';

export default function TopicScheduler() {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Sample scheduled topics
  const [scheduledTopics, setScheduledTopics] = useState([
    { id: 1, topic: 'Future of AI in Healthcare', description: 'Exploring how artificial intelligence is transforming healthcare delivery and patient outcomes', date: '2025-04-25', time: '14:00' },
    { id: 2, topic: 'Quantum Computing Breakthroughs', description: 'Recent advancements in quantum computing and their potential impact on technology', date: '2025-04-27', time: '16:30' },
    { id: 3, topic: 'Elden Ring DLC Review', description: 'In-depth review of the latest Elden Ring downloadable content and gameplay features', date: '2025-04-30', time: '18:00' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Add new topic to the list
      const newTopic = {
        id: scheduledTopics.length + 1,
        topic,
        description,
        date: scheduledDate,
        time: scheduledTime
      };
      
      setScheduledTopics([...scheduledTopics, newTopic]);
      
      // Reset form
      setTopic('');
      setDescription('');
      setScheduledDate('');
      setScheduledTime('');
      setLoading(false);
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div>
      <DashboardHeader />
      
      <main className="container mt-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Topic Scheduler</h1>
          <p>Schedule your YouTube video topics for automatic content generation</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Schedule New Topic Form */}
          <div>
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Schedule New Topic</h2>
              
              {success && (
                <div className="card mb-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981' }}>
                  <p style={{ color: '#10b981' }}>Topic scheduled successfully!</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="topic">Topic Title</label>
                  <input
                    id="topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter video topic"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the video content"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="scheduledDate">Date</label>
                    <input
                      id="scheduledDate"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="scheduledTime">Time</label>
                    <input
                      id="scheduledTime"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn w-full"
                  disabled={loading}
                >
                  {loading ? 'Scheduling...' : 'Schedule Topic'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Scheduled Topics List */}
          <div>
            <h2 className="text-xl font-bold mb-4">Scheduled Topics</h2>
            
            {scheduledTopics.length === 0 ? (
              <div className="card">
                <p>No topics scheduled yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {scheduledTopics.map((item) => (
                  <div className="card" key={item.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{item.topic}</h3>
                        <p className="text-sm mb-2">{item.description}</p>
                        <p className="text-sm text-muted-foreground">
                          Scheduled for {new Date(`${item.date}T${item.time}`).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-outline btn-sm">Edit</button>
                        <button 
                          className="btn btn-sm" 
                          style={{ backgroundColor: 'var(--destructive)' }}
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this scheduled topic?')) {
                              setScheduledTopics(scheduledTopics.filter(t => t.id !== item.id));
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
