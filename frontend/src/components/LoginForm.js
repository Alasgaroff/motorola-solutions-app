import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("TEST username", username);
    console.log("TEST password", password);

    try {
      const response = await axios.post('http://localhost:3000/login', { username, password });
      console.log("TEST response", response);
      
      // Assuming the response contains a token
      localStorage.setItem('token', response.data.token);
      setMessage('Login successful!');
    } catch (error) {
      if (error.response) {
        setMessage(`Login failed: ${error.response.data.message}`);
      } else {
        setMessage('Login failed: Network error');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default LoginForm;
