import React from "react";
import '../styles/register.css'
import logo from '../icons/Logo/ShipRec.png'
import { useState,useEffect } from 'react';
import Select from "react-select"; // Use npm install react-select
import { getData } from "country-list"; // Use npm install country-list

const countries = getData();

function RegisterPage() {

    // Transform country list to react-select format
    const countryOptions = countries.map((country) => ({
        value: country.code,
        label: country.name,
    }));
    
  
  const [selectedCountry, setSelectedCountry] = useState(null);

    return (
        <div className="background">
            <div className="form-container">
                <div className="logo-container">
                    <div className="containers-container">
                    <h1 className="welcome-message">Welcome to</h1>
                    <h1 className="welcome-message" style={{'marginTop': '-22%'}}>ShipRec !</h1>
                    </div>
                    <img src={logo} alt="ShipRec" className="message-logo"></img>
                </div>

                {/* The form */}
                <form className="form-input">
                    <label>Email*</label>
                    <input type="email" id="email" placeholder="Enter your email..." />
    
                    <label>Password*</label>
                    <input type="password" id="password" placeholder="Enter your password..." />

                    <div className="name-input">
                        <div className="field-group">
                            <label>First Name*</label>
                            <input type="text" id="firstName" placeholder="Enter first name..." />
                        </div>
                        <div className="field-group">
                            <label>Last Name*</label>
                            <input type="text" id="lastName" placeholder="Enter last name..." />
                        </div>
                    </div>

                    {/* Drop-down style to select country -> add more later or use database */}
                    <label htmlFor="country">Country*</label>
                        <Select
                        id="country"
                        options={countryOptions}
                        value={selectedCountry}
                        onChange={setSelectedCountry}
                        placeholder="Choose your country..."
                        className="country-select"
                        classNamePrefix="rs"
                        />

{/* 
<select id="country" className="country-select">
                            <option value="">Choose your country...</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="GR">Greece</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                            <option value="CN">China</option>
                            <option value="JP">Japan</option>
                            <option value="BR">Brazil</option>
                            <option value="IN">India</option>
                        </select> */}

                    <button type="submit" className="sign-button">Register</button>
    
                    <div className="register-link">
                        Already have an account? <a href="/SignIn">Sign in</a>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage;