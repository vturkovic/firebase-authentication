import { useState } from 'react';
import { LoginFormType } from '../interfaces';

const LoginComponent = ({ onLogin, loginError }: LoginFormType) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onLogin(email, password);
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />

        <button type="submit">Login</button>
      </form>
      {loginError && (
        <div style={{ color: 'red' }}>
          {typeof loginError === 'string' ? loginError : loginError.message}
        </div>
      )}
    </div>
  );
};

export default LoginComponent;