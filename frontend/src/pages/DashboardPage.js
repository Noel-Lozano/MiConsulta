import React from 'react';
import '../App.css';

function Dashboard({ user }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>User Dashboard</h1>
      <h2>Username: {user.username}</h2>
      <h3>Gender: {user.gender}</h3>
      <h3>Weight: {user.weight} lbs</h3>
      <h3>Points: {user.points}</h3>
      <h3>Badge: {user.badge}</h3>
    </div>
  );
}

export default Dashboard;