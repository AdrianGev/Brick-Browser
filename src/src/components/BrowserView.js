import React, { useRef, useEffect } from 'react';
import './BrowserView.css';
import useStore from '../store';

const BrowserView = ({ tabId, url, customCSS, customJS, onFaviconChange, onTitleChange, onUrlChange }) => {
  const webviewRef = useRef(null);
  const { updateTabLoading, updateTabTitle, updateTabUrl, updateNavigationState, updateTabFavicon } = useStore();

  // Apply custom CSS when it changes
  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview || !customCSS) return;

    const cssCode = `
      (function() {
        const style = document.createElement('style');
        style.id = 'brick-browser-custom-css';
        style.textContent = ${JSON.stringify(customCSS)};

        // Remove any existing custom CSS
        const existingStyle = document.getElementById('brick-browser-custom-css');
        if (existingStyle) {
          existingStyle.remove();
        }

        document.head.appendChild(style);
        return true;
      })();
    `;

    webview.executeJavaScript(cssCode).catch(err => {
      console.error('Error injecting custom CSS:', err);
    });
  }, [customCSS]);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    // Set up event listeners
    const handleDidStartLoading = () => {
      updateTabLoading(tabId, true);
    };

    const handleDidStopLoading = () => {
      updateTabLoading(tabId, false);

      // Get favicon when page finishes loading
      webview.executeJavaScript(
        `(function() {
          const favicon = document.querySelector('link[rel="shortcut icon"]') || 
                         document.querySelector('link[rel="icon"]');
          return favicon ? favicon.href : null;
        })()`
      ).then(faviconUrl => {
        if (faviconUrl) {
          updateTabFavicon(tabId, faviconUrl);
          if (onFaviconChange) onFaviconChange(faviconUrl);
        }
      }).catch(err => console.error('Error getting favicon:', err));

      // Update navigation state
      updateNavigationState(tabId, {
        canGoBack: webview.canGoBack(),
        canGoForward: webview.canGoForward()
      });
    };

    const handlePageTitleUpdated = (e) => {
      updateTabTitle(tabId, e.title);
      if (onTitleChange) onTitleChange(e.title);
    };

    const handleDidNavigate = (e) => {
      updateTabUrl(tabId, e.url);
      if (onUrlChange) onUrlChange(e.url);

      // Update navigation state
      updateNavigationState(tabId, {
        canGoBack: webview.canGoBack(),
        canGoForward: webview.canGoForward()
      });
    };

    const handleNavigationStateChange = () => {
      updateNavigationState(tabId, {
        canGoBack: webview.canGoBack(),
        canGoForward: webview.canGoForward()
      });
    };

    webview.addEventListener('did-start-loading', handleDidStartLoading);
    webview.addEventListener('did-stop-loading', handleDidStopLoading);
    webview.addEventListener('page-title-updated', handlePageTitleUpdated);
    webview.addEventListener('did-navigate', handleDidNavigate);
    webview.addEventListener('did-navigate-in-page', handleNavigationStateChange);

    // Clean up event listeners
    return () => {
      webview.removeEventListener('did-start-loading', handleDidStartLoading);
      webview.removeEventListener('did-stop-loading', handleDidStopLoading);
      webview.removeEventListener('page-title-updated', handlePageTitleUpdated);
      webview.removeEventListener('did-navigate', handleDidNavigate);
      webview.removeEventListener('did-navigate-in-page', handleNavigationStateChange);
    };
  }, [tabId, updateTabLoading, updateTabTitle, updateTabUrl, updateNavigationState, onTitleChange, onUrlChange, onFaviconChange]);

  // Navigate to URL when it changes
  useEffect(() => {
    const webview = webviewRef.current;
    if (webview && url && url !== webview.getURL()) {
      webview.src = url;
    }
  }, [url]);

  // Apply custom JS when it changes
  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview || !customJS) return;

    const jsCode = `
      (function() {
        try {
          ${customJS}
          return true;
        } catch (error) {
          console.error('Error in custom JS:', error);
          return false;
        }
      })();
    `;

    webview.executeJavaScript(jsCode).catch(err => {
      console.error('Error injecting custom JS:', err);
    });
  }, [customJS]);

  return (
    <div className="browser-view">
      <webview
        ref={webviewRef}
        src={url}
        partition={`persist:tab-${tabId}`}
        allowpopups="true"
        preload="./webview-preload.js"
        webpreferences="contextIsolation=yes, nodeIntegration=no"
      />
    </div>
  );
};

export default BrowserView;
