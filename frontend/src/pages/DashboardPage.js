// DashboardPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Import useNavigate
import { getUserProfile } from './user'; 
import '../App.css';

function Dashboard() {
  const navigate = useNavigate(); // 👈 Setup navigate
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      navigate('/login'); // 👈 Redirect to login if not logged in
      return;
    }

    fetchProfile(userId);
  }, [navigate]);

  const fetchProfile = async (userId) => {
    try {
      const profile = await getUserProfile(userId);
      setUser(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading your profile...</div>;
  if (!user) return <div>Failed to load profile.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Dashboard</h1>
      <h2>Username: {user.username}</h2>
      <h3>Gender: {user.gender || "Not specified"}</h3>
      <h3>Weight: {user.weight} lbs</h3>
      <h3>Points: {user.points}</h3>
      <h3>Badge: {user.badge}</h3>
    </div>
  );
}

export default Dashboard;
