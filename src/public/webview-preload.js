// webview-preload.js
// This script is injected into each webview to provide isolation and security

// Create a safe, isolated context for webview content
(function() {
  // Expose a minimal API to the webview content
  window.brickBrowser = {
    // Allow the page to send messages to the browser
    postMessage: (message) => {
      if (typeof message !== 'object') return;
      
      // Use Electron's contextBridge to safely communicate
      if (window.chrome && window.chrome.webview) {
        window.chrome.webview.postMessage(message);
      }
    },
    
    // Version info
    version: '1.0.0',
    
    // Feature detection
    features: {
      customCSS: true,
      customJS: true,
      adBlocking: true,
      extensions: true
    }
  };
  
  // Listen for messages from the browser
  window.addEventListener('message', (event) => {
    // Only accept messages from our app
    if (event.origin !== 'brick-browser://') return;
    
    const { type, data } = event.data;
    
    switch (type) {
      case 'theme-changed':
        // Apply theme changes
        if (data.theme === 'dark') {
          document.documentElement.classList.add('brick-browser-dark');
        } else {
          document.documentElement.classList.remove('brick-browser-dark');
        }
        break;
        
      case 'custom-css-changed':
        // Handle custom CSS updates
        break;
        
      case 'custom-js-changed':
        // Handle custom JS updates
        break;
        
      default:
        // Ignore unknown message types
        break;
    }
  });
  
  // Inject some basic protection
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.tagName === 'SCRIPT') {
            // Check for potentially harmful scripts
            const src = node.getAttribute('src');
            if (src && isKnownTracker(src)) {
              console.log('Blocked tracker script:', src);
              node.remove();
            }
          }
        }
      }
    }
  });
  
  // Start observing the document
  observer.observe(document, { 
    childList: true, 
    subtree: true 
  });
  
  // Simple tracker detection (would be more comprehensive in a real implementation)
  function isKnownTracker(url) {
    const trackerDomains = [
      'tracker.example.com',
      'analytics.example.org',
      'ads.example.net'
    ];
    
    try {
      const urlObj = new URL(url);
      return trackerDomains.some(domain => urlObj.hostname.includes(domain));
    } catch (e) {
      return false;
    }
  }
  
  // Add a class to the body for custom styling
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('in-brick-browser');
  });
  
  console.log('BrickBrowser webview preload script initialized');
})();
