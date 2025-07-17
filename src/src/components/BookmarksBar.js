import React, { useState, useEffect } from 'react';
import './BookmarksBar.css';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const BookmarksBar = ({ onNavigate }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', url: '' });

  // Load bookmarks on component mount
  useEffect(() => {
    const loadBookmarks = async () => {
      if (window.api) {
        try {
          const bookmarks = await window.api.getBookmarks();
          setBookmarks(bookmarks || []);
        } catch (error) {
          console.error('Failed to load bookmarks:', error);
        }
      }
    };

    loadBookmarks();
  }, []);

  const handleBookmarkClick = (url) => {
    if (onNavigate) {
      onNavigate(url);
    }
    setShowDropdown(null);
  };

  const handleMoreClick = (e, id) => {
    e.stopPropagation();
    setShowDropdown(showDropdown === id ? null : id);
  };

  const handleDeleteBookmark = async (e, id) => {
    e.stopPropagation();
    if (window.api) {
      try {
        await window.api.deleteBookmark(id);
        setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
      } catch (error) {
        console.error('Failed to delete bookmark:', error);
      }
    }
    setShowDropdown(null);
  };

  const handleEditClick = (e, bookmark) => {
    e.stopPropagation();
    setEditingBookmark(bookmark.id);
    setEditForm({ title: bookmark.title, url: bookmark.url });
    setShowDropdown(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (window.api) {
      try {
        const updatedBookmarks = bookmarks.map(bookmark => 
          bookmark.id === editingBookmark 
            ? { ...bookmark, title: editForm.title, url: editForm.url } 
            : bookmark
        );
        
        // In a real implementation, you would update the bookmark in the store
        // For now, we'll just update the local state
        setBookmarks(updatedBookmarks);
      } catch (error) {
        console.error('Failed to update bookmark:', error);
      }
    }
    setEditingBookmark(null);
  };

  const handleAddBookmark = async () => {
    if (window.api) {
      try {
        // In a real implementation, you would get the current page info
        const newBookmark = await window.api.addBookmark({
          title: 'New Bookmark',
          url: 'https://example.com',
          favicon: null
        });
        
        setBookmarks([...bookmarks, newBookmark]);
      } catch (error) {
        console.error('Failed to add bookmark:', error);
      }
    }
  };

  return (
    <div className="bookmarks-bar">
      <div className="bookmarks-container">
        {bookmarks.map(bookmark => (
          <div key={bookmark.id} className="bookmark-item">
            {editingBookmark === bookmark.id ? (
              <form className="edit-bookmark-form" onSubmit={handleEditSubmit}>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={editForm.url}
                  onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                  placeholder="URL"
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingBookmark(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <div 
                  className="bookmark" 
                  onClick={() => handleBookmarkClick(bookmark.url)}
                >
                  {bookmark.favicon ? (
                    <img src={bookmark.favicon} alt="" className="bookmark-favicon" />
                  ) : (
                    <BookmarkIcon className="bookmark-icon" fontSize="small" />
                  )}
                  <span className="bookmark-title">{bookmark.title}</span>
                </div>
                <button 
                  className="bookmark-more-button"
                  onClick={(e) => handleMoreClick(e, bookmark.id)}
                  aria-label="More options"
                >
                  <MoreHorizIcon fontSize="small" />
                </button>
                {showDropdown === bookmark.id && (
                  <div className="bookmark-dropdown">
                    <button 
                      className="dropdown-item"
                      onClick={(e) => handleEditClick(e, bookmark)}
                    >
                      <EditIcon fontSize="small" />
                      <span>Edit</span>
                    </button>
                    <button 
                      className="dropdown-item delete"
                      onClick={(e) => handleDeleteBookmark(e, bookmark.id)}
                    >
                      <DeleteIcon fontSize="small" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      
      <button 
        className="add-bookmark-button"
        onClick={handleAddBookmark}
        aria-label="Add bookmark"
      >
        <BookmarkIcon fontSize="small" />
        <span>Add</span>
      </button>
    </div>
  );
};

export default BookmarksBar;
