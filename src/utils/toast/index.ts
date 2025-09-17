/**
 * Simple toast notification utility
 * In production, this should be replaced with a more robust solution like react-toastify
 */

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number;
}

// To be implemented with a proper toast library
export const showToast = ({ message, type, duration = 5000 }: ToastOptions) => {
  // For now, we'll use console for development
  if (import.meta.env.DEV) {
    console[type === 'error' ? 'error' : 'log'](`[${type.toUpperCase()}]: ${message}`);
  }
  
  // In production, we'd display an actual toast
  // This is a placeholder for implementing a proper toast library
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '4px';
  toast.style.color = '#fff';
  toast.style.zIndex = '9999';
  
  switch (type) {
    case 'success':
      toast.style.backgroundColor = '#4caf50';
      break;
    case 'error':
      toast.style.backgroundColor = '#f44336';
      break;
    case 'warning':
      toast.style.backgroundColor = '#ff9800';
      break;
    case 'info':
      toast.style.backgroundColor = '#2196f3';
      break;
  }
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    document.body.removeChild(toast);
  }, duration);
};

export const errorToast = (message: string) => showToast({ message, type: 'error' });
export const successToast = (message: string) => showToast({ message, type: 'success' });
export const warningToast = (message: string) => showToast({ message, type: 'warning' });
export const infoToast = (message: string) => showToast({ message, type: 'info' });