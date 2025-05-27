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
                the form
            </div>
        </div>
    )
}

export default SignInPage;