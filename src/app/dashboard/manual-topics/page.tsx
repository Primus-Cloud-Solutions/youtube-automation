"use client";

import React, { useState } from 'react';
import DashboardHeader from '../../components/dashboard-header';

export default function ManualTopics() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Sample created topics
  const [createdTopics, setCreatedTopics] = useState([
    { id: 1, title: 'How AI is Changing Software Development', content: 'This video explores the impact of artificial intelligence on modern software development practices and tools.', keywords: 'AI, software development, programming, machine learning', date: '2025-04-20' },
    { id: 2, title: 'Top 10 Web Development Trends in 2025', content: 'A comprehensive look at the most important web development technologies and practices to watch in 2025.', keywords: 'web development, trends, 2025, javascript, frameworks', date: '2025-04-15' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Add new topic to the list
      const newTopic = {
        id: createdTopics.length + 1,
        title,
        content,
        keywords,
        date: new Date().toISOString().split('T')[0]
      };
      
      setCreatedTopics([newTopic, ...createdTopics]);
      
      // Reset form
      setTitle('');
      setContent('');
      setKeywords('');
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
          <h1 className="text-2xl font-bold">Manual Topic Submission</h1>
          <p>Create custom video topics with your own content</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create New Topic Form */}
          <div>
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Create New Topic</h2>
              
              {success && (
                <div className="card mb-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981' }}>
                  <p style={{ color: '#10b981' }}>Topic created successfully!</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title">Video Title</label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter video title"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="content">Video Content</label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe what you want in your video"
                    rows={6}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="keywords">Keywords (comma separated)</label>
                  <input
                    id="keywords"
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g., technology, AI, tutorial"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Topic'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Created Topics List */}
          <div>
            <h2 className="text-xl font-bold mb-4">Your Topics</h2>
            
            {createdTopics.length === 0 ? (
              <div className="card">
                <p>No topics created yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {createdTopics.map((item) => (
                  <div className="card" key={item.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{item.title}</h3>
                        <p className="text-sm mb-2">{item.content}</p>
                        <p className="text-sm mb-2">
                          <span className="text-muted-foreground">Keywords: </span>
                          {item.keywords}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Created on {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-outline btn-sm">Edit</button>
                        <button 
                          className="btn btn-sm" 
                          style={{ backgroundColor: 'var(--destructive)' }}
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this topic?')) {
                              setCreatedTopics(createdTopics.filter(t => t.id !== item.id));
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
