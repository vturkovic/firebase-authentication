import { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './components/LoginFormComponent';
import authService from './services/authService';
import { LoginError } from './interfaces';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState<LoginError | null>(null);

  const handleLogin = async (email: string, password: string) => {
    const error = await authService.login(email, password);
    if (error === '') {
      const isAuthenticated = await authService.isAuthenticated();
      if (isAuthenticated) {
        setLoggedIn(true);
        setLoginError(null);
      } else {
        setLoginError('Authentication error. Please try again.');
      }
    } else {
      setLoginError(error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await authService.logout();
      setLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    // If the user is logged in, set a timeout to log them out after 20 minutes.
    if (loggedIn) {
      timeout = setTimeout(() => {
        handleLogout();
      }, 20 * 60 * 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [loggedIn]);

  return (
    <div className="App">
      {loggedIn ? (
        <div>
          <h1>Welcome!</h1>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <LoginForm onLogin={handleLogin} loginError={loginError} />
      )}
    </div>
  );
};

export default App;
