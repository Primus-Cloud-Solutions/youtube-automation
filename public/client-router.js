// This file ensures Next.js static export works correctly
// It's used to handle client-side routing in a static export

// Check if window is defined (browser environment)
if (typeof window !== 'undefined') {
  // Handle client-side routing
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    
    // Only handle internal links
    if (target && target.href && target.href.startsWith(window.location.origin) && !target.hasAttribute('download') && !target.target) {
      e.preventDefault();
      
      // Get the pathname from the link
      const url = new URL(target.href);
      const pathname = url.pathname;
      
      // Update the URL without reloading the page
      window.history.pushState({}, '', pathname);
      
      // Manually handle route change
      handleRouteChange(pathname);
    }
  });
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    handleRouteChange(window.location.pathname);
  });
  
  // Function to handle route changes
  function handleRouteChange(pathname) {
    // Hide all page content
    document.querySelectorAll('[data-page]').forEach(el => {
      el.style.display = 'none';
    });
    
    // Show the content for the current route
    let pageEl = document.querySelector(`[data-page="${pathname}"]`);
    
    // If no exact match, try to match with index for nested routes
    if (!pageEl) {
      const segments = pathname.split('/').filter(Boolean);
      for (let i = segments.length; i >= 0; i--) {
        const testPath = '/' + segments.slice(0, i).join('/');
        pageEl = document.querySelector(`[data-page="${testPath}"]`);
        if (pageEl) break;
      }
    }
    
    // If still no match, show 404 page
    if (!pageEl) {
      pageEl = document.querySelector('[data-page="/404"]') || 
               document.querySelector('[data-page="404"]');
    }
    
    // Show the page if found
    if (pageEl) {
      pageEl.style.display = 'block';
    }
  }
  
  // Initialize the correct route on page load
  document.addEventListener('DOMContentLoaded', () => {
    handleRouteChange(window.location.pathname);
  });
}
