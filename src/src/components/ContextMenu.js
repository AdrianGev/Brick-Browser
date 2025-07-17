import React, { useEffect, useState, useRef } from 'react';
import './ContextMenu.css';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';

const ContextMenu = ({ onNavigate }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [menuItems, setMenuItems] = useState([]);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      
      // Get the element that was right-clicked
      const target = e.target;
      
      // Determine menu items based on the target element
      let items = [];
      
      // Check if the target is a link
      const isLink = target.tagName === 'A' || target.closest('a');
      // Check if the target is an image
      const isImage = target.tagName === 'IMG' || target.closest('img');
      // Check if there's selected text
      const hasSelection = window.getSelection().toString().length > 0;
      
      // Default items
      items.push({ 
        id: 'back', 
        label: 'Back', 
        icon: <ArrowBackIcon fontSize="small" />,
        action: () => window.api?.goBack()
      });
      
      items.push({ 
        id: 'forward', 
        label: 'Forward', 
        icon: <ArrowForwardIcon fontSize="small" />,
        action: () => window.api?.goForward()
      });
      
      items.push({ 
        id: 'refresh', 
        label: 'Refresh', 
        icon: <RefreshIcon fontSize="small" />,
        action: () => window.api?.refresh()
      });
      
      items.push({ type: 'separator' });
      
      // Selection-specific items
      if (hasSelection) {
        items.push({ 
          id: 'copy', 
          label: 'Copy', 
          icon: <ContentCopyIcon fontSize="small" />,
          action: () => document.execCommand('copy')
        });
        
        items.push({ 
          id: 'cut', 
          label: 'Cut', 
          icon: <ContentCutIcon fontSize="small" />,
          action: () => document.execCommand('cut')
        });
      }
      
      // Always show paste
      items.push({ 
        id: 'paste', 
        label: 'Paste', 
        icon: <ContentPasteIcon fontSize="small" />,
        action: () => document.execCommand('paste')
      });
      
      items.push({ type: 'separator' });
      
      // Link-specific items
      if (isLink) {
        const href = isLink.href || isLink.getAttribute('href');
        
        items.push({ 
          id: 'open-link', 
          label: 'Open Link', 
          action: () => onNavigate(href)
        });
        
        items.push({ 
          id: 'open-link-new-tab', 
          label: 'Open Link in New Tab', 
          action: () => window.api?.createTab(href)
        });
        
        items.push({ 
          id: 'copy-link', 
          label: 'Copy Link Address', 
          action: () => {
            navigator.clipboard.writeText(href);
          }
        });
      }
      
      // Image-specific items
      if (isImage) {
        const src = isImage.src || isImage.getAttribute('src');
        
        items.push({ 
          id: 'open-image', 
          label: 'Open Image', 
          action: () => onNavigate(src)
        });
        
        items.push({ 
          id: 'save-image', 
          label: 'Save Image As...', 
          icon: <SaveAltIcon fontSize="small" />,
          action: () => {
            // In a real implementation, this would trigger a save dialog
            console.log('Save image:', src);
          }
        });
        
        items.push({ 
          id: 'copy-image', 
          label: 'Copy Image', 
          action: () => {
            // In a real implementation, this would copy the image to clipboard
            console.log('Copy image:', src);
          }
        });
      }
      
      // Add more general items
      items.push({ type: 'separator' });
      
      items.push({ 
        id: 'add-bookmark', 
        label: 'Add Bookmark', 
        icon: <BookmarkAddIcon fontSize="small" />,
        action: () => {
          // In a real implementation, this would add the current page as a bookmark
          console.log('Add bookmark');
        }
      });
      
      items.push({ 
        id: 'print', 
        label: 'Print...', 
        icon: <PrintIcon fontSize="small" />,
        action: () => window.print()
      });
      
      items.push({ 
        id: 'search', 
        label: 'Search for Selection', 
        icon: <SearchIcon fontSize="small" />,
        disabled: !hasSelection,
        action: () => {
          if (hasSelection) {
            const selection = window.getSelection().toString();
            window.api?.getSettings().then(settings => {
              if (settings && settings.searchEngine) {
                onNavigate(`${settings.searchEngine}${encodeURIComponent(selection)}`);
              }
            });
          }
        }
      });
      
      items.push({ type: 'separator' });
      
      items.push({ 
        id: 'view-source', 
        label: 'View Page Source', 
        icon: <CodeIcon fontSize="small" />,
        action: () => {
          // In a real implementation, this would open the page source
          console.log('View source');
        }
      });
      
      items.push({ 
        id: 'settings', 
        label: 'Settings', 
        icon: <SettingsIcon fontSize="small" />,
        action: () => {
          // Open settings
          console.log('Open settings');
        }
      });
      
      // Update state
      setMenuItems(items);
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    
    const handleClick = (e) => {
      // Close the menu if clicking outside
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setVisible(false);
      }
    };
    
    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    
    // Clean up
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, [onNavigate]);
  
  // Handle menu item click
  const handleItemClick = (item) => {
    if (item.action) {
      item.action();
    }
    setVisible(false);
  };
  
  // If not visible, don't render anything
  if (!visible) return null;
  
  // Calculate position to ensure menu stays within viewport
  const style = {
    top: `${position.y}px`,
    left: `${position.x}px`
  };
  
  // Check if menu would go off screen
  useEffect(() => {
    if (visible && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Adjust horizontal position if needed
      if (rect.right > viewportWidth) {
        setPosition(prev => ({
          ...prev,
          x: prev.x - rect.width
        }));
      }
      
      // Adjust vertical position if needed
      if (rect.bottom > viewportHeight) {
        setPosition(prev => ({
          ...prev,
          y: prev.y - rect.height
        }));
      }
    }
  }, [visible]);
  
  return (
    <div className="context-menu" style={style} ref={menuRef}>
      <ul className="context-menu-list">
        {menuItems.map((item, index) => (
          item.type === 'separator' ? (
            <li key={`separator-${index}`} className="context-menu-separator"></li>
          ) : (
            <li 
              key={item.id} 
              className={`context-menu-item ${item.disabled ? 'disabled' : ''}`}
              onClick={() => !item.disabled && handleItemClick(item)}
            >
              {item.icon && <span className="context-menu-icon">{item.icon}</span>}
              <span className="context-menu-label">{item.label}</span>
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
