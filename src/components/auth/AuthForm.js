import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';


const AuthForm = () => {
  const navigate = useNavigate();
  const emailInputRef=useRef();
  const passwordInputRef=useRef();
  const confirmPasswordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const authCtx=useContext(AuthContext);


  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event)=>{
    event.preventDefault();
    console.log(authCtx.token);

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    
    setIsLoading(true);
    if(isLogin){

      fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBYYitMEE5oJGOdxB64iNFAKc7pn39g070`, {
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
          if (res.ok) {
            console.log('login Successful.');
            return res.json();
          } else {
            res.json().then((data) => {
              let errorMessage = 'Authentication Failed';
              if (data && data.error && data.error.message) {
                errorMessage = data.error.message;
              }
              alert(errorMessage);
            });
          }
        })
        .then((data) => {
          if (data) {
            const token = data.idToken;
            console.log('JWT (idToken):', token);
            authCtx.login(token);
            localStorage.setItem('token', token);
        
            if (isLogin) {
              // Navigate to Welcome page after successful login
              navigate('/');
            } else {
              // Navigate to Login page after successful signup
              setIsLogin(true); // Switch to login mode
              navigate('/welcome'); // You can adjust the path as needed
            }
          }
        });
        

    }else{
        fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBYYitMEE5oJGOdxB64iNFAKc7pn39g070',{
          method: 'POST',
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true
          }),
          headers:{
            'Content-Type': 'application/json'
          }
        }).then(res => {
          setIsLoading(false);
          if(res.ok){
            console.log('Signup Successful.');

          }else{
            res.json().then(data=>{
              let errorMessage='Authentication Failed';
              if(data && data.error && data.error.message){
                errorMessage=data.error.message;
              }
               alert(errorMessage);
            });
          }
        });
    }
     
    emailInputRef.current.value = '';
    passwordInputRef.current.value = '';
    if (confirmPasswordInputRef.current) {
      confirmPasswordInputRef.current.value = '';
    }
 
    

  }

  return (
    <Form onSubmit={submitHandler}>
    <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
    <Form.Group controlId="email">
      <Form.Label>Your Email</Form.Label>
      <Form.Control type="email" ref={emailInputRef} required />
    </Form.Group>
    <Form.Group controlId="password">
      <Form.Label>Your Password</Form.Label>
      <Form.Control type="password" ref={passwordInputRef} required />
    </Form.Group>
    {!isLogin && (
      <Form.Group controlId="confirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type="password" ref={confirmPasswordInputRef} required />
      </Form.Group>
    )}
    <div>
      {!isLoading && (
        <Button type="submit" variant="primary">
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
      )}
      {isLoading && <p>Loading...</p>}
      <Button
        type="button"
        variant="secondary"
        onClick={switchAuthModeHandler}
      >
        {isLogin ? 'Create new account' : 'Login with existing account'}
      </Button>
    </div>
  </Form>
  );
};

export default AuthForm;
