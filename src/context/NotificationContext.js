import React, { createContext, useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCheck, FaExclamationTriangle, FaInfoCircle, FaBell } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';  // Add this import for generating unique IDs

// Create the context
const NotificationContext = createContext();

// Styled components for notifications
const NotificationContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFloating};
  margin-bottom: 0.5rem;
  animation: slideIn 0.3s ease-out forwards;
  overflow: hidden;
  position: relative;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  &.exit {
    animation: slideOut 0.3s ease-in forwards;
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;

const NotificationIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
  color: white;
  background: ${props => {
    switch (props.type) {
      case 'success':
        return props.theme.colors.success;
      case 'error':
        return props.theme.colors.error;
      case 'warning':
        return props.theme.colors.warning;
      default:
        return props.theme.colors.primary;
    }
  }};
`;

const NotificationContent = styled.div`
  flex-grow: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const NotificationMessage = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: rgba(45, 55, 72, 0.8);
`;

const NotificationDismiss = styled.button`
  background: transparent;
  border: none;
  padding: 0.25rem;
  margin-left: 0.5rem;
  cursor: pointer;
  color: rgba(45, 55, 72, 0.6);
  transition: color 0.2s;
  
  &:hover {
    color: rgba(45, 55, 72, 1);
  }
`;

// Progress bar for auto-dismiss
const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: ${props => {
    switch (props.type) {
      case 'success':
        return props.theme.colors.success;
      case 'error':
        return props.theme.colors.error;
      case 'warning':
        return props.theme.colors.warning;
      default:
        return props.theme.colors.primary;
    }
  }};
  width: ${props => props.progress}%;
  transition: width 0.2s linear;
`;

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = (newNotification) => {
    // Generate a unique ID using uuid instead of Date.now()
    const id = uuidv4(); 
    
    const notification = {
      id,
      duration: newNotification.duration || 5000, // Default 5 seconds
      ...newNotification
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-dismiss after duration
    if (notification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => {
      // First mark the notification for removal to trigger exit animation
      const updated = prev.map(notif => 
        notif.id === id ? { ...notif, exiting: true } : notif
      );
      return updated;
    });
    
    // After the animation completes, actually remove the notification
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 300); // Animation duration
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  const success = (message, title = 'Success', options = {}) => {
    addNotification({ type: 'success', message, title, icon: <FaCheck />, ...options });
  };
  
  const error = (message, title = 'Error', options = {}) => {
    addNotification({ type: 'error', message, title, icon: <FaExclamationTriangle />, ...options });
  };
  
  const info = (message, title = 'Information', options = {}) => {
    addNotification({ type: 'info', message, title, icon: <FaInfoCircle />, ...options });
  };
  
  const warning = (message, title = 'Warning', options = {}) => {
    addNotification({ type: 'warning', message, title, icon: <FaExclamationTriangle />, ...options });
  };
  
  const schedule = (message, title, scheduledTime, options = {}) => {
    // Calculate time difference in milliseconds
    const now = new Date();
    const scheduleTime = new Date(scheduledTime);
    const delay = scheduleTime.getTime() - now.getTime();
    
    if (delay <= 0) return; // Don't schedule if time has passed
    
    // Schedule notification for future time
    const timeoutId = setTimeout(() => {
      addNotification({ 
        type: 'reminder', 
        message, 
        title, 
        icon: <FaBell />, 
        ...options 
      });
    }, delay);
    
    // Return the timeout ID so it can be canceled if needed
    return timeoutId;
  };
  
  // Track progress for auto-dismissing notifications
  const [progress, setProgress] = useState({});
  useEffect(() => {
    const progressIntervals = {};
    
    // For each notification, set up a progress tracker
    notifications.forEach(notification => {
      if (notification.duration > 0 && !notification.exiting && !progressIntervals[notification.id]) {
        const totalSteps = 50; // Update progress 50 times during the duration
        const interval = notification.duration / totalSteps;
        let step = 0;
        
        progressIntervals[notification.id] = setInterval(() => {
          step++;
          setProgress(prev => ({
            ...prev,
            [notification.id]: 100 - (step * (100 / totalSteps))
          }));
          
          if (step >= totalSteps) {
            clearInterval(progressIntervals[notification.id]);
          }
        }, interval);
      }
    });
    
    // Clean up intervals when component unmounts or notifications change
    return () => {
      Object.values(progressIntervals).forEach(interval => clearInterval(interval));
    };
  }, [notifications]);
  
  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    info,
    warning,
    schedule
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      <NotificationContainer>
        {notifications.map(notification => (
          <NotificationItem 
            key={notification.id} 
            className={notification.exiting ? 'exit' : ''}
          >
            <NotificationIcon type={notification.type}>
              {notification.icon}
            </NotificationIcon>
            
            <NotificationContent>
              <NotificationTitle>{notification.title}</NotificationTitle>
              <NotificationMessage>{notification.message}</NotificationMessage>
            </NotificationContent>
            
            <NotificationDismiss onClick={() => removeNotification(notification.id)}>
              &times;
            </NotificationDismiss>
            
            {notification.duration > 0 && !notification.exiting && (
              <ProgressBar 
                type={notification.type} 
                progress={progress[notification.id] || 100} 
              />
            )}
          </NotificationItem>
        ))}
      </NotificationContainer>
    </NotificationContext.Provider>
  );
};

// Custom hook for accessing the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
