<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import '../App.css';


function DailyQuestion() {
=======
// DailyQuestion.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Import useNavigate
import api from './axios'; 
import '../App.css';

function DailyQuestion() {
  const navigate = useNavigate(); // 👈 Setup navigate
>>>>>>> noelox
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/daily/daily-question'); 
      const data = await res.json(); 
      setQuestionData(data);
=======

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login'); // 👈 Redirect to login if not logged in
      return;
    }

    fetchQuestion();
  }, [navigate]);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await api.get('/daily/daily-question');
      setQuestionData(res.data);
>>>>>>> noelox
    } catch (error) {
      console.error('Error fetching daily question:', error);
      setQuestionData(null);
    }
    setLoading(false);
  };

<<<<<<< HEAD
  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
=======
  const handleSubmit = async (e) => {
    e.preventDefault();

>>>>>>> noelox
    if (!selectedAnswer) {
      setFeedback('Please select an answer before submitting.');
      return;
    }

<<<<<<< HEAD
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
=======
    const userId = localStorage.getItem('userId');

    setLoading(true);
    try {
      const res = await api.post('/daily/submit-daily-answer', {
        user_id: userId,
        answer: selectedAnswer,
      });
      const data = res.data;

>>>>>>> noelox
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

<<<<<<< HEAD
  if (loading) {
    return <div>Loading today's question...</div>;
  }

  if (!questionData) {
    return <div>Could not load the daily question. Please refresh.</div>;
  }
=======
  if (loading) return <div>Loading today's question...</div>;
  if (!questionData) return <div>Could not load the daily question. Please refresh.</div>;
>>>>>>> noelox

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

<<<<<<< HEAD
export default DailyQuestion;
=======
export default DailyQuestion;
>>>>>>> noelox
