import React, { useState, useEffect } from "react";
import GoogleButton from 'react-google-button';
import { auth, provider, signInWithPopup, signInWithEmailAndPassword, db,signOut } from '../../services/firebaseConfig';
import { doc, setDoc } from "firebase/firestore"; 

export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [loggedIn, setLoggedIn] = useState(false); 
    const [userData, setUserData] = useState(null); 

    useEffect(() => {
        // Listen for changes in the user's authentication state
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in
                setLoggedIn(true);
                setUserData({
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    email: user.email,
                    uid: user.uid
                });
            } else {
                // User is signed out
                setLoggedIn(false);
                setUserData(null);
            }
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, []); // Empty dependency array means this effect runs once after the initial render


    const LoginOnClick = async (e) => {
        e.preventDefault();
        try {
            // Perform email and password authentication
            const result = await signInWithEmailAndPassword(auth, email, pass);
            const user = result.user;
    
            // Set the user as logged in and update user data in the state
            setLoggedIn(true);
            setUserData({
                displayName: user.displayName,
                photoURL: user.photoURL,
                email: user.email,
                uid: user.uid
            });
        } catch (error) {
            console.error('Email and password login failed:', error.code, error.message);
            // Handle specific error cases or display error to the user
        }
    }
    

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            setLoggedIn(true);
            setUserData({ displayName: user.displayName, photoURL: user.photoURL, email: user.email });

        // Add a new document in collection "cities"
        await setDoc(doc(db, "users", user.uid), {
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
            uid: user.uid
        });

            console.log('User Info:', user.displayName, user.photoURL);
        } catch (error) {
            console.error('Google login failed:', error.code, error.message);
        }
    }

    const handleSignOut = async () => {
        try {
            // Sign out the user
            await signOut(auth);
        } catch (error) {
            console.error('Sign out failed:', error.code, error.message);
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
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            )
        }

    return (
        <div className="auth-form-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={LoginOnClick}>
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                <label htmlFor="password">password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button type="submit">Log In</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button>
            <GoogleButton  onClick={handleGoogleLogin}/>
        </div>
    )
}