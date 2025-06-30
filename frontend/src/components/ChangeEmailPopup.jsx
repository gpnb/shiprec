import React, { useState } from "react";
import "../styles/popups.css";

// Pass the userId too, along the close and submit props
function ChangeEmailPopup({ userId, onClose, onSubmit }) {

    const [newEmail, setNewEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Function to pass the information the user inputs to the backend
    const handleEmailChange= async () => {
        // In case user doesn't input something
        if (!newEmail || !currentPassword) {
            setError("Please fill in the fields.");
            return;
        }

        try {
            const response = await fetch(`https://localhost:8080/api/users/${userId}/email`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json" 
                },
                // Email and password are passed to the backend 
                body: JSON.stringify({
                    email: newEmail,
                    password: currentPassword
                })
            });

            if (!response.ok) {
                throw new Error("Wrong password or invalid email address.");
            }

            // Store updated information and pass the right values on clicking either button
            const updatedUser = await response.json();
            localStorage.setItem("user", JSON.stringify(updatedUser));

            onSubmit(updatedUser);  // send the updated info back to settings page
            onClose();              // to close the popup after successul update

        } catch (err) {
            setError("Error: " + err.message);
        }
    };

    return (
        
        <div className="popup-background">

            <div className="popup">
            <h3 className="popup-heading">Change your email</h3>

                <div className="popup-field">
                    <label className="popup-label">New Email</label>
                        <input 
                        type="email" 
                        placeholder="Enter your new email..." 
                        value={newEmail} 
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                </div>

                <div className="popup-field">
                    <label className="popup-label">Password</label>
                    <div className="password-input-container">
                        <input  
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your password..." 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="hide-option"
                        onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? "Hide" : "Show"}                    
                    </button>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="popup-buttons">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleEmailChange}>Submit</button>
                </div>
            </div>

        </div>
    );

}

export default ChangeEmailPopup;