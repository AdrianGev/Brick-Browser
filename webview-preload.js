// this script runs in the context of the webview
// it gives u isolation and security for webview content :nerd:

// basic tracker blocking
const blockedDomains = [
  'googleads.g.doubleclick.net',
  'adservice.google.com',
  'pagead2.googlesyndication.com',
  'ads.google.com',
  'advertising.com',
  'doubleclick.net',
  'adnxs.com',
  'scorecardresearch.com'
];

// block trackers
window.addEventListener('beforeload', (event) => {
  const url = new URL(event.url);
  if (blockedDomains.some(domain => url.hostname.includes(domain))) {
    event.preventDefault();
  }
});

// expose a minimal API for communication
window.brickBrowser = {
  // allow the page to get information about the browser
  getBrowserInfo: () => {
    return {
      name: 'Brick Browser',
      version: '0.1.0',
      userAgent: navigator.userAgent
    };
  }
};

// add a custom CSS class to the body for potential styling and future customizations
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('brick-browser-page');
});
