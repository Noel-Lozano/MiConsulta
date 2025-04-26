import React, { useState } from 'react';

function SignUpPage({ onSignUp }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Username, Email, and Weight are REQUIRED
    if (!formData.username || !formData.email || !formData.weight) {
      setError('Please fill out all required fields (Username, Email, Weight).');
      return;
    }

    // No errors, proceed
    setError('');
    onSignUp(formData); // Pass data back to App
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
