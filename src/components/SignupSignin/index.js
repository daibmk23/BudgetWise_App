import React, { useState } from 'react';
import "./styles.css";
import Input from '../Input';
import Button from '../Button';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDoc, setDoc } from "firebase/firestore";
import { auth, db, doc, provider } from '../../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';


function SignupSigninComponent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState(false);
    const navigate = useNavigate();
    
    function signUp(e) {
        setLoading(true);
        e.preventDefault();
        console.log(name, email, password, confirmPassword);
        if (name && email && password && confirmPassword) {
            if (password !== confirmPassword) {
                setLoading(false);
                toast.error('Passwords do not match');
                return;
            }
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    toast.success('Account created successfully');
                    setLoading(false);
                    setName("");
                    setEmail("");   
                    setPassword("");
                    setConfirmPassword("");
                    createDoc(user);
                    navigate("/dashboard");

                })
                .catch((error) => {
                    setLoading(false);
                    toast.error(error.message);
                });
        } else {
            setLoading(false);
            toast.error('Please fill all the fields');
        }
    }

    async function createDoc(user) {
        setLoading(true);
        if (!user) return
        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);

        if (userData.exists()) {
            toast.error('Documentation already exists');
            setLoading(false);
        }
        else {
            try {
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName? user.displayName : name,
                    email: user.email,
                    photoURL: user.photoURL? user.photoURL : null,
                    uid: user.uid,
                    createdAt: new Date(),
                })
                toast.success('Documentation created successfully');
                setLoading(false);
                
            } catch (error) {
                toast.error(error.message);
                setLoading(false);
            }
        }
    }

    function loginUsingEmail(e) {
        setLoading(true);
        if (email !== "" && password !== "") {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                toast.success('Logged in successfully');
                navigate("/dashboard");
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error("Invalid Credentials");
                setLoading(false);
            });
        }
        else {
            toast.error('Please fill all the fields');
            setLoading(false);
        }
    }    

    function googleAuth() {
        setLoading(true);
        try {
            signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                createDoc(user);
                toast.success('Logged in successfully');
                navigate("/dashboard");
                setLoading(false);
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                toast.error('An error occurred');
                setLoading(false);
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
            
        } catch (error) {
            toast.error(error.message);
            //setLoading(false);
        }
}

    return (
        <div className='signup-wrapper'>
            <h2 className='title'>
                {login ? 'Welcome Back to' : 'Join'} <span style={{ color: "var(--theme)" }}>BudgetWise</span>
            </h2>
            <h3 className='subtitle'>
                {login ? 'Sign in to continue' : 'Sign up and manage your expenses effortlessly!'}
            </h3>
            <form>
                {!login && (
                    <Input 
                        type="text"
                        label="Full Name"
                        state={name} 
                        setState={setName} 
                        placeholder="Firstname Surname" 
                    />
                )}
                <Input 
                    type="email"
                    label="Email"
                    state={email} 
                    setState={setEmail} 
                    placeholder="xyz123@gmail.com" 
                />
                <Input 
                    type="password"
                    label={login ? "Password" : "Set Password"} 
                    state={password} 
                    setState={setPassword} 
                    placeholder="Example_123" 
                />
                {!login && (
                    <Input 
                        type="password"
                        label="Confirm Password"
                        state={confirmPassword} 
                        setState={setConfirmPassword} 
                        placeholder="Example_123" 
                    />
                )}
                <Button 
                    disabled={loading}
                    text={loading ? "Loading..." : login ? "Sign in" : "Sign up"} 
                    onClick={login? loginUsingEmail : signUp}
                />

                <p style={{ textAlign: 'center' }}>OR</p>
                
                <Button 
                    disabled={loading}
                    onClick={googleAuth}
                    text={loading ? "Loading..." : login ? "Sign in with Google" : "Sign up with Google"} 
                    blue={true} 
                />

                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    {login ? "Don't have an account?" : "Already have an account?"} 
                    <span 
                        style={{ color: "var(--theme)", cursor: "pointer" }}
                        onClick={() => setLogin(!login)}
                    >
                        {login ? " Sign up" : " Sign in"}
                    </span>
                </p>
            </form>
        </div>
    );
}

export default SignupSigninComponent;
