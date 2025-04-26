import React, { useState } from 'react';

const AuthenticationSystem = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate authentication process
    setTimeout(() => {
      // Basic validation
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      
      if (!isLogin && !name) {
        setError('Please enter your name');
        setLoading(false);
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }
      
      // Password validation
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        setLoading(false);
        return;
      }
      
      // In a real app, you would call your authentication API here
      // For now, we'll simulate a successful login/signup
      
      // Store auth token in localStorage (in a real app, use secure HTTP-only cookies)
      localStorage.setItem('authToken', 'sample-auth-token');
      localStorage.setItem('user', JSON.stringify({ 
        email, 
        name: isLogin ? 'User' : name,
        id: 'user-123'
      }));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
      
      setLoading(false);
    }, 1500);
  };
  
  const handleGoogleAuth = () => {
    // In a real app, you would redirect to Google OAuth
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('authToken', 'google-auth-token');
      localStorage.setItem('user', JSON.stringify({ 
        email: 'user@gmail.com', 
        name: 'Google User',
        id: 'google-user-123'
      }));
      window.location.href = '/dashboard';
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
          <p>{isLogin ? 'Welcome back!' : 'Start your YouTube automation journey'}</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                disabled={loading}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? "Enter your password" : "Create a password (8+ characters)"}
              disabled={loading}
            />
          </div>
          
          {isLogin && (
            <div className="forgot-password">
              <a href="/forgot-password">Forgot password?</a>
            </div>
          )}
          
          <button 
            type="submit" 
            className={`auth-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-divider">
          <span>OR</span>
        </div>
        
        <button 
          type="button" 
          className="google-button"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 0, 0)">
              <path d="M21.35,11.1H12v3.2h5.59c-0.56,2.68-2.96,4.7-5.59,4.7c-3.35,0-6.07-2.72-6.07-6.07 s2.72-6.07,6.07-6.07c1.53,0,2.92,0.57,3.98,1.51l2.24-2.24C16.54,4.58,14.39,3.7,12,3.7c-4.97,0-9,4.03-9,9s4.03,9,9,9 c5.14,0,8.63-3.67,8.63-8.82c0-0.58-0.07-1.16-0.19-1.73L21.35,11.1z" fill="#4285F4"></path>
              <path d="M5.79,14.07l-2.33,1.77C4.6,17.24,6.19,18.3,8,18.3c1.81,0,3.4-1.06,4.54-2.46l-2.33-1.77 C9.5,14.93,8.75,15.3,8,15.3S6.5,14.93,5.79,14.07z" fill="#34A853"></path>
              <path d="M8,15.3c-0.75,0-1.5-0.37-2.21-1.23l-2.33,1.77C4.6,17.24,6.19,18.3,8,18.3 c1.81,0,3.4-1.06,4.54-2.46l-2.33-1.77C9.5,14.93,8.75,15.3,8,15.3z" fill="#FBBC05"></path>
              <path d="M4.45,10.07L2.12,8.3C3.26,6.94,4.85,5.7,8,5.7c2.39,0,4.54,0.88,6.22,2.31l-2.24,2.24 C10.92,9.27,9.53,8.7,8,8.7C6.19,8.7,4.6,9.76,4.45,10.07z" fill="#EA4335"></path>
            </g>
          </svg>
          Continue with Google
        </button>
        
        <div className="auth-footer">
          {isLogin ? (
            <p>Don't have an account? <button type="button" onClick={() => setIsLogin(false)}>Sign Up</button></p>
          ) : (
            <p>Already have an account? <button type="button" onClick={() => setIsLogin(true)}>Sign In</button></p>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }
        
        .auth-card {
          background: rgba(30, 41, 59, 0.7);
          border-radius: 0.75rem;
          padding: 2.5rem;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .auth-header h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .auth-header p {
          color: #94a3b8;
        }
        
        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 0.75rem;
          border-radius: 0.375rem;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #e2e8f0;
        }
        
        input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.375rem;
          background-color: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f8fafc;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }
        
        input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }
        
        input::placeholder {
          color: #64748b;
        }
        
        .forgot-password {
          text-align: right;
          margin-bottom: 1.5rem;
        }
        
        .forgot-password a {
          color: #3b82f6;
          font-size: 0.875rem;
          text-decoration: none;
        }
        
        .forgot-password a:hover {
          text-decoration: underline;
        }
        
        .auth-button {
          width: 100%;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1.5rem;
        }
        
        .auth-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .auth-button:active {
          transform: translateY(0);
        }
        
        .auth-button.loading {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .auth-divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
        }
        
        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .auth-divider span {
          padding: 0 1rem;
          color: #94a3b8;
          font-size: 0.875rem;
        }
        
        .google-button {
          width: 100%;
          padding: 0.75rem 1.5rem;
          background-color: transparent;
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }
        
        .google-button:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .auth-footer {
          margin-top: 2rem;
          text-align: center;
          color: #94a3b8;
          font-size: 0.875rem;
        }
        
        .auth-footer button {
          background: none;
          border: none;
          color: #3b82f6;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
        }
        
        .auth-footer button:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 640px) {
          .auth-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthenticationSystem;
