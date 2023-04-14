import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import app from "../../firebase/firebase.config";

const auth = getAuth(app);

const Login = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const emailRef = useRef();

    const handleLogin = event => {
      event.preventDefault();
     
      const form = event.target;
      const email = form.email.value;
      const password = form.password.value;
      console.log(email, password);

      // Validation
      setError('');
      setSuccess('');

      if(!/(?=.*[A-Z].*[A-Z])/.test(password)){
        setError('Please set at least two uppercase.');
        return;
      }
      else if(!/(?=.*[!@#$&*])/.test(password)){
        setError('Please set a spacial character');
        return;
      }
      else if(password.length < 6){
        setError('Password length must be 6 character');
        return;
      }

      signInWithEmailAndPassword(auth,email,password)
      .then(result => {
        const loggedUser = result.user;
        console.log(loggedUser);
        if(!loggedUser.emailVerified){
          alert('please verify your email')
        }
        setSuccess('User login successful.');
        setError('');
      })
      .catch(error =>{
        setError('error.message')
      })
    }

    const handleResetPassword = event => {
      // console.log(emailRef.current.value);
      const email = emailRef.current.value;
      if(!email){
        alert('Please provide your email address to reset password')
        return
      }
      sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('Please check your email')
      })
      .catch(error => {
        console.log(error);
        setError(error.message)
      })
    }

  return (
    <div className="w-25 mx-auto">
      <h2>Please Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group mb-3">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input type="email" name="email" ref={emailRef} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" name="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
        </div>
        <div className="form-check mb-3">
          <input type="checkbox" className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label" htmlFor="exampleCheck1">Remember me</label>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      <p><small>Forget Password? Please <button onClick={handleResetPassword} className="btn btn-link">Reset Password</button></small></p>
      <p><small>New to this website? Please <Link to='/register'>Register</Link></small></p>
      <p className="text-danger">{error}</p>
      <p className="text-success">{success}</p>
    </div>
  );
};

export default Login;
