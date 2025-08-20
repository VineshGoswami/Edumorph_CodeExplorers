import React, { createContext, useState, useEffect, useContext } from 'react';
import { isOnline, registerConnectivityListeners } from '../utils/offlineStorage';

// Create context
const OfflineContext = createContext({
  isOffline: !isOnline(),
  lastOnlineAt: null,
});

/**
 * Provider component for offline status
 * @param {Object} props - Component props
 * @returns {JSX.Element} Provider component
 */
export const OfflineProvider = ({ children }) => {
  const [isOffline, setIsOffline] = useState(!isOnline());
  const [lastOnlineAt, setLastOnlineAt] = useState(
    isOnline() ? new Date() : null
  );

  useEffect(() => {
    // Handle online status
    const handleOnline = () => {
      setIsOffline(false);
      setLastOnlineAt(new Date());
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('EduMorph is online', {
          body: 'Your changes will now sync with the server.',
          icon: '/logo192.png'
        });
      }
    };

    // Handle offline status
    const handleOffline = () => {
      setIsOffline(true);
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('EduMorph is offline', {
          body: 'You can continue working. Changes will sync when you reconnect.',
          icon: '/logo192.png'
        });
      }
    };

    // Request notification permission
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    // Register event listeners
    const cleanup = registerConnectivityListeners(handleOnline, handleOffline);

    // Initial status check
    setIsOffline(!isOnline());
    if (isOnline()) {
      setLastOnlineAt(new Date());
    }

    return cleanup;
  }, []);

  // Context value
  const contextValue = {
    isOffline,
    lastOnlineAt,
    // Format time since last online
    getTimeSinceOnline: () => {
      if (!lastOnlineAt) return 'Never';
      
      const seconds = Math.floor((new Date() - lastOnlineAt) / 1000);
      
      if (seconds < 60) return `${seconds} seconds ago`;
      if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
      return `${Math.floor(seconds / 86400)} days ago`;
    }
  };

  return (
    <OfflineContext.Provider value={contextValue}>
      {children}
    </OfflineContext.Provider>
  );
};

/**
 * Hook to use offline context
 * @returns {Object} Offline context value
 */
export const useOffline = () => useContext(OfflineContext);

export default OfflineContext;