import React, { useState, useEffect } from 'react';
import '../App.css';


function DailyQuestion() {
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/daily/daily-question'); 
      const data = await res.json(); 
      setQuestionData(data);
    } catch (error) {
      console.error('Error fetching daily question:', error);
      setQuestionData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAnswer) {
      setFeedback('Please select an answer before submitting.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/daily/submit-daily-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: "demo-user",
          answer: selectedAnswer,
        }),
      });
      const data = await res.json(); // ✅ manually parse response JSON
      if (data.correct) {
        setFeedback(`✅ Correct! Streak: ${data.new_streak}`);
      } else {
        setFeedback('❌ Wrong answer. Try again tomorrow!');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setFeedback('Failed to submit your answer. Please try again later.');
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading today's question...</div>;
  }

  if (!questionData) {
    return <div>Could not load the daily question. Please refresh.</div>;
  }

  return (
    <div className="App">
      <h1>🩺 Daily Medical Challenge</h1>
      <form onSubmit={handleSubmit}>
        <p>{questionData.question}</p>
        {questionData.options.map(option => (
          <div key={option}>
            <input
              type="radio"
              value={option}
              name="answer"
              checked={selectedAnswer === option}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            />
            {option}
          </div>
        ))}
        <button type="submit">Submit Answer</button>
      </form>

      {feedback && (
        <div>
          <h2>Result:</h2>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}

export default DailyQuestion;