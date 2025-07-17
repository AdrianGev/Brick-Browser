import React, { useState } from 'react';
import './AddressBar.css';
import RefreshIcon from '@mui/icons-material/Refresh';
import StopIcon from '@mui/icons-material/Stop';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';

const AddressBar = ({ 
  url, 
  onNavigate, 
  searchEngine, 
  isLoading, 
  onRefresh, 
  onGoBack, 
  onGoForward 
}) => {
  const [inputValue, setInputValue] = useState(url || '');
  
  // Update input value when URL changes
  React.useEffect(() => {
    setInputValue(url || '');
  }, [url]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    let navigateUrl = inputValue.trim();
    
    // If input doesn't look like a URL, use search engine
    if (navigateUrl && !navigateUrl.includes('://') && !navigateUrl.startsWith('about:')) {
      // Check if it's a valid domain name with at least one dot
      const isDomain = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(navigateUrl);
      
      if (isDomain) {
        navigateUrl = `http://${navigateUrl}`;
      } else if (searchEngine) {
        // Use search engine
        navigateUrl = `${searchEngine}${encodeURIComponent(navigateUrl)}`;
      }
    }
    
    onNavigate(navigateUrl);
  };
  
  return (
    <div className="address-bar">
      <div className="navigation-buttons">
        <button 
          className="nav-button" 
          onClick={onGoBack}
          aria-label="Go back"
        >
          <ArrowBackIcon />
        </button>
        <button 
          className="nav-button" 
          onClick={onGoForward}
          aria-label="Go forward"
        >
          <ArrowForwardIcon />
        </button>
        <button 
          className="nav-button" 
          onClick={isLoading ? onRefresh : onRefresh}
          aria-label={isLoading ? "Stop loading" : "Refresh"}
        >
          {isLoading ? <StopIcon /> : <RefreshIcon />}
        </button>
      </div>
      
      <form className="url-form" onSubmit={handleSubmit}>
        <div className="url-input-container">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            className="url-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search or enter website name"
          />
        </div>
      </form>
    </div>
  );
};

export default AddressBar;
