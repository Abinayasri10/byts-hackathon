import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useIdleTimeout = (timeoutDuration = 2 * 60 * 1000) => { // 2 minutes in milliseconds
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef(null);
  const [showWarning, setShowWarning] = useState(false);

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to appropriate login page
    if (location.pathname.startsWith('/admin')) {
      navigate('/admin/login', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  const resetTimer = () => {
    setShowWarning(false);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set timer if user is logged in
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) return;

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      logout();
    }, timeoutDuration);
  };

  useEffect(() => {
    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Reset timer on any user activity
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location.pathname]);

  return { showWarning };
};

export default useIdleTimeout;
