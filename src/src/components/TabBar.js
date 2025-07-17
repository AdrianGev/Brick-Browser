import React from 'react';
import './TabBar.css';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const TabBar = ({ 
  tabs, 
  activeTabId, 
  onTabClick, 
  onTabClose, 
  onNewTab,
  tabPosition = 'top'
}) => {
  // Determine the CSS class based on tab position
  const positionClass = `tab-position-${tabPosition}`;
  
  return (
    <div className={`tab-bar ${positionClass}`}>
      <div className="tabs-container">
        {tabs.map(tab => (
          <div 
            key={tab.id} 
            className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
            onClick={() => onTabClick(tab.id)}
          >
            {tab.favicon && (
              <img 
                src={tab.favicon} 
                alt="" 
                className="tab-favicon" 
              />
            )}
            <span className="tab-title">{tab.title || 'New Tab'}</span>
            <button 
              className="tab-close" 
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              aria-label="Close tab"
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>
        ))}
      </div>
      
      <button 
        className="new-tab-button" 
        onClick={onNewTab}
        aria-label="New tab"
      >
        <AddIcon />
      </button>
    </div>
  );
};

export default TabBar;
