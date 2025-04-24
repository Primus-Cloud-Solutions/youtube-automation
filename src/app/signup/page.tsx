'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // For demo purposes, store user in localStorage
      localStorage.setItem('demo_user', JSON.stringify({
        id: 'demo-user-id',
        email: email,
        user_metadata: { full_name: fullName }
      }));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
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
          <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
          <p className="text-muted-foreground">Sign up to get started with TubeAutomator</p>
        </div>
        
        {errorMessage && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          
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
            {loading ? 'Creating account...' : 'Sign Up'}
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
          Already have an account? <Link href="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
