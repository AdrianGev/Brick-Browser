const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    // Settings management
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    
    // Browser navigation
    navigate: (url) => ipcRenderer.invoke('navigate', url),
    goBack: () => ipcRenderer.invoke('go-back'),
    goForward: () => ipcRenderer.invoke('go-forward'),
    refresh: () => ipcRenderer.invoke('refresh'),
    
    // Tab management
    createTab: (url) => ipcRenderer.invoke('create-tab', url),
    closeTab: (tabId) => ipcRenderer.invoke('close-tab', tabId),
    switchTab: (tabId) => ipcRenderer.invoke('switch-tab', tabId),
    
    // Bookmarks
    addBookmark: (bookmark) => ipcRenderer.invoke('add-bookmark', bookmark),
    getBookmarks: () => ipcRenderer.invoke('get-bookmarks'),
    deleteBookmark: (id) => ipcRenderer.invoke('delete-bookmark', id),
    
    // Extensions
    installExtension: (path) => ipcRenderer.invoke('install-extension', path),
    getExtensions: () => ipcRenderer.invoke('get-extensions'),
    toggleExtension: (id, enabled) => ipcRenderer.invoke('toggle-extension', id, enabled),
    
    // Theme management
    setTheme: (theme) => ipcRenderer.invoke('set-theme', theme),
    
    // Custom scripts and styles
    setCustomCSS: (css) => ipcRenderer.invoke('set-custom-css', css),
    setCustomJS: (js) => ipcRenderer.invoke('set-custom-js', js),
    
    // System
    minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
    maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
    closeWindow: () => ipcRenderer.invoke('close-window'),
    
    // Listeners
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
    onTabUpdate: (callback) => ipcRenderer.on('tab-update', callback),
    onNavigationStateChange: (callback) => ipcRenderer.on('navigation-state-change', callback)
  }
);
