import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../App.css';

function DailyQuestion() {
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchQuestion(userId);
  }, [navigate]);

  const fetchQuestion = async (userId) => {
    setLoading(true);
    try {
      const res = await api.get(`/daily-question/genai?user_id=${userId}`);
      const data = res.data;

      if (data.question && data.options) {
        setQuestionData(data);
      } else {
        setQuestionData(null);
        setFeedback("Failed to load a valid question.");
      }
    } catch (error) {
      console.error("Error fetching daily question:", error);
      setQuestionData(null);
      setFeedback("Server error. Please try again later.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAnswer) {
      setFeedback('Please select an answer before submitting.');
      return;
    }

    // You can customize this to check correctness client-side if needed
    setFeedback(`Answer submitted: ${selectedAnswer}`);
  };

  if (loading) return <div>Loading today's question...</div>;

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>🩺 Daily Medical Challenge</h1>
      {questionData ? (
        <form onSubmit={handleSubmit}>
          <p>{questionData.question}</p>
          {questionData.options.map((option) => (
            <div key={option}>
              <label>
                <input
                  type="radio"
                  value={option}
                  name="answer"
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                />
                {option}
              </label>
            </div>
          ))}
          <button type="submit" style={{ marginTop: '10px' }}>Submit Answer</button>
        </form>
      ) : (
        <p>{feedback}</p>
      )}

      {feedback && (
        <div style={{ marginTop: '20px' }}>
          <h3>Result:</h3>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}

export default DailyQuestion;