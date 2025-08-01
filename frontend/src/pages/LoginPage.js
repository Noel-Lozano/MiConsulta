import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      console.log('Login success:', response.data);

      // ✅ Store required auth data
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('userId', response.data.user_id);
      localStorage.setItem('isLoggedIn', 'true'); // optional but used in your ProtectedRoute

      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please check credentials or server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', marginTop: '100px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label><br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }} disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Don't have an account?</p>
        <button
          onClick={() => navigate('/signup')}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
          disabled={loading}
        >
          Sign Up
        </button>
      </div>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default LoginPage;