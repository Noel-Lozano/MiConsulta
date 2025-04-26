import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DailyQuestion = () => {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    axios.get('/api/daily/daily-question')
      .then(response => setQuestion(response.data))
      .catch(error => console.error('Error fetching question', error));
  }, []);

  const handleSubmit = () => {
    axios.post('/api/daily/submit-daily-answer', {
      user_id: "demo-user",  // replace with actual user id when you have auth
      answer: selectedAnswer
    }).then(response => {
      if (response.data.correct) {
        setFeedback(`✅ Correct! Streak: ${response.data.new_streak}`);
      } else {
        setFeedback('❌ Wrong answer. Try again tomorrow!');
      }
    }).catch(error => console.error('Error submitting answer', error));
  };

  if (!question) return <div>Loading today's question...</div>;

  return (
    <div>
      <h2>🩺 Daily Medical Challenge</h2>
      <p>{question.question}</p>
      {question.options.map(option => (
        <div key={option}>
          <input 
            type="radio" 
            value={option} 
            name="answer" 
            onChange={(e) => setSelectedAnswer(e.target.value)} 
          />
          {option}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Answer</button>
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default DailyQuestion;