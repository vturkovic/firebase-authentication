import React, { useState } from 'react';

interface Props {
  onLogin: (email: string, password: string) => Promise<void>;
}

const LoginForm = ({ onLogin }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Log In</button>
    </form>
  );
}

export default LoginForm;