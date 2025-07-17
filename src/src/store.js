import { create } from 'zustand';

const useStore = create((set) => ({
  tabs: [],
  activeTabId: null,
  navigationState: {},  // Stores canGoBack, canGoForward for each tab
  
  // Add a new tab
  addTab: (url) => set((state) => {
    const newTabId = `tab-${Date.now()}`;
    const newTab = {
      id: newTabId,
      title: 'New Tab',
      url: url || 'about:blank',
      loading: true,
      favicon: null
    };
    
    return {
      tabs: [...state.tabs, newTab],
      activeTabId: newTabId,
      navigationState: {
        ...state.navigationState,
        [newTabId]: { canGoBack: false, canGoForward: false }
      }
    };
  }),
  
  // Close a tab
  closeTab: (tabId) => set((state) => {
    const tabIndex = state.tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return state;
    
    const newTabs = [...state.tabs];
    newTabs.splice(tabIndex, 1);
    
    let newActiveTabId = state.activeTabId;
    if (tabId === state.activeTabId) {
      // If we closed the active tab, activate the tab to the left
      // or the first tab if there is no tab to the left
      newActiveTabId = newTabs[tabIndex - 1]?.id || newTabs[0]?.id || null;
    }
    
    // Remove navigation state for the closed tab
    const newNavigationState = { ...state.navigationState };
    delete newNavigationState[tabId];
    
    return {
      tabs: newTabs,
      activeTabId: newActiveTabId,
      navigationState: newNavigationState
    };
  }),
  
  // Set the active tab
  setActiveTab: (tabId) => set({
    activeTabId: tabId
  }),
  
  // Update tab title
  updateTabTitle: (tabId, title) => set((state) => ({
    tabs: state.tabs.map(tab => 
      tab.id === tabId ? { ...tab, title } : tab
    )
  })),
  
  // Update tab URL
  updateTabUrl: (tabId, url) => set((state) => ({
    tabs: state.tabs.map(tab => 
      tab.id === tabId ? { ...tab, url } : tab
    )
  })),
  
  // Update tab loading state
  updateTabLoading: (tabId, loading) => set((state) => ({
    tabs: state.tabs.map(tab => 
      tab.id === tabId ? { ...tab, loading } : tab
    )
  })),
  
  // Update tab favicon
  updateTabFavicon: (tabId, favicon) => set((state) => ({
    tabs: state.tabs.map(tab => 
      tab.id === tabId ? { ...tab, favicon } : tab
    )
  })),
  
  updateNavigationState: (tabId, { canGoBack, canGoForward }) => set((state) => ({
    navigationState: {
      ...state.navigationState,
      [tabId]: { 
        canGoBack: canGoBack !== undefined ? canGoBack : state.navigationState[tabId]?.canGoBack || false, 
        canGoForward: canGoForward !== undefined ? canGoForward : state.navigationState[tabId]?.canGoForward || false 
      }
    }
  }))
}));

export default useStore;
