import React from 'react';
import './TitleBar.css';
import MinimizeIcon from '@mui/icons-material/Minimize';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import CloseIcon from '@mui/icons-material/Close';

const TitleBar = ({ title }) => {
  const handleMinimize = () => {
    if (window.api) {
      window.api.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    if (window.api) {
      window.api.maximizeWindow();
    }
  };

  const handleClose = () => {
    if (window.api) {
      window.api.closeWindow();
    }
  };

  return (
    <div className="title-bar">
      <div className="title-bar-drag-area">
        <div className="title-bar-icon"></div>
        <div className="title-bar-text">{title || 'Brick Browser'}</div>
      </div>
      <div className="title-bar-controls">
        <button 
          className="title-bar-button minimize"
          onClick={handleMinimize}
          aria-label="Minimize"
        >
          <MinimizeIcon fontSize="small" />
        </button>
        <button 
          className="title-bar-button maximize"
          onClick={handleMaximize}
          aria-label="Maximize"
        >
          <CropSquareIcon fontSize="small" />
        </button>
        <button 
          className="title-bar-button close"
          onClick={handleClose}
          aria-label="Close"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
