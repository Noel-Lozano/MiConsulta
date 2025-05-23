import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar'; 

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
    <>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
        <h1>Welcome, {user.username}!</h1>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Weight:</strong> {user.weight} lbs</p>
        <p><strong>Points:</strong> {user.points}</p>
        <p><strong>Badge:</strong> {user.badge}</p>
      </div>
    </>
  );
};

export default DashboardPage;
