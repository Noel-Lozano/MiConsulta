import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login'); // Make sure this matches your App.js login route
  };

  return (
    <nav style={{ padding: '10px', backgroundColor: '#eee', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link to="/dashboard" style={{ marginRight: '10px' }}>Dashboard</Link>
        <Link to="/chat" style={{ marginRight: '10px' }}>Chatbot</Link>
        <Link to="/daily" style={{ marginRight: '10px' }}>Daily Question</Link>
        <Link to="/challenges" style={{ marginRight: '10px' }}>Challenges</Link>
        
      </div>
      <div>
        <button onClick={handleLogout} style={{ padding: '5px 10px' }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;