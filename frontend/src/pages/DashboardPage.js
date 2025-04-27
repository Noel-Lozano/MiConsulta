import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get(`/users/${userId}/profile`);
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (!user) return <p>Loading your profile...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h1>Welcome, {user.username}!</h1>
      <p>Gender: {user.gender}</p>
      <p>Age: {user.age}</p>
      <p>Weight: {user.weight} lbs</p>
      <p>Points: {user.points}</p>
      <p>Badge: {user.badge}</p>
    </div>
  );
};

export default DashboardPage;
