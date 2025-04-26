'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="glass-card p-8 max-w-md w-full text-center">
            <h1 className="gradient-text text-3xl mb-4">Something went wrong</h1>
            <p className="mb-6">We encountered an error while rendering this component.</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => this.setState({ hasError: false })} 
                className="btn"
              >
                Try Again
              </button>
              <Link href="/" className="btn btn-outline">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
