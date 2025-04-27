import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './user'; 

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill out both email and password.');
      return;
    }

    try {
      const response = await loginUser(formData.email, formData.password);
      console.log('Login success:', response);

      // 🌟 THIS IS WHERE you save to localStorage:
      localStorage.setItem('userId', response.id);

      if (onLogin) onLogin(); // Notify parent App if needed
      navigate('/dashboard'); // Redirect to dashboard

    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Bienvenido a MiConsulta</h1>
      <h2>Welcome to MiConsulta</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ margin: '10px', padding: '10px', width: '250px' }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={{ margin: '10px', padding: '10px', width: '250px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', margin: '10px', fontSize: '16px' }}>
          Log In
        </button>
      </form>

      <button 
        onClick={() => navigate('/signup')} 
        style={{ padding: '10px 20px', margin: '10px', fontSize: '16px' }}
      >
        Sign Up
      </button>
    </div>
  );
}

export default LoginPage;
