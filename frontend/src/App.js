import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import DailyQuestion from './pages/DailyQuestion';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/daily" element={<DailyQuestion />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<LoginPage />} /> {/* Redirect unknown routes to login */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
