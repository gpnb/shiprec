import React, { useState } from "react";
import "../styles/popups.css";

function DeleteAccountPopup({ userId, onClose }) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);

        try {
            const response = await fetch(`https://localhost:8080/api/users/${userId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Could not delete account. Please contact the administrators.");
            }

            localStorage.removeItem("user");    // clean up localstorage
            alert("Account successfully deleted.");
            window.location.href = "/";         // navigate to guest map view

        } catch (err) {
            setError("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="popup-background">
            <div className="popup">
                <h3 className="popup-heading">Delete Account</h3>

                <div className="delete-message">This action is <strong>permanent</strong>.</div>
                <div className="delete-message">Are you sure you want to delete your account?</div>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="popup-buttons">
                    <button onClick={onClose}>Cancel</button>
                    <button disabled={loading} onClick={handleDelete}>
                        {loading ? "Loading..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );

}

export default  DeleteAccountPopup;