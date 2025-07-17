import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // load theme from settings when available
    const loadTheme = async () => {
      if (window.api) {
        try {
          const settings = await window.api.getSettings();
          if (settings && settings.theme) {
            setTheme(settings.theme);
          }
        } catch (error) {
          console.error('Failed to load theme from settings lmaoo:', error);
        }
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // save theme to settings
    if (window.api) {
      window.api.getSettings().then(settings => {
        const updatedSettings = { ...settings, theme: newTheme };
        window.api.saveSettings(updatedSettings);
      });
    }
  };

  const value = {
    theme,
    setTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider lock in vro');
  }
  return context;
};
