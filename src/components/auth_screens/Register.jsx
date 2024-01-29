import React, { useState,useEffect  } from "react";
import GoogleButton from 'react-google-button';
import { auth, provider, signInWithPopup, createUserWithEmailAndPassword ,db} from '../../services/firebaseConfig';
import { doc, setDoc } from "firebase/firestore"; 

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [loggedIn, setLoggedIn] = useState(false); 
    const [userData, setUserData] = useState(null); 
    const [error, setError] = useState(null);

    useEffect(() => {
        // Use effect to show alert when error changes
        if (error) {
            window.alert(error);
        }
    }, [error]);


    const registerOnClick = async (e) => {
        e.preventDefault();
        try {
              // Reset error state on each submit attempt
              setError(null);

              if (!email || !pass) {
                setError('Email and password are required');
                return;
            }
            // Create a new user with email and password
            const result = await createUserWithEmailAndPassword(auth, email, pass);
            const user = result.user;

        // Add a new document in collection "cities"
        await setDoc(doc(db, "users", user.uid), {
            displayName: name,
            photoURL: user.photoURL,
            email: email,
            uid: user.uid
        });

            
            // Update the user state and display relevant info
            setLoggedIn(true);
            setUserData({ displayName: name, email: user.email });

            console.log('User Info:', name, user.email);
        }catch (error) {
            // Handle specific error cases
            if (error.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters');
            } else if(error.code === 'auth/email-already-in-use'){
                setError('Email is already in use TRY LOGIN');
            } else {
                setError('Email and password registration failed: ' + error.message);
            }
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

    //USER PROFILE IF USER IS LOGGED IN !!!
        if(loggedIn){
            return (
                // Display user data when authenticated
                <div className="logged-in-container">
                      <img src={userData.photoURL} alt="User Photo"  
                      onError={(e) => {
                    e.target.src = '../../assets/no.jpg';
                }}/>
                    <h2>Welcome, {userData.displayName}!</h2>
                    <h3>Email : {userData.email}</h3>
                </div>
            )
        }

    return (
        <div className="auth-form-container">
            <h2>Register</h2>
        <form className="register-form" onSubmit={registerOnClick}>
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
