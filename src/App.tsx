import { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './components/LoginFormComponent';
import authService from './services/authService';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      await authService.login(email, password);
      setLoggedIn(true);
    } catch (error) {
      console.log(error);
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
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;