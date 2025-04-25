'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>✨ AI-Powered YouTube Automation</span>
            </div>
            <h1 className="hero-title">Automate Your YouTube Content Creation</h1>
            <p className="hero-subtitle">
              Create, schedule, and publish engaging YouTube videos with AI-powered automation.
              Save time and grow your channel faster than ever before.
            </p>
            <div className="hero-actions">
              <button 
                className="hero-cta"
                onClick={() => router.push('/signup')}
              >
                Get Started Free
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => router.push('/login')}
              >
                Sign In
              </button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">10,000+</span>
                <span className="hero-stat-label">Content Creators</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">1M+</span>
                <span className="hero-stat-label">Videos Generated</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">98%</span>
                <span className="hero-stat-label">Satisfaction Rate</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-shape"></div>
      </section>

      {/* Features Section */}
      <section className="feature-section">
        <div className="container">
          <h2 className="section-title gradient-text">Powerful Features</h2>
          <p className="section-subtitle">Everything you need to create, manage, and grow your YouTube channel</p>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">AI Content Generation</h3>
              <p>Generate engaging video scripts, titles, and descriptions using advanced AI. Our platform creates content that resonates with your audience.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🗣️</div>
              <h3 className="feature-title">Natural Voice Synthesis</h3>
              <p>Convert your scripts into natural-sounding voiceovers with our advanced voice synthesis technology. Choose from a variety of voices and styles.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3 className="feature-title">Smart Scheduling</h3>
              <p>Schedule your videos for optimal publishing times. Our platform analyzes your audience's behavior to maximize views and engagement.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Performance Analytics</h3>
              <p>Track your videos' performance with comprehensive analytics. Understand what works and optimize your content strategy.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Trend Analysis</h3>
              <p>Discover trending topics in your niche. Our platform identifies popular content ideas to help you stay ahead of the curve.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3 className="feature-title">Seamless Integration</h3>
              <p>Connect directly with YouTube. Our platform handles the entire process from content creation to publishing with just a few clicks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title gradient-text">How It Works</h2>
          <p className="section-subtitle">Three simple steps to automate your YouTube content</p>
          
          <div className="workflow-steps">
            <div className="workflow-step">
              <div className="workflow-step-number">1</div>
              <h3 className="workflow-step-title">Connect Your Channel</h3>
              <p className="workflow-step-description">
                Link your YouTube channel to TubeAutomator with just a few clicks. Our secure OAuth process ensures your account remains protected.
              </p>
            </div>
            
            <div className="workflow-step">
              <div className="workflow-step-number">2</div>
              <h3 className="workflow-step-title">Generate Content</h3>
              <p className="workflow-step-description">
                Use our AI tools to create scripts, titles, descriptions, and voiceovers. Customize everything to match your channel's style.
              </p>
            </div>
            
            <div className="workflow-step">
              <div className="workflow-step-number">3</div>
              <h3 className="workflow-step-title">Schedule & Publish</h3>
              <p className="workflow-step-description">
                Set your publishing schedule and let TubeAutomator handle the rest. Monitor performance and optimize your strategy with our analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="container">
          <h2 className="section-title gradient-text">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">Choose the plan that fits your needs</p>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <div className="pricing-name">Starter</div>
                <div className="pricing-price">$19<span className="text-sm font-normal">/month</span></div>
                <div className="pricing-description">Perfect for content creators just getting started</div>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>5 AI-generated videos per month</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Basic voice synthesis</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Standard scheduling</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Basic analytics</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Email support</span>
                </div>
              </div>
              <button 
                className="btn pricing-cta"
                onClick={() => router.push('/signup?plan=starter')}
              >
                Get Started
              </button>
            </div>
            
            <div className="pricing-card popular">
              <div className="pricing-badge">Most Popular</div>
              <div className="pricing-header">
                <div className="pricing-name">Professional</div>
                <div className="pricing-price">$49<span className="text-sm font-normal">/month</span></div>
                <div className="pricing-description">For serious creators looking to scale</div>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>20 AI-generated videos per month</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Advanced voice synthesis</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Smart scheduling</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Comprehensive analytics</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Priority support</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Trend analysis</span>
                </div>
              </div>
              <button 
                className="btn pricing-cta"
                onClick={() => router.push('/signup?plan=professional')}
              >
                Get Started
              </button>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <div className="pricing-name">Enterprise</div>
                <div className="pricing-price">$99<span className="text-sm font-normal">/month</span></div>
                <div className="pricing-description">For teams and professional studios</div>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Unlimited AI-generated videos</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Premium voice synthesis</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Advanced scheduling</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Advanced analytics & reporting</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Dedicated account manager</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>API access</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Custom integrations</span>
                </div>
              </div>
              <button 
                className="btn pricing-cta"
                onClick={() => router.push('/signup?plan=enterprise')}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonial-section">
        <div className="container">
          <h2 className="section-title gradient-text">What Our Users Say</h2>
          <p className="section-subtitle">Join thousands of content creators who love TubeAutomator</p>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                TubeAutomator has completely transformed my content creation process. I've been able to triple my output while maintaining high quality. The AI-generated scripts are surprisingly good!
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">JD</div>
                <div>
                  <div className="testimonial-name">John Doe</div>
                  <div className="testimonial-title">Tech YouTuber, 500K subscribers</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                As a small channel, I couldn't afford a content team. TubeAutomator has been a game-changer, helping me create consistent, high-quality content that my audience loves.
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">AS</div>
                <div>
                  <div className="testimonial-name">Alice Smith</div>
                  <div className="testimonial-title">Fitness Creator, 50K subscribers</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                The analytics features alone are worth the price. Being able to see what content performs best and then automatically generate more of it has helped my channel grow exponentially.
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">RJ</div>
                <div>
                  <div className="testimonial-name">Robert Johnson</div>
                  <div className="testimonial-title">Gaming Channel, 1.2M subscribers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title gradient-text">Frequently Asked Questions</h2>
          <p className="section-subtitle">Everything you need to know about TubeAutomator</p>
          <div className="max-w-3xl mx-auto">
            <div className="faq-item">
              <div className="faq-question">
                How does the AI content generation work?
              </div>
              <div className="faq-answer">
                Our platform uses advanced AI models to generate video scripts, titles, and descriptions based on your chosen topics and preferences. You can customize the style, tone, and length to match your channel's voice.
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                Do I need technical skills to use TubeAutomator?
              </div>
              <div className="faq-answer">
                Not at all! TubeAutomator is designed to be user-friendly. Our intuitive interface guides you through the entire process, from content creation to publishing, without requiring any technical expertise.
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                Can I customize the AI-generated content?
              </div>
              <div className="faq-answer">
                Absolutely! While our AI creates high-quality content, you have full control to edit, modify, or enhance any part of the generated scripts, titles, or descriptions before publishing.
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                How does the voice synthesis sound?
              </div>
              <div className="faq-answer">
                Our voice synthesis technology produces natural-sounding voiceovers that are often indistinguishable from human narration. You can choose from various voices, accents, and styles to match your content.
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                Can I cancel my subscription anytime?
              </div>
              <div className="faq-answer">
                Yes, you can cancel your subscription at any time. We don't lock you into long-term contracts. If you decide to cancel, you'll continue to have access until the end of your billing period.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Transform Your YouTube Channel?</h2>
          <p className="cta-description">
            Join thousands of content creators who are saving time and growing their channels with TubeAutomator.
          </p>
          <button 
            className="hero-cta"
            onClick={() => router.push('/signup')}
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">
                <Image 
                  src="/images/logo.svg" 
                  alt="TubeAutomator Logo" 
                  width={150} 
                  height={40} 
                />
              </div>
              <p className="footer-description">
                AI-powered YouTube content creation and automation platform for creators of all sizes.
              </p>
            </div>
            
            <div>
              <h3 className="footer-heading">Product</h3>
              <div className="footer-links">
                <Link href="/features" className="footer-link">Features</Link>
                <Link href="/pricing" className="footer-link">Pricing</Link>
                <Link href="/testimonials" className="footer-link">Testimonials</Link>
                <Link href="/faq" className="footer-link">FAQ</Link>
              </div>
            </div>
            
            <div>
              <h3 className="footer-heading">Company</h3>
              <div className="footer-links">
                <Link href="/about" className="footer-link">About Us</Link>
                <Link href="/blog" className="footer-link">Blog</Link>
                <Link href="/careers" className="footer-link">Careers</Link>
                <Link href="/contact" className="footer-link">Contact</Link>
              </div>
            </div>
            
            <div>
              <h3 className="footer-heading">Legal</h3>
              <div className="footer-links">
                <Link href="/terms" className="footer-link">Terms of Service</Link>
                <Link href="/privacy" className="footer-link">Privacy Policy</Link>
                <Link href="/cookies" className="footer-link">Cookie Policy</Link>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-copyright">
              © {new Date().getFullYear()} TubeAutomator. All rights reserved.
            </div>
            <div className="footer-social">
              <Link href="https://twitter.com" className="footer-social-link" target="_blank" rel="noopener noreferrer">Twitter</Link>
              <Link href="https://facebook.com" className="footer-social-link" target="_blank" rel="noopener noreferrer">Facebook</Link>
              <Link href="https://instagram.com" className="footer-social-link" target="_blank" rel="noopener noreferrer">Instagram</Link>
              <Link href="https://linkedin.com" className="footer-social-link" target="_blank" rel="noopener noreferrer">LinkedIn</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
