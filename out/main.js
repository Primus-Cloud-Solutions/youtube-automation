// Main JavaScript for the YouTube Automation Platform
document.addEventListener('DOMContentLoaded', function() {
  // Create stars background animation
  createStars();
  
  // Initialize the application
  initApp();
  
  // Add event listeners
  setupEventListeners();
});

// Create stars background animation
function createStars() {
  const stars = document.getElementById('stars');
  if (!stars) return;
  
  // Clear existing stars
  stars.innerHTML = '';
  
  const count = 100;
  
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    
    // Random position
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    // Random size
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // Random animation delay
    star.style.animationDelay = `${Math.random() * 4}s`;
    
    stars.appendChild(star);
  }
  
  // Recreate stars on window resize
  window.addEventListener('resize', createStars);
}

// Initialize the application
function initApp() {
  const root = document.getElementById('root');
  if (!root) return;
  
  // Check if user is logged in
  const user = getUser();
  
  if (user) {
    // User is logged in, show dashboard
    renderDashboard(root, user);
  } else {
    // User is not logged in, show landing page or login page
    const path = window.location.pathname;
    
    if (path === '/login') {
      renderLoginPage(root);
    } else if (path === '/signup') {
      renderSignupPage(root);
    } else {
      renderLandingPage(root);
    }
  }
}

// Get user from localStorage
function getUser() {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
}

// Set user in localStorage
function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// Clear user from localStorage
function clearUser() {
  localStorage.removeItem('user');
}

// Setup event listeners
function setupEventListeners() {
  // Handle navigation
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href').startsWith('/')) {
      e.preventDefault();
      navigateTo(link.getAttribute('href'));
    }
  });
}

// Navigate to a page
function navigateTo(path) {
  window.history.pushState({}, '', path);
  initApp();
}

// Render landing page
function renderLandingPage(container) {
  container.innerHTML = `
    <div class="min-h-screen">
      <header class="container py-4 flex justify-between items-center">
        <a href="/" class="logo">
          <span class="logo-icon">📹</span>
          TubeAutomator
        </a>
        <nav class="flex gap-4">
          <a href="/login" class="btn btn-outline">Sign In</a>
          <a href="/signup" class="btn">Sign Up</a>
        </nav>
      </header>
      
      <section class="container py-4 flex flex-col items-center justify-center text-center" style="min-height: 80vh;">
        <h1 class="gradient-text text-4xl md:text-5xl font-bold mb-6">Automate Your YouTube Content</h1>
        <p class="text-xl mb-8 max-w-2xl">Create, schedule, and publish engaging YouTube videos with AI-powered automation. Save time and grow your channel faster.</p>
        <div class="flex gap-4">
          <a href="/signup" class="btn">Get Started</a>
          <a href="/login" class="btn btn-outline">Sign In</a>
        </div>
      </section>
    </div>
  `;
}

// Render login page
function renderLoginPage(container) {
  container.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <a href="/" class="logo flex justify-between mb-4">
            <span class="logo-icon">📹</span>
            TubeAutomator
          </a>
          <h2 class="gradient-text">Sign In</h2>
          <p>Welcome back! Sign in to your account</p>
        </div>
        
        <div id="error-message" class="card mb-4" style="display: none; background-color: rgba(239, 68, 68, 0.1); border-color: var(--destructive)">
          <p style="color: var(--destructive)"></p>
        </div>

        <form id="login-form">
          <div class="mb-4">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div class="mb-4">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            class="btn w-full mb-4"
          >
            Sign In
          </button>
        </form>

        <div class="auth-divider">
          <span>Or continue with</span>
        </div>

        <div class="flex gap-4 mb-4">
          <button 
            class="btn flex-1"
            style="background-color: #4285F4"
            id="google-signin"
          >
            Google
          </button>
          <button 
            class="btn flex-1"
            style="background-color: #333"
            disabled
          >
            GitHub
          </button>
        </div>

        <div class="auth-footer">
          Don't have an account? <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  `;
  
  // Add event listener for login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Demo login for testing
      if (email === 'test@example.com' && password === 'password123') {
        // Simulate successful login
        const user = {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          createdAt: new Date().toISOString()
        };
        
        setUser(user);
        navigateTo('/dashboard');
        return;
      }
      
      // Show error message
      const errorMessage = document.getElementById('error-message');
      if (errorMessage) {
        errorMessage.style.display = 'block';
        errorMessage.querySelector('p').textContent = 'Invalid email or password. Try test@example.com/password123 for demo.';
      }
    });
  }
}

