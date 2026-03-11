import React, { useState, useEffect } from 'react';
import './Auth.css';

const Auth = ({ onLoginSuccess, onBack, initialIsLogin = false }) => {
  // Application state
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // UI state for password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setErrorMessage(''); 

    // Choose the right backend door
    const url = isLogin 
        ? 'http://localhost:5000/api/auth/login' 
        : 'http://localhost:5000/api/auth/register';

    const payload = isLogin 
        ? { email, password } 
        : { username, email, password };

    try {
        // Send the data across the CORS bridge
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong!');
        }

        if (isLogin) {
            // SUCCESS! Save the VIP wristband to the browser
            localStorage.setItem('token', data.token);
            onLoginSuccess(); // Tell the app we are logged in
        } else {
            alert('Registration successful! Please log in.');
            setIsLogin(true); // Switch to login view
            setPassword('');  // Clear password for security
        }
    } catch (error) {
        setErrorMessage(error.message);
    }
  };

  // NEW: Sync the state if the prop changes!
  useEffect(() => {
    setIsLogin(initialIsLogin);
  }, [initialIsLogin]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage(''); // Clear errors when switching modes
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        
        {/* Left Side Branding */}
        <div className="auth-left">
          <div className="auth-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path><path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path><path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
          </div>
          
          <h2>Precision forecasts at your fingertips.</h2>
          <p>Join thousands of users getting hyper-local weather alerts and beautiful visualizations every day.</p>
          
          <ul className="auth-features">
            <li>
              <div className="feature-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              Real-time severe weather alerts
            </li>
            <li>
              <div className="feature-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              Interactive satellite maps
            </li>
            <li>
              <div className="feature-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              10-day hourly precision
            </li>
          </ul>

          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
        </div>

        {/* Right Side Form */}
        <div className="auth-right">
          <h3>{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
          <p className="auth-subtitle">
            {isLogin ? 'Log in to access your dashboard.' : 'Start your journey with us today.'}
          </p>

          {/* Styled Error Message */}
          {errorMessage && (
            <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid #f87171' }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Username</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <input 
                    type="text" 
                    className="auth-input" 
                    placeholder="Choose a unique username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <input 
                  type="email" 
                  className="auth-input" 
                  placeholder="email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="auth-input" 
                  placeholder="Min. 8 characters" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                {/* Password visibility toggle */}
                <svg onClick={() => setShowPassword(!showPassword)} className="input-icon right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          <div className="divider">OR</div>

          {/* Trigger the onBack function passed from App.jsx */}
          <button type="button" className="btn-secondary" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Weather
          </button>

          <p className="auth-footer">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button className="auth-link" type="button" onClick={toggleMode}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;