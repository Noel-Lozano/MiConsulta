import React, { useState } from 'react';
import { createUser } from './user'; 

function SignUpPage({ onSignUp }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',   // Add password field!
    gender: '',
    age: '',
    weight: ''
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

    if (!formData.username || !formData.email || !formData.password || !formData.weight) {
      setError('Please fill out all required fields (Username, Email, Password, Weight).');
      return;
    }

    try {
      const response = await createUser(formData); // 📩 API call to backend
      console.log('User created:', response);

      localStorage.setItem('userId', response.id); 
      
      if (onSignUp) onSignUp(response);  // Optional: notify parent App
    } catch (error) {
      console.error('Signup failed:', error);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Create your MiConsulta Account</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          name="username"
          placeholder="Username *"
          value={formData.username}
          onChange={handleChange}
          style={{ margin: '10px', padding: '10px', width: '250px' }}
        />
        <input
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
          style={{ margin: '10px', padding: '10px', width: '250px' }}
        />
        <input
          name="password"
          placeholder="Password *"
          type="password"
          value={formData.password}
          onChange={handleChange}
          style={{ margin: '10px', padding: '10px', width: '250px' }}
        />
        <input
          name="gender"
          placeholder="Gender (Optional)"
          value={formData.gender}
          onChange={handleChange}
          style={{ margin: '10px', padding: '10px', width: '250px' }}
        />
        <input
          name="age"
          placeholder="Age (Optional)"
          value={formData.age}
          onChange={handleChange}
          style={{ margin: '10px', padding: '10px', width: '250px' }}
        />
        <input
          name="weight"
          placeholder="Weight (lbs) *"
          value={formData.weight}
          onChange={handleChange}
          style={{ margin: '10px', padding: '10px', width: '250px' }}
        />

        <button type="submit" style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUpPage;
