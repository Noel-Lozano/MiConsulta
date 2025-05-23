import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    weight: ''
  });

  const [message, setMessage] = useState('');
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
    setMessage('');
    setError('');
    setLoading(true);

    const preparedData = {
      ...formData,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
    };

    try {
      const response = await api.post('/auth/signup', preparedData);
      console.log('Signup successful:', response.data);

      localStorage.setItem('userId', response.data.user_id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.detail === 'Email already registered'
      ) {
        setError('This email is already registered. Please log in instead.');
      } else {
        setError('Signup failed. Please check your form or the backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        {['username', 'email', 'password', 'age', 'gender', 'weight'].map(field => (
          <div key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label><br />
            <input
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required={['username', 'email', 'password', 'weight'].includes(field)}
            />
          </div>
        ))}
        <button type="submit" style={{ marginTop: '10px' }} disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SignupPage;
