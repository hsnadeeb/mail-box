import React from 'react';
import AuthForm from './components/auth/AuthForm';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
    <div className="App">
      <AuthForm />
    </div>
    </Routes>
  );
}

{/* <Routes>
        <Route path='/' element={<HomePage />} />
        {!authCtx.isLoggedIn && <Route path='/auth' element={<AuthPage />} />}
        {authCtx.isLoggedIn && <Route path='/profile' element={<UserProfile />} />}
      </Routes> */}

export default App;
