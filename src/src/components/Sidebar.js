import React from 'react';
import './Sidebar.css';
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HistoryIcon from '@mui/icons-material/History';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import ExtensionIcon from '@mui/icons-material/Extension';
import { useTheme } from '../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Sidebar = ({ toggleSettings, bookmarks = [] }) => {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = React.useState(null);
  const [showBookmarks, setShowBookmarks] = React.useState(false);

  const handleSectionClick = (section) => {
    if (section === 'settings') {
      toggleSettings();
    } else if (section === 'bookmarks') {
      setShowBookmarks(!showBookmarks);
    } else {
      setActiveSection(section === activeSection ? null : section);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-icons">
        <button
          className={`sidebar-icon-button ${activeSection === 'home' ? 'active' : ''}`}
          onClick={() => handleSectionClick('home')}
          aria-label="Home"
        >
          <HomeIcon />
        </button>
        
        <button
          className={`sidebar-icon-button ${activeSection === 'bookmarks' ? 'active' : ''}`}
          onClick={() => handleSectionClick('bookmarks')}
          aria-label="Bookmarks"
        >
          <BookmarkIcon />
        </button>
        
        <button
          className={`sidebar-icon-button ${activeSection === 'history' ? 'active' : ''}`}
          onClick={() => handleSectionClick('history')}
          aria-label="History"
        >
          <HistoryIcon />
        </button>
        
        <button
          className={`sidebar-icon-button ${activeSection === 'downloads' ? 'active' : ''}`}
          onClick={() => handleSectionClick('downloads')}
          aria-label="Downloads"
        >
          <DownloadIcon />
        </button>
        
        <button
          className={`sidebar-icon-button ${activeSection === 'extensions' ? 'active' : ''}`}
          onClick={() => handleSectionClick('extensions')}
          aria-label="Extensions"
        >
          <ExtensionIcon />
        </button>
        
        <button
          className="sidebar-icon-button"
          onClick={() => handleSectionClick('settings')}
          aria-label="Settings"
        >
          <SettingsIcon />
        </button>
        
        <button
          className="sidebar-icon-button theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </button>
      </div>
      
      {showBookmarks && (
        <div className="sidebar-content bookmarks-panel">
          <h3>Bookmarks</h3>
          {bookmarks.length > 0 ? (
            <ul className="bookmark-list">
              {bookmarks.map((bookmark) => (
                <li key={bookmark.id} className="bookmark-item">
                  {bookmark.favicon && (
                    <img src={bookmark.favicon} alt="" className="bookmark-favicon" />
                  )}
                  <a href={bookmark.url} className="bookmark-link">
                    {bookmark.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-bookmarks">No bookmarks yet</p>
          )}
        </div>
      )}
      
      {activeSection === 'history' && (
        <div className="sidebar-content">
          <h3>History</h3>
          <p>Your browsing history will appear here</p>
        </div>
      )}
      
      {activeSection === 'downloads' && (
        <div className="sidebar-content">
          <h3>Downloads</h3>
          <p>Your downloads will appear here</p>
        </div>
      )}
      
      {activeSection === 'extensions' && (
        <div className="sidebar-content">
          <h3>Extensions</h3>
          <p>Manage your browser extensions</p>
          <button className="add-extension-button">Add Extension</button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
