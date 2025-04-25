'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, AuthProvider } from '../context/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Create a safe component that uses useAuth inside AuthProvider
function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Add demo login for testing purposes
      if (email === 'test@example.com' && password === 'password123') {
        // Simulate successful login with demo user
        router.push('/dashboard');
        return;
      }
      
      const result = await signIn(email, password);
      
      if (!result.success) {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Redirect happens in the signInWithGoogle function
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(err);
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
              disabled={loading}
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
              disabled={loading}
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
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            Google
          </button>
          <button 
            className="btn flex-1"
            style={{ backgroundColor: '#333' }}
            disabled={true}
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

// Wrap the component with AuthProvider
export default function Login() {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  );
}
