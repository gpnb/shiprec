import React from "react";
// import { useState,useEffect } from 'react';
import '../styles/register.css'
import logo from '../icons/Logo/ShipRec.png'

function SignInPage() {


    return (
        <div className="background">
            <div className="form-container">
                <div className="logo-container">
                    <div className="containers-container">
                    <h1 className="welcome-message">Welcome back </h1>
                    <h1 className="welcome-message" style={{'marginTop': '-20%'}}>to ShipRec !</h1>
                    </div>
                    <img src={logo} alt="ShipRec" className="message-logo"></img>
                </div>

                {/* The form */}
                <form className="form-input">
                    <label>Email</label>
                    <input type="email" id="email" placeholder="Enter your email..." />

                    <label>Password</label>
                    <input type="password" id="password" placeholder="Enter your password..." />

                    <div className="forgot-password">
                        {/* update this to handle password */}
                        <a href="?">Forgot password?</a>
                    </div>

                    <button type="submit" className="sign-button">Sign In</button>

                    <div className="register-link">
                        Don't have an account? <a href="/Register">Register</a>
                    </div>
                </form>
                
            </div>
        </div>
    )
}

export default SignInPage;