import React, { useState } from "react";
import "../styles/popups.css";

// Similar to ChangeEmailPopup
function ChangePasswordPopup({ userId, onClose, onSubmit }) {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handlePasswordChange= async () => {
        // In case user doesn't input something
        if (!newPassword || !currentPassword) {
            setError("Please fill in the fields.");
            return;
        }

        // If confirmation does not match
        if (newPassword !== confirmPassword) {
            setError("Confirmation does not match new password");
            return;
        }

        try {
            const response = await fetch(`https://localhost:8080/api/users/${userId}/password`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    confirmPassword
                })
            });

            if (!response.ok) {
                throw new Error("Wrong current password.");
            }

            setError("");
            onClose();  // close the popup

        } catch (err) {
            setError("Error: " + err.message);
        }
    };

    return (
        
        <div className="popup-background">

            <div className="popup">
            <h3 className="popup-heading">Change your password</h3>

                <div className="popup-field">
                    <label className="popup-label">Current Password</label>
                    <div className="password-input-container">
                        <input 
                        type={showCurrentPassword ? "text" : "password"} 
                        placeholder="Enter your current password..." 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="hide-option"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}>
                        {showCurrentPassword ? "Hide" : "Show"}                    
                    </button>
                    </div>
                </div>

                <div className="popup-field">
                    <label className="popup-label">New Password</label>
                    <div className="password-input-container">
                        <input 
                        type={showNewPassword ? "text" : "password"} 
                        placeholder="Enter your new password..." 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="hide-option"
                        onClick={() => setShowNewPassword((prev) => !prev)}>
                        {showNewPassword ? "Hide" : "Show"}                    
                    </button>
                    </div>
                </div>

                <div className="popup-field">
                    <label className="popup-label">Verify Password</label>
                    <div className="password-input-container">
                        <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Confirm your new password..." 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="hide-option"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}>
                        {showConfirmPassword ? "Hide" : "Show"}                    
                    </button>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="popup-buttons">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handlePasswordChange}>Submit</button>
                </div>
            </div>

        </div>
    );

}

export default ChangePasswordPopup;