import React, { useState } from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';


function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error('Error fetching answer:', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Ask a Health Question</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask any health question..."
        />
        <button type="submit">Ask</button>
      </form>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        answer && (
          <div>
            <h2>Answer:</h2>
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        )
      )}
    </div>
  );
}

export default App;