// Render signup page
function renderSignupPage(container) {
  container.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <a href="/" class="logo flex justify-between mb-4">
            <span class="logo-icon">📹</span>
            TubeAutomator
          </a>
          <h2 class="gradient-text">Create Account</h2>
          <p>Join thousands of content creators using TubeAutomator</p>
        </div>
        
        <div id="error-message" class="card mb-4" style="display: none; background-color: rgba(239, 68, 68, 0.1); border-color: var(--destructive)">
          <p style="color: var(--destructive)"></p>
        </div>

        <form id="signup-form">
          <div class="mb-4">
            <label for="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="John Doe"
              required
            />
          </div>

          <div class="mb-4">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div class="mb-4">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              minlength="8"
            />
            <p class="text-xs text-muted-foreground mt-1">
              Password must be at least 8 characters long
            </p>
          </div>

          <div class="mb-4">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            class="btn w-full mb-4"
          >
            Create Account
          </button>
        </form>

        <div class="auth-divider">
          <span>Or continue with</span>
        </div>

        <div class="flex gap-4 mb-4">
          <button 
            class="btn flex-1"
            style="background-color: #4285F4"
            id="google-signin"
          >
            Google
          </button>
          <button 
            class="btn flex-1"
            style="background-color: #333"
            disabled
          >
            GitHub
          </button>
        </div>

        <div class="auth-footer">
          Already have an account? <a href="/login">Sign In</a>
        </div>
      </div>
    </div>
  `;
  
  // Add event listener for signup form
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const fullName = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      // Validate passwords match
      if (password !== confirmPassword) {
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
          errorMessage.style.display = 'block';
          errorMessage.querySelector('p').textContent = 'Passwords do not match';
        }
        return;
      }
      
      // Demo signup for testing
      if (email === 'test@example.com') {
        // Simulate successful signup
        const user = {
          id: '1',
          email: 'test@example.com',
          name: fullName,
          createdAt: new Date().toISOString()
        };
        
        setUser(user);
        navigateTo('/dashboard');
        return;
      }
      
      // Create a new user
      const user = {
        id: Math.random().toString(36).substring(2, 15),
        email: email,
        name: fullName,
        createdAt: new Date().toISOString()
      };
      
      setUser(user);
      navigateTo('/dashboard');
    });
  }
}

// Render dashboard
function renderDashboard(container, user) {
  container.innerHTML = `
    <div class="min-h-screen">
      <header class="py-4 px-6 flex justify-between items-center" style="background-color: rgba(15, 23, 42, 0.8); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
        <a href="/" class="logo">
          <span class="logo-icon">📹</span>
          TubeAutomator
        </a>
        <div class="flex items-center gap-4">
          <span>${user.name}</span>
          <button id="logout-btn" class="btn btn-outline">Sign Out</button>
        </div>
      </header>
      
      <main class="container py-8">
        <h1 class="gradient-text text-3xl mb-6">Welcome, ${user.name}!</h1>
        
        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <div class="glass-card p-6">
            <h3 class="text-xl font-semibold mb-2">Videos Created</h3>
            <p class="text-3xl font-bold gradient-text">12</p>
          </div>
          <div class="glass-card p-6">
            <h3 class="text-xl font-semibold mb-2">Scheduled</h3>
            <p class="text-3xl font-bold gradient-text">5</p>
          </div>
          <div class="glass-card p-6">
            <h3 class="text-xl font-semibold mb-2">Published</h3>
            <p class="text-3xl font-bold gradient-text">7</p>
          </div>
        </div>
        
        <div class="glass-card p-6 mb-8">
          <h2 class="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div class="flex flex-wrap gap-4">
            <button class="btn">Create New Video</button>
            <button class="btn btn-outline">Schedule Content</button>
            <button class="btn btn-outline">View Analytics</button>
          </div>
        </div>
        
        <div class="glass-card p-6">
          <h2 class="text-2xl font-semibold mb-4">Recent Videos</h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10 Tips for Better YouTube Videos</td>
                  <td>Published</td>
                  <td>2 days ago</td>
                  <td><button class="btn btn-outline">View</button></td>
                </tr>
                <tr>
                  <td>How to Grow Your Channel in 2025</td>
                  <td>Scheduled</td>
                  <td>1 day ago</td>
                  <td><button class="btn btn-outline">Edit</button></td>
                </tr>
                <tr>
                  <td>Ultimate Guide to Video SEO</td>
                  <td>Draft</td>
                  <td>Today</td>
                  <td><button class="btn btn-outline">Complete</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `;
  
  // Add event listener for logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      clearUser();
      navigateTo('/login');
    });
  }
}
