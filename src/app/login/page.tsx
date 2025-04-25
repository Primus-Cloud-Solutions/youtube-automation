'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      } else {
        setErrorMessage(result.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('test@example.com');
    setPassword('Password123!');
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await signIn('test@example.com', 'Password123!');
      
      if (result.success) {
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      } else {
        setErrorMessage(result.error || 'Demo login failed');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      setErrorMessage('An unexpected error occurred with demo login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="border-b border-gray-800 p-4">
        <Link href="/" className="text-xl font-bold flex items-center">
          <span className="text-green-500 mr-2">📹</span>
          <span>TubeAutomator</span>
        </Link>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-900/50 text-red-200 rounded-md">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors"
                onClick={() => alert('Google login not implemented in demo')}
              >
                Google
              </button>
              <button
                type="button"
                className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors"
                onClick={() => alert('GitHub login not implemented in demo')}
              >
                GitHub
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-green-500 hover:text-green-400 font-medium"
              >
                Use Demo Account
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-green-500 hover:text-green-400 font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
