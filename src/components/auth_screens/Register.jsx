import React, { useState } from "react";
import GoogleButton from 'react-google-button';
import { auth, provider, signInWithPopup } from '../../services/firebaseConfig';

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [loggedIn, setLoggedIn] = useState(false); 
    const [userData, setUserData] = useState(null); 

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            setLoggedIn(true);
            setUserData({ displayName: user.displayName, photoURL: user.photoURL, email: user.email });

            console.log('User Info:', user.displayName, user.photoURL);
        } catch (error) {
            console.error('Google login failed:', error.code, error.message);
        }
    }



    //USER PROFILE IF USER IS LOGGED IN !!!
        if(loggedIn){
            return (
                // Display user data when authenticated
                <div className="logged-in-container">
                      <img src={userData.photoURL} alt="User"/>
                    <h2>Welcome, {userData.displayName}!</h2>
                    <h3>Email : {userData.email}</h3>
                </div>
            )
        }

    return (
        <div className="auth-form-container">
            <h2>Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Full name</label>
            <input value={name} name="name" onChange={(e) => setName(e.target.value)} id="name" placeholder="full Name" />
            <label htmlFor="email">email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
            <label htmlFor="password">password</label>
            <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
            <button type="submit">REGISTER</button>
        </form>
        <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Login here.</button>
        <GoogleButton
      onClick={handleGoogleLogin}
    />
    </div>
    )
}
