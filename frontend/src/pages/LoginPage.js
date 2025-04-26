import React, { useState } from 'react';

function LoginPage({ onLogin }) {
  const [showWelcome, setShowWelcome] = useState(false);

  const handleLogin = () => {
    setShowWelcome(true);
    onLogin(); // Tell App that the user logged in
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {!showWelcome ? (
        <>
          <h1>Bienvenido a MiConsulta</h1>
          <h2>Welcome to MiConsulta</h2>
          <button 
            onClick={handleLogin} 
            style={{ padding: '10px 20px', margin: '10px', fontSize: '16px' }}
          >
            Log In
          </button>
          <button 
            onClick={() => alert("Redirect to Sign Up (not built yet)")} 
            style={{ padding: '10px 20px', margin: '10px', fontSize: '16px' }}
          >
            Sign Up
          </button>
        </>
      ) : (
        <>
          <h1>Bienvenido a MiConsulta!</h1>
          <h2>Welcome to MiConsulta!</h2>
        </>
      )}
    </div>
  );
}

export default LoginPage;
