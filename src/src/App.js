import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TabBar from './components/TabBar';
import BrowserView from './components/BrowserView';
import AddressBar from './components/AddressBar';
import SettingsPanel from './components/SettingsPanel';
import TitleBar from './components/TitleBar';
import BookmarksBar from './components/BookmarksBar';
import ContextMenu from './components/ContextMenu';
import CustomProtocolHandler from './components/CustomProtocolHandler';
import { useTheme } from './contexts/ThemeContext';
import useStore from './store';

function App() {
  const { theme } = useTheme();
  const [settings, setSettings] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeUrl, setActiveUrl] = useState('');
  const [pageTitle, setPageTitle] = useState('New Tab');
  
  const { 
    tabs, 
    activeTabId, 
    addTab, 
    closeTab, 
    setActiveTab,
    updateTabTitle,
    updateTabUrl,
    updateTabLoading,
    updateTabFavicon
  } = useStore();

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      if (window.api) {
        const settings = await window.api.getSettings();
        setSettings(settings);
        
        // Create initial tab with start page
        if (settings && settings.startPage) {
          addTab(settings.startPage);
        } else {
          addTab('about:blank');
        }
      }
    };
    
    loadSettings();
    
    // Set up listeners for tab updates
    if (window.api) {
      window.api.onTabUpdate((event, tabData) => {
        if (tabData.title) {
          updateTabTitle(tabData.id, tabData.title);
          if (tabData.id === activeTabId) {
            setPageTitle(tabData.title);
          }
        }
        if (tabData.url) {
          updateTabUrl(tabData.id, tabData.url);
          if (tabData.id === activeTabId) {
            setActiveUrl(tabData.url);
          }
        }
        if (tabData.loading !== undefined) {
          updateTabLoading(tabData.id, tabData.loading);
        }
        if (tabData.favicon) {
          updateTabFavicon(tabData.id, tabData.favicon);
        }
      });
      
      // Listen for navigation state changes
      window.api.onNavigationStateChange((event, data) => {
        if (data.tabId === activeTabId) {
          if (data.canGoBack !== undefined) {
            // Update back button state
          }
          if (data.canGoForward !== undefined) {
            // Update forward button state
          }
        }
      });
    }
  }, [addTab, updateTabTitle, updateTabUrl, updateTabLoading, updateTabFavicon, activeTabId]);

  const handleNewTab = () => {
    const startPage = settings?.startPage || 'about:blank';
    addTab(startPage);
  };

  const handleNavigate = (url) => {
    if (activeTabId && window.api) {
      window.api.navigate(url);
      updateTabUrl(activeTabId, url);
      setActiveUrl(url);
      
      // Update loading state
      updateTabLoading(activeTabId, true);
      
      // Reset page title until the page loads
      const displayUrl = url.replace(/^https?:\/\//, '');
      updateTabTitle(activeTabId, displayUrl);
      setPageTitle(displayUrl);
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const saveSettings = async (newSettings) => {
    if (window.api) {
      await window.api.saveSettings(newSettings);
      setSettings(newSettings);
      setShowSettings(false);
      
      // Apply any immediate settings changes
      if (newSettings.customCSS !== settings.customCSS) {
        window.api.setCustomCSS(newSettings.customCSS);
      }
      
      if (newSettings.customJS !== settings.customJS) {
        window.api.setCustomJS(newSettings.customJS);
      }
    }
  };

  // Get the active tab
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className={`app ${theme}`}>
      {/* Custom protocol handler */}
      <CustomProtocolHandler onNavigate={handleNavigate} />
      
      {/* Context menu */}
      <ContextMenu onNavigate={handleNavigate} />
      
      {/* Custom title bar if enabled */}
      {settings?.layout?.customTitleBar && (
        <TitleBar title={pageTitle} />
      )}
      
      <div className="browser-container">
        {settings?.layout?.sidebarVisible && (
          <Sidebar 
            toggleSettings={toggleSettings}
            bookmarks={settings?.bookmarks || []}
          />
        )}
        
        <div className={`main-content ${settings?.layout?.tabPosition ? `tab-position-${settings.layout.tabPosition}` : 'tab-position-top'}`}>
          <TabBar 
            tabs={tabs}
            activeTabId={activeTabId}
            onTabClick={setActiveTab}
            onTabClose={closeTab}
            onNewTab={handleNewTab}
            tabPosition={settings?.layout?.tabPosition || 'top'}
          />
          
          <AddressBar 
            url={activeTab?.url || ''}
            onNavigate={handleNavigate}
            searchEngine={settings?.searchEngine}
            isLoading={activeTab?.loading}
            onRefresh={() => window.api?.refresh()}
            onGoBack={() => window.api?.goBack()}
            onGoForward={() => window.api?.goForward()}
          />
          
          {/* Bookmarks bar if enabled */}
          {settings?.layout?.bookmarksBarVisible && (
            <BookmarksBar onNavigate={handleNavigate} />
          )}
          
          {activeTabId && (
            <BrowserView 
              tabId={activeTabId}
              url={activeTab?.url || ''}
              customCSS={settings?.customCSS || ''}
              customJS={settings?.customJS || ''}
              onTitleChange={(title) => {
                updateTabTitle(activeTabId, title);
                setPageTitle(title);
              }}
              onUrlChange={(url) => {
                updateTabUrl(activeTabId, url);
                setActiveUrl(url);
              }}
              onFaviconChange={(favicon) => {
                updateTabFavicon(activeTabId, favicon);
              }}
            />
          )}
        </div>
      </div>
      
      {showSettings && (
        <SettingsPanel 
          settings={settings}
          onSave={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
