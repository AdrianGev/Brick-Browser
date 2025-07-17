// This script bridges communication between webview content and the browser
const { ipcRenderer, contextBridge } = require('electron');

// Expose a limited API to webview content
contextBridge.exposeInMainWorld('brickBrowser', {
  // Allow the page to navigate
  navigate: (url) => {
    ipcRenderer.sendToHost('navigate-to-url', url);
  },
  
  // Get browser info
  getBrowserInfo: () => {
    return {
      name: 'Brick Browser',
      version: '1.0.0'
    };
  }
});

// Listen for messages from the page
window.addEventListener('message', (event) => {
  // Handle navigation requests from search page
  if (event.data && event.data.type === 'navigate') {
    ipcRenderer.sendToHost('navigate-to-url', event.data.url);
  }
});

// Add a custom CSS class to the body for potential styling
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('brick-browser-page');
});
