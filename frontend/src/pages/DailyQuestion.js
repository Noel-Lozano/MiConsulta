import React, {useState } from 'react';
import api from '../api/axios'; 
import '../App.css'; 

function DailyQuestion() {
    const [questionData, setQuestionData] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
  
    // Load the question when the page first loads
    const fetchQuestion = async () => {
      setLoading(true);
      try {
        const response = await api.get('/daily/daily-question');
        setQuestionData(response.data);
      } catch (error) {
        console.error('Error fetching daily question:', error);
        setQuestionData(null); // still set something to avoid crashing
      }
      setLoading(false);
    };
  
    // Call it once when the page mounts
    React.useEffect(() => {
      fetchQuestion();
    }, []);
  
    // Submit selected answer
    const handleSubmit = async (e) => {
      e.preventDefault(); // prevent page reload
      if (!selectedAnswer) {
        setFeedback('Please select an answer before submitting.');
        return;
      }
  
      setLoading(true);
      try {
        const response = await api.post('/daily/submit-daily-answer', {
          user_id: "demo-user", // placeholder for real user
          answer: selectedAnswer
        });
  
        if (response.data.correct) {
          setFeedback(`Correct! Streak: ${response.data.new_streak}`);
        } else {
          setFeedback('Wrong answer. Try again tomorrow!');
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