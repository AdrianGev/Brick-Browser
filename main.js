const { app, BrowserWindow, ipcMain, dialog, Menu, session } = require('electron');
app.commandLine.appendSwitch('enable-features', 'WebviewTag');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');

// Initialize settings storage
const store = new Store();

// Default settings
if (!store.has('settings')) {
  store.set('settings', {
    theme: 'light',
    startPage: 'https://www.google.com',
    searchEngine: 'https://www.google.com/search?q=',
    adBlockEnabled: true,
    customCSS: '',
    customJS: '',
    extensions: [],
    privacy: {
      blockTrackers: true,
      clearCookiesOnExit: false,
      doNotTrack: true
    },
    layout: {
      tabPosition: 'top',
      sidebarVisible: true,
      bookmarksBarVisible: true
    }
  });
}

let mainWindow;

function createWindow() {
  console.log('Creating window...');
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    frame: store.get('settings.layout.customTitleBar', false) ? false : true,
    titleBarStyle: store.get('settings.layout.customTitleBar', false) ? 'hidden' : 'default'
  });

  // load the simple html file directly
  const startUrl = `file://${path.join(__dirname, 'index.html')}`;
  console.log('Loading URL:', startUrl);
  
  try {
    mainWindow.loadURL(startUrl);
    console.log('URL loaded successfully');
  } catch (error) {
    console.error('Error loading URL:', error);
  }

  // Open the devtols in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // custom css if can
  if (store.get('settings.customCSS')) {
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.insertCSS(store.get('settings.customCSS'));
    });
  }

  // custom JS if can
  if (store.get('settings.customJS')) {
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.executeJavaScript(store.get('settings.customJS'));
    });
  }

  // handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
    
    // clear cookies if enabled
    if (store.get('settings.privacy.clearCookiesOnExit')) {
      session.defaultSession.clearStorageData();
    }
  });
}

// create window when Electron is ready
app.whenReady().then(() => {
  console.log('Electron app is ready gng');
  createWindow();
  
  // Set up IPC handlers for window controls :nerd:
  ipcMain.handle('minimize-window', () => {
    if (mainWindow) mainWindow.minimize();
  });
  
  ipcMain.handle('maximize-window', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });
  
  ipcMain.handle('close-window', () => {
    if (mainWindow) mainWindow.close();
  });
  
  // navigation handlers for search
  ipcMain.handle('navigate', (event, url) => {
    if (mainWindow) mainWindow.webContents.loadURL(url);
  });
  
  ipcMain.handle('go-back', () => {
    if (mainWindow && mainWindow.webContents.canGoBack()) {
      mainWindow.webContents.goBack();
    }
  });
  
  ipcMain.handle('go-forward', () => {
    if (mainWindow && mainWindow.webContents.canGoForward()) {
      mainWindow.webContents.goForward();
    }
  });
  
  ipcMain.handle('refresh', () => {
    if (mainWindow) mainWindow.webContents.reload();
  });
  
  // privacy features
  if (store.get('settings.privacy.doNotTrack')) {
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
      details.requestHeaders['DNT'] = '1';
      callback({ requestHeaders: details.requestHeaders });
    });
  }
  
  // ad blocking if enabled
  if (store.get('settings.adBlockEnabled')) {
    setupAdBlocking();
  }
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// quit when all windows are closed, except on macoss
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for browser functionality
ipcMain.handle('get-settings', () => {
  return store.get('settings');
});

ipcMain.handle('save-settings', (event, settings) => {
  store.set('settings', settings);
  dialog.showMessageBox({
    type: 'info',
    title: 'Settings Saved',
    message: 'Ur settings have been saved. Some changes may require a restart to take effect lol.'
  });
  return true;
});

// browser navigation handlers
ipcMain.handle('navigate', (event, url) => {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('navigate-to-url', url);
    return true;
  }
  return false;
});

ipcMain.handle('go-back', (event) => {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('navigate-go-back');
    return true;
  }
  return false;
});

ipcMain.handle('go-forward', (event) => {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('navigate-go-forward');
    return true;
  }
  return false;
});

ipcMain.handle('refresh', (event) => {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('navigate-refresh');
    return true;
  }
  return false;
});

// tab management
ipcMain.handle('create-tab', (event, url) => {
  if (mainWindow && mainWindow.webContents) {
    const tabId = Date.now().toString();
    mainWindow.webContents.send('tab-created', { id: tabId, url });
    return tabId;
  }
  return null;
});

ipcMain.handle('close-tab', (event, tabId) => {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('tab-closed', tabId);
    return true;
  }
  return false;
});

ipcMain.handle('switch-tab', (event, tabId) => {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('tab-switched', tabId);
    return true;
  }
  return false;
});

// bookmarks management
ipcMain.handle('add-bookmark', (event, bookmark) => {
  const bookmarks = store.get('bookmarks', []);
  const newBookmark = {
    id: Date.now().toString(),
    ...bookmark,
    createdAt: new Date().toISOString()
  };
  bookmarks.push(newBookmark);
  store.set('bookmarks', bookmarks);
  return newBookmark;
});

ipcMain.handle('get-bookmarks', () => {
  return store.get('bookmarks', []);
});

ipcMain.handle('delete-bookmark', (event, id) => {
  const bookmarks = store.get('bookmarks', []);
  const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
  store.set('bookmarks', updatedBookmarks);
  return true;
});

// window controls
ipcMain.handle('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
    return true;
  }
  return false;
});

ipcMain.handle('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
    return true;
  }
  return false;
});

ipcMain.handle('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
    return true;
  }
  return false;
});

// theme management
ipcMain.handle('set-theme', (event, theme) => {
  const settings = store.get('settings', {});
  settings.theme = theme;
  store.set('settings', settings);
  return true;
});

// custom scripts and styles
ipcMain.handle('set-custom-css', (event, css) => {
  const settings = store.get('settings', {});
  settings.customCSS = css;
  store.set('settings', settings);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-custom-css', css);
  }
  return true;
});

ipcMain.handle('set-custom-js', (event, js) => {
  const settings = store.get('settings', {});
  settings.customJS = js;
  store.set('settings', settings);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-custom-js', js);
  }
  return true;
});

// extensions management
ipcMain.handle('install-extension', async (event, extensionPath) => {
  try {
    // This is a simplified version. In a real app, you'd need to handle extension installation
    const extensions = store.get('settings.extensions', []);
    extensions.push({
      id: Date.now().toString(),
      path: extensionPath,
      name: path.basename(extensionPath),
      enabled: true
    });
    store.set('settings.extensions', extensions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-extensions', () => {
  return store.get('settings.extensions', []);
});

ipcMain.handle('toggle-extension', (event, id, enabled) => {
  const extensions = store.get('settings.extensions', []);
  const updatedExtensions = extensions.map(ext => 
    ext.id === id ? {...ext, enabled} : ext
  );
  store.set('settings.extensions', updatedExtensions);
  return true;
});

// ad blocking functionality (simplified)
function setupAdBlocking() {
  // This is a very simplified ad blocking implementation
  // In a real app, you would use a proper ad blocking library or filter list
  const adDomains = ['ads.example.com', 'tracking.example.com'];
  
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const url = new URL(details.url);
    if (adDomains.some(domain => url.hostname.includes(domain))) {
      callback({ cancel: true });
    } else {
      callback({ cancel: false });
    }
  });
}

// export functions for testing
module.exports = {
  createWindow,
  setupAdBlocking
};