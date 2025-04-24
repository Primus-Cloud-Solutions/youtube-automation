'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // For demo purposes, allow login with test credentials
      if (email === 'test@example.com' && password === 'password123') {
        // Store demo user in localStorage
        localStorage.setItem('demo_user', JSON.stringify({
          id: 'demo-user-id',
          email: 'test@example.com',
          user_metadata: { full_name: 'Demo User' }
        }));
        
        // Redirect to dashboard
        router.push('/dashboard');
        return;
      }
      
      const result = await signIn(email, password);
      
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to sign in');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      
      // For demo purposes
      localStorage.setItem('demo_user', JSON.stringify({
        id: 'google-demo-user-id',
        email: 'google-user@example.com',
        user_metadata: { full_name: 'Google Demo User' }
      }));
      
      // Redirect to dashboard
      router.push('/dashboard');
      
      // Uncomment for actual implementation
      // await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
      setErrorMessage('Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      
      // For demo purposes
      localStorage.setItem('demo_user', JSON.stringify({
        id: 'github-demo-user-id',
        email: 'github-user@example.com',
        user_metadata: { full_name: 'GitHub Demo User' }
      }));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('GitHub sign in error:', error);
      setErrorMessage('Failed to sign in with GitHub');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="logo mb-6">
            <span className="logo-icon">📹</span>TubeAutomator
          </Link>
          <h1 className="text-2xl font-bold mb-2">Sign In</h1>
          <p className="text-muted-foreground">Welcome back! Sign in to your account</p>
        </div>
        
        {errorMessage && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn w-full" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-divider">
          <span>Or continue with</span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleGoogleSignIn}
            className="btn btn-outline flex-1"
            disabled={loading}
          >
            Google
          </button>
          <button 
            onClick={handleGitHubSignIn}
            className="btn btn-outline flex-1"
            disabled={loading}
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
