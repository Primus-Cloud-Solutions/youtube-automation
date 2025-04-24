"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For demo purposes, we'll just simulate a successful login
      // In a real app, you would make an API call to authenticate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, any email/password combination works
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ email }));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="logo flex justify-between mb-4">
            <span className="logo-icon">📹</span>
            TubeAutomator
          </Link>
          <h2 className="gradient-text">Sign In</h2>
          <p>Welcome back! Sign in to your account</p>
        </div>

        {error && (
          <div className="card mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--destructive)' }}>
            <p style={{ color: 'var(--destructive)' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn w-full mb-4"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        <div className="flex gap-4 mb-4">
          <button 
            className="btn flex-1"
            style={{ backgroundColor: '#4285F4' }}
            onClick={() => alert('Google authentication would be implemented here')}
          >
            Google
          </button>
          <button 
            className="btn flex-1"
            style={{ backgroundColor: '#333' }}
            onClick={() => alert('GitHub authentication would be implemented here')}
          >
            GitHub
          </button>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link href="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
