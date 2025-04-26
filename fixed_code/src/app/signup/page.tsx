'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasNumber: false,
    hasSpecial: false
  });
  const { signUp, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting to dashboard');
      router.push('/dashboard');
    }
  }, [user, router]);

  // Check password strength as user types
  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (!passwordStrength.length || !passwordStrength.hasNumber || !passwordStrength.hasSpecial) {
      setErrorMessage('Password does not meet the requirements');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Submitting signup form with:', email, fullName);
      const result = await signUp(email, password, fullName);
      
      if (result.success) {
        console.log('Signup successful:', result);
        
        // Check if email confirmation is required
        if (result.message && result.message.includes('check your email')) {
          setSuccessMessage('Registration successful! Please check your email for a confirmation link.');
          // Clear form
          setFullName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        } else {
          // Redirect to dashboard on successful signup with auto-confirmation
          router.push('/dashboard');
        }
      } else {
        console.error('Signup failed:', result.error);
        setErrorMessage(result.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
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
          <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
          
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-900/50 text-red-200 rounded-md">
              {errorMessage}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-6 p-3 bg-green-900/50 text-green-200 rounded-md">
              {successMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>
            
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
              <div className="mt-2 space-y-1">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${passwordStrength.length ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  <p className={`text-xs ${passwordStrength.length ? 'text-green-400' : 'text-gray-400'}`}>
                    At least 8 characters
                  </p>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  <p className={`text-xs ${passwordStrength.hasNumber ? 'text-green-400' : 'text-gray-400'}`}>
                    Contains at least one number
                  </p>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${passwordStrength.hasSpecial ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  <p className={`text-xs ${passwordStrength.hasSpecial ? 'text-green-400' : 'text-gray-400'}`}>
                    Contains at least one special character
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-md bg-gray-700 border focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  confirmPassword && password !== confirmPassword ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="••••••••"
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-400">
                  Passwords do not match
                </p>
              )}
            </div>
            
            <div className="pt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-green-500 rounded bg-gray-700 border-gray-600"
                  required
                />
                <span className="ml-2 text-sm text-gray-300">
                  I agree to the <Link href="#" className="text-green-500 hover:text-green-400">Terms of Service</Link> and <Link href="#" className="text-green-500 hover:text-green-400">Privacy Policy</Link>
                </span>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
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
                onClick={() => alert('Google signup not implemented in demo')}
              >
                Google
              </button>
              <button
                type="button"
                className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors"
                onClick={() => alert('GitHub signup not implemented in demo')}
              >
                GitHub
              </button>
            </div>
          </div>
          
          {/* Demo account info */}
          <div className="mt-6 p-3 bg-blue-900/30 border border-blue-800 rounded-md">
            <h3 className="text-sm font-medium text-blue-400 mb-1">Already Have a Demo Account?</h3>
            <p className="text-xs text-gray-300">Email: test@example.com</p>
            <p className="text-xs text-gray-300">Password: Password123!</p>
            <div className="mt-2">
              <Link href="/login" className="text-xs text-blue-400 hover:text-blue-300">
                Sign in with demo account →
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-green-500 hover:text-green-400 font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
