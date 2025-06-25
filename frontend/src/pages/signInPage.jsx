import React from "react";
import { useState, useEffect } from 'react';
import '../styles/register.css'
import logo from '../icons/Logo/ShipRec.png'

function SignInPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // for "login failed" messages

        try {
            const response = await fetch("http://localhost:8080/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        });
        
        if (!response.ok) {
            throw new Error("Wrong email or password.")
        }

        const resp_data = await response.json();
        console.log("Login success:", resp_data);

        localStorage.setItem("user", JSON.stringify(resp_data));    // save user info - in localstorage for now
        
        // Redirect to map page:
        window.location.href = "/";

        } catch (err) {
            setError("Wrong email or password!");
            console.error("Login failed:", err);
        }
    };


    return (
        <div className="background">
            <div className="form-container" style={{'marginTop': '6%'}}>
                <div className="logo-container" >
                    <div className="containers-container">
                    <h1 className="welcome-message">Welcome back </h1>
                    <h1 className="welcome-message" style={{'marginTop': '-20%'}}>to ShipRec !</h1>
                    </div>
                    <img src={logo} alt="ShipRec" className="message-logo" style={{'marginTop': '12%'}}></img>
                </div>

                {/* The form */}
                <form className="form-input" style={{'marginTop': '15%'}} onSubmit={handleLogin}>
                    <label>Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        placeholder="Enter your email..." 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="Enter your password..." 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="forgot-password">
                        {/* update this to handle password */}
                        <a href="?">Forgot password?</a>
                    </div>

                    <button type="submit" className="sign-button">Sign In</button>

                    {/* for the wrong credentials error */}
                    {error && <p className="login-error">{error}</p>} 

                    <div className="register-link">
                        Don't have an account? <a href="/Register">Register</a>
                    </div>
                </form>
                
            </div>
        </div>
    )
}

export default SignInPage;