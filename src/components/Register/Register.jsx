import React from 'react';
import { useState } from 'react';
import { Link } from "react-router-dom";
import {createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile} from 'firebase/auth'
import app from '../../firebase/firebase.config';

const auth = getAuth(app);

const Register = () => {
    // const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (event) => {
        // 1. prevent page refresh
        event.preventDefault();
        setSuccess('');
        setError('');
        // 2. collect from data
        const email = event.target.email.value;
        const password = event.target.password.value;
        const name = event.target.name.value;
        console.log(name, email, password);

        // validate
        if (!/(?=.*[A-Z])/.test(password)) {
            setError('Please add at least one uppercase');
            return;
        }
        else if (!/(?=.*[0-9].*[0-9])/.test(password)) {
            setError('Please add at least two numbers');
            return
        }
        else if (password.length < 6) {
            setError('Please add at least 6 characters in your password')
            return;
        }

        // 3. create user in firebase
        createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
            const loggedUser = result.user;
            console.log(loggedUser);
            setError('');
            event.target.reset();
            setSuccess('User has been created successfully');
            sendVerificationEmail(result.user)
            updateUserData(result.user, name)
        })
        .catch(error => {
            console.log(error.message);
            setError(error.message)
            // setSuccess('');
        })
    }

    const sendVerificationEmail = user => {
        sendEmailVerification(user)
        .then(result => {
            console.log(result);
            alert('Please verify your email address')
        })
    }

    const updateUserData = (user, name) =>{
        updateProfile(user, {
            displayName: name
        })
        .then(() =>{
            console.log('username updated');
        })
        .catch(error => {
            setError(error.message)
        })
    }

    const handleEmailChange = (event) =>{
        // console.log(event.target.value);
        // setEmail(event.target.value);
    };

    const handlePasswordBlur = (e) => {
        // console.log(e.target.value);
    }


    return (
        <div className='w-50 mx-auto'>
            <h2>Please Register</h2>
            <form onSubmit={handleSubmit}>
                <input className='w-50 mb-4 rounded' type="text" name="name" id="name" placeholder='Your Name' required />
                <br />
                <input className='w-50 mb-4 rounded' onChange={handleEmailChange} type="email" name="email" id="email" placeholder='Your Email' required />
                <br />
                <input className='w-50 mb-4 rounded' onBlur={handlePasswordBlur} type="password" name="password" id="password" placeholder='Your Password' required />
                <br />
                <input className='btn btn-primary' type="submit" value="Register" />
            </form>
            <p><small>Already have an account? Please <Link to='/login'>Login</Link></small></p>
            <p className='text-danger'>{error}</p>
            <p className='text-success'>{success}</p>
        </div>
    );
};

export default Register;