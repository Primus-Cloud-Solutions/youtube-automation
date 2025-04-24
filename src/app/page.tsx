import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div>
      {/* Header */}
      <header className="header container">
        <Link href="/" className="logo">
          <span className="logo-icon">📹</span>
          TubeAutomator
        </Link>
        <nav className="nav">
          <Link href="#features" className="nav-item">Features</Link>
          <Link href="#pricing" className="nav-item">Pricing</Link>
          <Link href="#faq" className="nav-item">FAQ</Link>
          <Link href="/login" className="nav-item">Login</Link>
          <Link href="/signup" className="button primary">Get Started</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="gradient-text">Automate Your YouTube Success</h1>
          <p>Create, schedule, and publish engaging YouTube videos with AI-powered automation</p>
          <div className="flex gap-4 justify-between">
            <Link href="/signup" className="btn">Start Free Trial</Link>
            <Link href="#pricing" className="btn btn-outline">View Pricing</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <h2 className="section-title gradient-text">Powerful YouTube Automation</h2>
          <p className="section-subtitle">Everything you need to grow your channel without the hassle</p>
          
          <div className="grid">
            <div className="card feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Content Generation</h3>
              <p>Generate video scripts, descriptions, and titles using advanced AI technology</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">📅</div>
              <h3>Smart Scheduling</h3>
              <p>Schedule videos for optimal posting times to maximize views and engagement</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">📊</div>
              <h3>Performance Analytics</h3>
              <p>Track your channel growth with detailed analytics and actionable insights</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Trend Analysis</h3>
              <p>Discover trending topics in your niche to stay ahead of the competition</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <div className="container">
          <h2 className="section-title gradient-text">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">Choose the plan that fits your needs</p>
          
          <div className="grid">
            <div className="card pricing-card">
              <h3>Starter</h3>
              <div className="price">$5<span>/month</span></div>
              <ul className="pricing-features">
                <li>5 videos per month</li>
                <li>Basic analytics</li>
                <li>Standard video quality</li>
                <li>Email support</li>
              </ul>
              <Link href="/signup?plan=starter" className="btn btn-outline">Get Started</Link>
            </div>
            
            <div className="card pricing-card popular">
              <div className="popular-badge">Most Popular</div>
              <h3>Professional</h3>
              <div className="price">$15<span>/month</span></div>
              <ul className="pricing-features">
                <li>20 videos per month</li>
                <li>Advanced analytics</li>
                <li>HD video quality</li>
                <li>Priority support</li>
                <li>Custom thumbnails</li>
              </ul>
              <Link href="/signup?plan=professional" className="btn">Get Started</Link>
            </div>
            
            <div className="card pricing-card">
              <h3>Enterprise</h3>
              <div className="price">$29<span>/month</span></div>
              <ul className="pricing-features">
                <li>Unlimited videos</li>
                <li>Premium analytics</li>
                <li>4K video quality</li>
                <li>Dedicated support</li>
                <li>Custom thumbnails</li>
                <li>Multi-channel management</li>
              </ul>
              <Link href="/signup?plan=enterprise" className="btn btn-outline">Get Started</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="features" id="faq">
        <div className="container">
          <h2 className="section-title gradient-text">Frequently Asked Questions</h2>
          
          <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'}}>
            <div className="card">
              <h3 className="text-xl font-bold mb-2">How does the AI content generation work?</h3>
              <p>Our AI analyzes trending topics in your niche and generates original scripts, titles, and descriptions based on your channel's style and audience preferences.</p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-bold mb-2">Do I need technical skills to use TubeAutomator?</h3>
              <p>Not at all! Our platform is designed to be user-friendly with an intuitive interface. If you can use YouTube, you can use TubeAutomator.</p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-bold mb-2">Can I cancel my subscription anytime?</h3>
              <p>Yes, you can cancel your subscription at any time with no questions asked. We don't believe in long-term contracts or hidden fees.</p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-bold mb-2">Will my audience know the content is AI-generated?</h3>
              <p>Our AI is trained to create natural, engaging content that matches your voice and style. Most creators report that their audience can't tell the difference.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title gradient-text">Ready to Revolutionize Your YouTube Channel?</h2>
            <p className="section-subtitle">Join thousands of content creators who are saving time and growing their audience with TubeAutomator</p>
            <Link href="/signup" className="btn">Start Your Free Trial</Link>
            <p className="text-sm mt-4">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-sm">© 2025 TubeAutomator. All rights reserved.</p>
      </footer>
    </div>
  );
}
