import React, { createContext, useState } from 'react';

export const AuthContext = createContext(); // ✅ this must exist

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const login = (username, token) => {
    setUsername(username);
    setToken(token);
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUsername('');
    setToken('');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ username, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
