import React, { useState } from 'react';
import './SettingsPanel.css';
import CloseIcon from '@mui/icons-material/Close';

const SettingsPanel = ({ settings, onSave, onClose }) => {
  const [currentSettings, setCurrentSettings] = useState(settings || {});
  const [activeTab, setActiveTab] = useState('general');
  
  const handleChange = (section, key, value) => {
    setCurrentSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value
      }
    }));
  };
  
  const handleNestedChange = (section, subsection, key, value) => {
    setCurrentSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [subsection]: {
          ...(prev[section]?.[subsection] || {}),
          [key]: value
        }
      }
    }));
  };
  
  const handleSave = () => {
    onSave(currentSettings);
  };
  
  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <h2>Browser Settings</h2>
          <button className="close-button" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        
        <div className="settings-content">
          <div className="settings-tabs">
            <button 
              className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button 
              className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              Appearance
            </button>
            <button 
              className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              Privacy
            </button>
            <button 
              className={`settings-tab ${activeTab === 'advanced' ? 'active' : ''}`}
              onClick={() => setActiveTab('advanced')}
            >
              Advanced
            </button>
            <button 
              className={`settings-tab ${activeTab === 'extensions' ? 'active' : ''}`}
              onClick={() => setActiveTab('extensions')}
            >
              Extensions
            </button>
          </div>
          
          <div className="settings-tab-content">
            {activeTab === 'general' && (
              <div className="settings-section">
                <h3>General Settings</h3>
                
                <div className="settings-item">
                  <label htmlFor="startPage">Start Page</label>
                  <input
                    type="text"
                    id="startPage"
                    value={currentSettings.startPage || ''}
                    onChange={(e) => setCurrentSettings({...currentSettings, startPage: e.target.value})}
                    placeholder="https://www.google.com"
                  />
                </div>
                
                <div className="settings-item">
                  <label htmlFor="searchEngine">Default Search Engine</label>
                  <input
                    type="text"
                    id="searchEngine"
                    value={currentSettings.searchEngine || ''}
                    onChange={(e) => setCurrentSettings({...currentSettings, searchEngine: e.target.value})}
                    placeholder="https://www.google.com/search?q="
                  />
                </div>
                
                <div className="settings-item">
                  <label htmlFor="adBlockEnabled">Ad Blocking</label>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="adBlockEnabled"
                      checked={currentSettings.adBlockEnabled || false}
                      onChange={(e) => setCurrentSettings({...currentSettings, adBlockEnabled: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'appearance' && (
              <div className="settings-section">
                <h3>Appearance Settings</h3>
                
                <div className="settings-item">
                  <label htmlFor="theme">Theme</label>
                  <select
                    id="theme"
                    value={currentSettings.theme || 'light'}
                    onChange={(e) => setCurrentSettings({...currentSettings, theme: e.target.value})}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                
                <div className="settings-item">
                  <label htmlFor="tabPosition">Tab Position</label>
                  <select
                    id="tabPosition"
                    value={currentSettings.layout?.tabPosition || 'top'}
                    onChange={(e) => handleNestedChange('layout', 'tabPosition', e.target.value)}
                  >
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                
                <div className="settings-item">
                  <label htmlFor="sidebarVisible">Show Sidebar</label>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="sidebarVisible"
                      checked={currentSettings.layout?.sidebarVisible !== false}
                      onChange={(e) => handleNestedChange('layout', 'sidebarVisible', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
                
                <div className="settings-item">
                  <label htmlFor="bookmarksBarVisible">Show Bookmarks Bar</label>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="bookmarksBarVisible"
                      checked={currentSettings.layout?.bookmarksBarVisible !== false}
                      onChange={(e) => handleNestedChange('layout', 'bookmarksBarVisible', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
                
                <div className="settings-item">
                  <label htmlFor="customTitleBar">Custom Title Bar</label>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="customTitleBar"
                      checked={currentSettings.layout?.customTitleBar || false}
                      onChange={(e) => handleNestedChange('layout', 'customTitleBar', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'privacy' && (
              <div className="settings-section">
                <h3>Privacy Settings</h3>
                
                <div className="settings-item">
                  <label htmlFor="blockTrackers">Block Trackers</label>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="blockTrackers"
                      checked={currentSettings.privacy?.blockTrackers !== false}
                      onChange={(e) => handleNestedChange('privacy', 'blockTrackers', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
                
                <div className="settings-item">
                  <label htmlFor="clearCookiesOnExit">Clear Cookies on Exit</label>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="clearCookiesOnExit"
                      checked={currentSettings.privacy?.clearCookiesOnExit || false}
                      onChange={(e) => handleNestedChange('privacy', 'clearCookiesOnExit', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
                
                <div className="settings-item">
                  <label htmlFor="doNotTrack">Send Do Not Track</label>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="doNotTrack"
                      checked={currentSettings.privacy?.doNotTrack !== false}
                      onChange={(e) => handleNestedChange('privacy', 'doNotTrack', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'advanced' && (
              <div className="settings-section">
                <h3>Advanced Settings</h3>
                
                <div className="settings-item full-width">
                  <label htmlFor="customCSS">Custom CSS</label>
                  <textarea
                    id="customCSS"
                    value={currentSettings.customCSS || ''}
                    onChange={(e) => setCurrentSettings({...currentSettings, customCSS: e.target.value})}
                    placeholder="/* Add your custom CSS here */"
                    rows={10}
                  />
                </div>
                
                <div className="settings-item full-width">
                  <label htmlFor="customJS">Custom JavaScript</label>
                  <textarea
                    id="customJS"
                    value={currentSettings.customJS || ''}
                    onChange={(e) => setCurrentSettings({...currentSettings, customJS: e.target.value})}
                    placeholder="// Add your custom JavaScript here"
                    rows={10}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'extensions' && (
              <div className="settings-section">
                <h3>Extensions</h3>
                
                {currentSettings.extensions && currentSettings.extensions.length > 0 ? (
                  <div className="extensions-list">
                    {currentSettings.extensions.map((extension) => (
                      <div key={extension.id} className="extension-item">
                        <div className="extension-info">
                          <span className="extension-name">{extension.name || extension.id}</span>
                          <span className="extension-path">{extension.path}</span>
                        </div>
                        <div className="toggle-switch">
                          <input
                            type="checkbox"
                            id={`extension-${extension.id}`}
                            checked={extension.enabled}
                            onChange={(e) => {
                              const updatedExtensions = currentSettings.extensions.map(ext => 
                                ext.id === extension.id ? {...ext, enabled: e.target.checked} : ext
                              );
                              setCurrentSettings({...currentSettings, extensions: updatedExtensions});
                            }}
                          />
                          <span className="toggle-slider"></span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-extensions">No extensions installed</p>
                )}
                
                <button className="install-extension-button">Install New Extension</button>
              </div>
            )}
          </div>
        </div>
        
        <div className="settings-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="save-button" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
