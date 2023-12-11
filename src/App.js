import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Welcome from './components/pages/Welcome';
import AuthContext from './store/auth-context';

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Routes>
      {!authCtx.isLoggedIn && <Route path="/login" element={<Login />} />}
      {authCtx.isLoggedIn && <Route path="/welcome" element={<Welcome />} />}
      {!authCtx.isLoggedIn && <Route path="/signup" element={<Signup />} />}
      {/* Redirect to login if the user is not logged in */}
      {!authCtx.isLoggedIn && <Route path="*" element={<Navigate to="/login" />} />}
    </Routes>
  );
}

export default App;
