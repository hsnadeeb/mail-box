import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import AuthContext from '../../store/auth-context';
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = ({ onSwitchMode }) => {
  const navigate = useNavigate();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Add the error state

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    setError(null);

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBYYitMEE5oJGOdxB64iNFAKc7pn39g070', {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (!res.ok) {
          return res.json().then((data) => {
            let errorMessage = 'Authentication Failed';
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            setError(errorMessage);
          });
        }
        // Signup successful
        console.log('Signup Successful.');
        // onSwitchMode();
        navigate('/login');
      })
      .catch((error) => {
        console.error('Signup failed:', error);
        setError('An error occurred. Please try again.');
      });

    emailInputRef.current.value = '';
    passwordInputRef.current.value = '';
  };

  const reroute = ()=>{
    navigate('/login');
  }

  return (
    <section>
      <h1>Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Your Email</Form.Label>
          <Form.Control type="email" ref={emailInputRef} required />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Your Password</Form.Label>
          <Form.Control type="password" ref={passwordInputRef} required />
        </Form.Group>
        <div>
          {!isLoading && (
            <Button type="submit" variant="primary">
              Sign Up
            </Button>
          )}
          {isLoading && (
            <Button type="submit" disabled>
              <Spinner animation="border" role="status" />
            </Button>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          <Button type="button" variant="secondary" onClick={reroute}>
            Login with existing account
          </Button>
        </div>
      </Form>
    </section>
  );
};

export default Signup;
