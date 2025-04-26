import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    if (onLogin) onLogin(); 
    navigate('/dashboard'); 
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Bienvenido a MiConsulta</h1>
      <h2>Welcome to MiConsulta</h2>
      <button 
        onClick={handleLogin} 
        style={{ padding: '10px 20px', margin: '10px', fontSize: '16px' }}
      >
        Log In
      </button>
      <button 
        onClick={() => alert("Redirect to Sign Up (not built yet)")} 
        style={{ padding: '10px 20px', margin: '10px', fontSize: '16px' }}
      >
        Sign Up
      </button>
    </div>
  );
}

export default LoginPage;
