import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionTimeout = ({ timeout = 30000 }) => { // 5 minutes by default
  const [lastActivity, setLastActivity] = useState(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    // Function to reset the timer
    const resetTimeout = () => {
      setLastActivity(Date.now());
    };

    // Set the session timeout
    const sessionTimeout = setTimeout(() => {
  
      navigate('/login'); // Redirect to login page
    }, timeout);

    // Reset timer on user interaction
    const events = ['click', 'mousemove', 'keydown'];
    events.forEach(event => window.addEventListener(event, resetTimeout));

    // Cleanup
    return () => {
      clearTimeout(sessionTimeout);
      events.forEach(event => window.removeEventListener(event, resetTimeout));
    };
  }, [lastActivity, timeout, navigate]);

  // navigate('/Home');
};

export default SessionTimeout;
