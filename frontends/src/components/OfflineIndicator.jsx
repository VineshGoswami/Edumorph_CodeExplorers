import React from 'react';
import { useOffline } from '../contexts/OfflineContext';

/**
 * Component to display offline status indicator
 * @returns {JSX.Element} Offline indicator component
 */
const OfflineIndicator = () => {
  const { isOffline, getTimeSinceOnline } = useOffline();

  if (!isOffline) return null;

  return (
    <div className="offline-indicator">
      <div className="offline-content">
        <span className="offline-icon">📶</span>
        <span className="offline-text">
          You are currently offline. Your work is being saved locally and will sync when you reconnect.
          {getTimeSinceOnline() !== 'Never' && (
            <span className="offline-time">Last online: {getTimeSinceOnline()}</span>
          )}
        </span>
      </div>
      <style jsx>{`
        .offline-indicator {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          padding: 10px 15px;
          display: flex;
          align-items: center;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          max-width: 300px;
        }
        .offline-content {
          display: flex;
          align-items: flex-start;
        }
        .offline-icon {
          font-size: 20px;
          margin-right: 10px;
        }
        .offline-text {
          font-size: 14px;
          display: flex;
          flex-direction: column;
        }
        .offline-time {
          font-size: 12px;
          margin-top: 5px;
          color: #856404;
        }
      `}</style>
    </div>
  );
};

export default OfflineIndicator;