
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../api/user'; // Adjust path if needed
import '../App.css'; // Optional for any custom global styles

function SignUpPage({ onSignUp }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    gender: '',
    age: '',
    weight: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.weight) {
      setError('Please fill out all required fields: Username, Email, Password, and Weight.');
      return;
    }

    setLoading(true);
    try {
      const response = await signupUser(formData); // 🎯 API call to signup
      console.log('Signup success:', response);

      // 🌟 Save user ID
      localStorage.setItem('userId', response.user_id);

      if (onSignUp) onSignUp(response); 
      navigate('/dashboard'); // ✅ Go to Dashboard after signup!

    } catch (err) {
      console.error('Signup failed:', err);
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-green-600 text-center">Create your MiConsulta Account</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            name="username"
            placeholder="Username *"
            value={formData.username}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password *"
            value={formData.password}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="gender"
            placeholder="Gender (Optional)"
            value={formData.gender}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="age"
            placeholder="Age (Optional)"
            value={formData.age}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="weight"
            placeholder="Weight (lbs) *"
            value={formData.weight}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={() => navigate('/login')}
          className="mt-4 text-green-600 hover:underline"
        >
          Already have an account? Log In
        </button>
      </div>
    </div>
  );
}

export default SignUpPage;
