import { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './components/LoginFormComponent';
import authService from './services/authService';


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const isLoggedIn = authService.isLoggedIn();
    setLoggedIn(isLoggedIn);
  }, []);

  // Log out the user if the token has expired
  useEffect(() => {
    const interval = setInterval(() => {
      authService.checkTokenExpiration();
      const isLoggedIn = authService.isLoggedIn();
      setLoggedIn(isLoggedIn);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
}

export default App;