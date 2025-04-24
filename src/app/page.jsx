import React from 'react';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Automate Your YouTube Success</h1>
            <p className="hero-subtitle">Create, schedule, and publish engaging YouTube videos with AI-powered automation</p>
            <div className="cta-buttons">
              <a href="/signup" className="button primary">Start Free Trial</a>
              <a href="#pricing" className="button outline">View Pricing</a>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-container">
              <div className="dashboard-preview"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <h2 className="section-title">Powerful YouTube Automation</h2>
          <p className="section-subtitle">Everything you need to grow your channel without the hassle</p>
          
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Content Generation</h3>
              <p>Generate video scripts, descriptions, and titles using advanced AI technology</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Smart Scheduling</h3>
              <p>Schedule videos for optimal posting times to maximize views and engagement</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Performance Analytics</h3>
              <p>Track your channel growth with detailed analytics and actionable insights</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Trend Analysis</h3>
              <p>Discover trending topics in your niche to stay ahead of the competition</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to YouTube automation</p>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Connect Your Channel</h3>
              <p>Link your YouTube account with our secure API integration</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Create Content</h3>
              <p>Generate or upload video topics and let our AI handle the rest</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Schedule & Publish</h3>
              <p>Set your publishing schedule and watch your channel grow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <div className="container">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">Choose the plan that fits your needs</p>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Starter</h3>
                <div className="price">$29<span>/month</span></div>
              </div>
              <ul className="pricing-features">
                <li>5 videos per month</li>
                <li>Basic analytics</li>
                <li>Standard video quality</li>
                <li>Email support</li>
              </ul>
              <a href="/signup?plan=starter" className="button outline full-width">Get Started</a>
            </div>
            
            <div className="pricing-card popular">
              <div className="popular-badge">Most Popular</div>
              <div className="pricing-header">
                <h3>Professional</h3>
                <div className="price">$79<span>/month</span></div>
              </div>
              <ul className="pricing-features">
                <li>20 videos per month</li>
                <li>Advanced analytics</li>
                <li>HD video quality</li>
                <li>Priority support</li>
                <li>Custom thumbnails</li>
              </ul>
              <a href="/signup?plan=professional" className="button primary full-width">Get Started</a>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <div className="price">$199<span>/month</span></div>
              </div>
              <ul className="pricing-features">
                <li>Unlimited videos</li>
                <li>Premium analytics</li>
                <li>4K video quality</li>
                <li>Dedicated support</li>
                <li>Custom thumbnails</li>
                <li>Multi-channel management</li>
              </ul>
              <a href="/signup?plan=enterprise" className="button outline full-width">Get Started</a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"TubeAutomator has completely transformed how I manage my YouTube channel. I've increased my upload frequency by 300% while actually spending less time on content creation."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <p>Tech Reviewer, 250K subscribers</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The AI-generated content is surprisingly good. My audience hasn't noticed any difference, but I'm saving 20+ hours per week. The ROI is incredible."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <h4>Mark Williams</h4>
                  <p>Gaming Channel, 500K subscribers</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"As a small business owner, I never had time to maintain a YouTube presence. TubeAutomator changed that completely. Now we publish twice weekly with minimal effort."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <h4>Jessica Chen</h4>
                  <p>Small Business Owner, 75K subscribers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq" id="faq">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How does the AI content generation work?</h3>
              <p>Our AI analyzes trending topics in your niche and generates original scripts, titles, and descriptions based on your channel's style and audience preferences.</p>
            </div>
            
            <div className="faq-item">
              <h3>Do I need technical skills to use TubeAutomator?</h3>
              <p>Not at all! Our platform is designed to be user-friendly with an intuitive interface. If you can use YouTube, you can use TubeAutomator.</p>
            </div>
            
            <div className="faq-item">
              <h3>Can I cancel my subscription anytime?</h3>
              <p>Yes, you can cancel your subscription at any time with no questions asked. We don't believe in long-term contracts or hidden fees.</p>
            </div>
            
            <div className="faq-item">
              <h3>Will my audience know the content is AI-generated?</h3>
              <p>Our AI is trained to create natural, engaging content that matches your voice and style. Most creators report that their audience can't tell the difference.</p>
            </div>
            
            <div className="faq-item">
              <h3>How secure is my YouTube account with your platform?</h3>
              <p>We use OAuth 2.0 for secure authentication and never store your passwords. Your account security is our top priority.</p>
            </div>
            
            <div className="faq-item">
              <h3>Do you offer a free trial?</h3>
              <p>Yes! We offer a 14-day free trial so you can experience the full power of TubeAutomator before committing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Revolutionize Your YouTube Channel?</h2>
          <p>Join thousands of content creators who are saving time and growing their audience with TubeAutomator</p>
          <a href="/signup" className="button primary large">Start Your Free Trial</a>
          <p className="no-credit-card">No credit card required • 14-day free trial</p>
        </div>
      </section>

      <style jsx>{`
        /* Landing Page Styles */
        .landing-page {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          color: #f8fafc;
          line-height: 1.6;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        section {
          padding: 5rem 0;
        }
        
        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          position: relative;
          overflow: hidden;
        }
        
        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), 
                            radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
          z-index: 1;
        }
        
        .hero .container {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          min-height: 80vh;
        }
        
        .hero-content {
          flex: 1;
          max-width: 600px;
        }
        
        .hero h1 {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2.5rem;
          color: #94a3b8;
        }
        
        .cta-buttons {
          display: flex;
          gap: 1rem;
        }
        
        .button {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .button.primary {
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          color: white;
        }
        
        .button.outline {
          border: 2px solid #3b82f6;
          color: #3b82f6;
        }
        
        .button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .button.outline:hover {
          background-color: rgba(59, 130, 246, 0.1);
          transform: translateY(-2px);
        }
        
        .hero-image {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }
        
        .image-container {
          position: relative;
          width: 100%;
          max-width: 500px;
        }
        
        .dashboard-preview {
          width: 100%;
          height: 350px;
          background: rgba(30, 41, 59, 0.7);
          border-radius: 0.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .dashboard-preview::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: rgba(59, 130, 246, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        /* Features Section */
        .features {
          background-color: #0f172a;
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .section-subtitle {
          font-size: 1.25rem;
          text-align: center;
          margin-bottom: 4rem;
          color: #94a3b8;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        
        .feature-card {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 0.5rem;
          padding: 2rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
        }
        
        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .feature-card p {
          color: #94a3b8;
        }
        
        /* How It Works Section */
        .how-it-works {
          background-color: #1e293b;
        }
        
        .steps {
          display: flex;
          justify-content: space-between;
          gap: 2rem;
          margin-top: 3rem;
        }
        
        .step {
          flex: 1;
          text-align: center;
          position: relative;
        }
        
        .step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 2.5rem;
          right: -1rem;
          width: 2rem;
          height: 2px;
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
        }
        
        .step-number {
          width: 5rem;
          height: 5rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 auto 1.5rem;
          color: white;
        }
        
        .step h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .step p {
          color: #94a3b8;
        }
        
        /* Pricing Section */
        .pricing {
          background-color: #0f172a;
        }
        
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }
        
        .pricing-card {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 0.5rem;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
          transition: transform 0.3s ease;
        }
        
        .pricing-card:hover {
          transform: translateY(-5px);
        }
        
        .pricing-card.popular {
          border: 2px solid #3b82f6;
          transform: scale(1.05);
        }
        
        .pricing-card.popular:hover {
          transform: scale(1.05) translateY(-5px);
        }
        
        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          color: white;
          padding: 0.25rem 1rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .pricing-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .pricing-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .price {
          font-size: 3rem;
          font-weight: 800;
          color: #3b82f6;
        }
        
        .price span {
          font-size: 1rem;
          font-weight: 400;
          color: #94a3b8;
        }
        
        .pricing-features {
          list-style-type: none;
          padding: 0;
          margin: 0 0 2rem;
        }
        
        .pricing-features li {
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
          padding-left: 1.5rem;
        }
        
        .pricing-features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #3b82f6;
        }
        
        .button.full-width {
          display: block;
          width: 100%;
          text-align: center;
        }
        
        /* Testimonials Section */
        .testimonials {
          background-color: #1e293b;
        }
        
        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }
        
        .testimonial-card {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 0.5rem;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .testimonial-content {
          margin-bottom: 1.5rem;
          font-style: italic;
          position: relative;
        }
        
        .testimonial-content::before {
          content: '"';
          font-size: 4rem;
          position: absolute;
          top: -2rem;
          left: -1rem;
          color: rgba(59, 130, 246, 0.2);
          font-family: Georgia, serif;
        }
        
        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .author-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        }
        
        .author-info h4 {
          font-weight: 600;
          margin: 0;
        }
        
        .author-info p {
          color: #94a3b8;
          font-size: 0.875rem;
          margin: 0;
        }
        
        /* FAQ Section */
        .faq {
          background-color: #0f172a;
        }
        
        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }
        
        .faq-item {
          margin-bottom: 2rem;
        }
        
        .faq-item h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #3b82f6;
        }
        
        .faq-item p {
          color: #94a3b8;
        }
        
        /* CTA Section */
        .cta {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          text-align: center;
          padding: 5rem 0;
        }
        
        .cta h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .cta p {
          font-size: 1.25rem;
          color: #94a3b8;
          margin-bottom: 2rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .button.large {
          padding: 1rem 2.5rem;
          font-size: 1.125rem;
        }
        
        .no-credit-card {
          margin-top: 1rem;
          font-size: 0.875rem;
          color: #94a3b8;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .hero .container {
            flex-direction: column;
            text-align: center;
            padding-top: 3rem;
            padding-bottom: 3rem;
          }
          
          .hero-content {
            margin-bottom: 3rem;
          }
          
          .hero h1 {
            font-size: 2.5rem;
          }
          
          .cta-buttons {
            justify-content: center;
          }
          
          .steps {
            flex-direction: column;
          }
          
          .step:not(:last-child)::after {
            display: none;
          }
          
          .pricing-card.popular {
            transform: none;
          }
          
          .pricing-card.popular:hover {
            transform: translateY(-5px);
          }
          
          .faq-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
