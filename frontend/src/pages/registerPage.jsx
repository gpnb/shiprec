import React from "react";
import '../styles/register.css'
import logo from '../icons/Logo/ShipRec.png'
import { useState, useEffect } from 'react';
import Select from "react-select"; // Use npm install react-select
import { getData } from "country-list"; // Use npm install country-list

const countries = getData();

function RegisterPage() {
    const [error, setError] = useState("");

    // Transform country list to react-select format
    const countryOptions = countries.map((country) => ({
        value: country.code,
        label: country.name,
    }));
    

    const [selectedCountry, setSelectedCountry] = useState(null);

    // Initialize register data with empty values
    const [registerData, setRegisterData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        country: "",
    });


    // To correctly get country chosen
    useEffect(() => {
        if (selectedCountry) {
            setRegisterData((prev) => ({
                ...prev,
                country: selectedCountry.value,
            }));
        }
    }, [selectedCountry]);

    // Function that changes the value of a field when altered
    const handleFieldChange = (e) => {
        setError(""); // clean up the errors
        setRegisterData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    // Function to handle field submission, on clicking "Register"
    const handleSubmit = async(e) => {
        e.preventDefault(); // this is to prevent register form reload

        // If user doesn't fill in all fields
        if (!registerData.email || !registerData.password || !registerData.firstName || !registerData.lastName || !selectedCountry) {
            setError("Please fill in all required fields.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;    // to check for valid email format
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // to check for valid password format - at least 8 characters, including letters and digits

        if (!emailRegex.test(registerData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!passwordRegex.test(registerData.password)) {
            setError("Password must be at least 8 characters and contain both letters and numbers.");
            return;
        }       


        try {
            const fetchResult = await fetch("https://localhost:8080/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData),
            });

            const result = await fetchResult.json();
            localStorage.setItem("user", JSON.stringify(result));

            if (fetchResult.ok) {
                // Save registered user to redirect to the right page after
                const newUser = {...result, isRegistered: true};

                localStorage.setItem("user", JSON.stringify(newUser));

                alert("User Registered successfully.");
                window.location.href = "/";  // redirect to the map page
            } else {
                setError(`Error registering user: ${JSON.stringify(result)}`);
            }
        } catch (err) {
            // Failed to reach backend 
            console.log("Failed to reach backend : " + err.message)
            setError("An error occured. Failed to register.");
        }
    };



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
                <form className="form-input" onSubmit={handleSubmit}>
                    <label>Email*</label>
                    <input type="email" id="email" value={registerData.email} onChange={handleFieldChange} placeholder="Enter your email..." />
    
                    <label>Password*</label>
                    <input type="password" id="password"  value={registerData.password} onChange={handleFieldChange} placeholder="Enter your password..." />

                    <div className="name-input">
                        <div className="field-group">
                            <label>First Name*</label>
                            <input type="text" id="firstName" value={registerData.firstName} onChange={handleFieldChange} placeholder="Enter first name..." />
                        </div>
                        <div className="field-group">
                            <label>Last Name*</label>
                            <input type="text" id="lastName" value={registerData.lastName} onChange={handleFieldChange} placeholder="Enter last name..." />
                        </div>
                    </div>

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

                    {error && <div className="register-error">{error}</div>}

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