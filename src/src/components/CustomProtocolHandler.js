import React, { useEffect } from 'react';

// This component doesn't render anything visible
// It just handles custom URL protocols
const CustomProtocolHandler = ({ onNavigate }) => {
  useEffect(() => {
    // Function to handle custom protocols
    const handleCustomProtocol = (url) => {
      if (!url) return;
      
      try {
        const urlObj = new URL(url);
        
        // Handle brick:// protocol
        if (urlObj.protocol === 'brick:') {
          const path = urlObj.pathname;
          
          // Handle brick://settings
          if (path === 'settings') {
            // Open settings panel
            if (window.api) {
              window.api.openSettings();
            }
          }
          // Handle brick://newtab
          else if (path === 'newtab') {
            if (window.api) {
              window.api.createTab();
            }
          }
          // Handle brick://bookmarks
          else if (path === 'bookmarks') {
            if (window.api) {
              window.api.openBookmarks();
            }
          }
          // Handle brick://history
          else if (path === 'history') {
            if (window.api) {
              window.api.openHistory();
            }
          }
          // Handle brick://extensions
          else if (path === 'extensions') {
            if (window.api) {
              window.api.openExtensions();
            }
          }
          // Handle brick://home
          else if (path === 'home') {
            if (window.api) {
              window.api.getSettings().then(settings => {
                if (settings && settings.startPage) {
                  onNavigate(settings.startPage);
                }
              });
            }
          }
        }
        
        // Handle about: protocol
        else if (urlObj.protocol === 'about:') {
          const path = url.replace('about:', '');
          
          // Handle about:blank
          if (path === 'blank') {
            onNavigate('about:blank');
          }
          // Handle about:settings
          else if (path === 'settings') {
            if (window.api) {
              window.api.openSettings();
            }
          }
          // Handle about:version
          else if (path === 'version') {
            // Show version info
            // This would be implemented in a real browser
          }
        }
      } catch (error) {
        console.error('Error handling custom protocol:', error);
      }
    };

    // Listen for custom protocol events from the main process
    if (window.api) {
      window.api.onCustomProtocol((event, url) => {
        handleCustomProtocol(url);
      });
    }
    
    // Clean up
    return () => {
      // Remove listeners if needed
    };
  }, [onNavigate]);

  // This component doesn't render anything
  return null;
};

export default CustomProtocolHandler;
