import React, { useState, useEffect } from "react";

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {}
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const calculateExpirationTime = () => {
    const expirationTime = localStorage.getItem('tokenExpiration');
    const remainingTime = new Date(expirationTime) - new Date();
    return remainingTime > 0 ? remainingTime : null;
  };

  useEffect(() => {
    if (initialToken) {
      const expirationTime = calculateExpirationTime();
      if (expirationTime) {
        const autoLogoutTimer = setTimeout(() => {
          logoutHandler();
        }, expirationTime);
        return () => {
          clearTimeout(autoLogoutTimer);
        };
      }
    }
  }, [initialToken]);

  const loginHandler = (token, expirationTime) => {
    localStorage.setItem('token', token);

    if (!expirationTime) {
      expirationTime = 300; // 5 minutes
    }

    if (expirationTime) {
      const currentTime = new Date().getTime();
      const expirationDate = new Date(currentTime + expirationTime * 1000);
      localStorage.setItem('tokenExpiration', expirationDate.toISOString());
    }
    setToken(token);
  };

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    setToken('');
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
