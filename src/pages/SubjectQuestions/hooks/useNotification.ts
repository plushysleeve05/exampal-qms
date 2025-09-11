// hooks/useNotification.ts
import { useState, useEffect, useCallback } from 'react';
import { NotificationProps } from '../types';

interface UseNotificationReturn {
  notification: NotificationProps | null;
  showNotification: (message: string, type: 'success' | 'error') => void;
  clearNotification: () => void;
}

export const useNotification = (): UseNotificationReturn => {
  const [notification, setNotification] = useState<NotificationProps | null>(null);
  
  // Add notification styles to the document
  useEffect(() => {
    const notificationStyles = `
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
      
      .notification-toast {
        animation: slideIn 0.3s ease-out forwards;
      }
      
      .notification-toast.animate-notification-out {
        animation: slideOut 0.3s ease-out forwards;
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = notificationStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Show a notification with automatic timeout
  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      const notificationElement = document.querySelector('.notification-toast');
      if (notificationElement) {
        notificationElement.classList.add('animate-notification-out');
        // Remove after animation completes
        setTimeout(() => setNotification(null), 300);
      } else {
        setNotification(null);
      }
    }, 5000);
  }, []);
  
  // Clear notification manually
  const clearNotification = useCallback(() => {
    const notificationElement = document.querySelector('.notification-toast');
    if (notificationElement) {
      notificationElement.classList.add('animate-notification-out');
      // Remove after animation completes
      setTimeout(() => setNotification(null), 300);
    } else {
      setNotification(null);
    }
  }, []);
  
  return {
    notification,
    showNotification,
    clearNotification
  };
};
