import React from "react";
import { useState } from 'react';
import '../styles/register.css'
import logo from '../icons/Logo/ShipRec.png'

function SignInPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in both fields.");
            return;
        }

        try {
            const response = await fetch("https://localhost:8080/api/users/login", {
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

        // Save user info along with when the login will expire - one day from now
        localStorage.setItem("user", JSON.stringify({...resp_data, expiration: Date.now() + 1000 * 60 * 60 * 24}));
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
                    />

                    <label>Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="Enter your password..." 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="forgot-password">
                        {/* update this to handle password */}
                        <a href="?">Forgot password?</a>
                    </div>

                    <button type="submit" className="sign-button">Sign In</button>

                    {/* For the wrong credentials error or the filled fields error */}
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