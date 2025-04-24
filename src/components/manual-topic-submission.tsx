import React, { useState } from 'react';

export const ManualTopicSubmission = () => {
  const [topics, setTopics] = useState([
    'YouTube Algorithm Updates',
    'Content Creation Tips',
    'Monetization Strategies'
  ])
  
  const [newTopic, setNewTopic] = useState('')
  
  const addTopic = () => {
    if (newTopic.trim() !== '') {
      setTopics([...topics, newTopic])
      setNewTopic('')
    }
  }
  
  // Add explicit number type to the index parameter
  const removeTopic = (index: number) => {
    const newTopics = [...topics]
    newTopics.splice(index, 1)
    setTopics(newTopics)
  }

  // Rest of your component code
  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};

export default ManualTopicSubmission;
