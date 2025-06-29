import React from "react";
import { useState, useEffect } from "react";
import NavigationBar from "../components/navigationBar";
import TabContainer from "../components/tabContainer";
import Return from "../components/return";
import ChangeEmailPopup from "../components/ChangeEmailPopup";
import ChangePasswordPopup from "../components/ChangePasswordPopup"
import DeleteAccountPopup from "../components/DeleteAccountPopup";
import "../styles/settings.css";

function SettingsPage() {

    const [user, setUser] = useState(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    // For the popups / modals
    const [emailPopup, setEmailPopup] = useState(false);    // whether it's shown or not
    const [passwordPopup, setPasswordPopup] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);

    // Get the current user's information
    useEffect(() => {
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
            setUser(JSON.parse(currentUser));
            setNotificationsEnabled(JSON.parse(currentUser).notificationsActive || false); // for toggle switch
        }
    }, []);

    if (!user) {
        console.log("Error : Could not fetch any user");
        return <div>Loading user settings...</div>;
    }

    // Handle toggling the "Active Notifications" switch
    const handleToggle = async () => {
        const notifUpdated = !notificationsEnabled;
        const userInfo = {...user, notificationsActive: notifUpdated}; // store user information as it is

        setNotificationsEnabled(notifUpdated);
        setUser(userInfo);
        localStorage.setItem("user", JSON.stringify(userInfo));

        try {
            const response = await fetch(`https://localhost:8080/api/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userInfo)
            });

            if (!response.ok) {
                throw new Error("Failed to update notification setting.");
            }

            const updatedUser = await response.json();
            updatedUser.creationTimestamp = updatedUser.creationTimestamp || user.creationTimestamp; // store timestamp

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

        } catch (err) {
            alert("Error updating notification setting.", err);
        }
    };


    return (
        <div className="body">
            <NavigationBar isRegistered={true} currentTab="Settings" />
            <TabContainer currentTab="Settings">

            <div className="settings-container">
                <div className="settings-card">
                    <div className="settings-form">

                    <h2>Account Overview</h2>

                        <div className="settings-form-group">
                            <label>Name</label>
                            <div className="settings-form-value"> {user?.firstName} {user?.lastName}</div>
                        </div>

                        <div className="settings-form-group">
                            <label>Email</label>
                            {/* non-breaking space to avoid errors  */}
                            <div className="settings-form-value"> {user?.email} &nbsp;
                                <button className="settings-action" onClick={() => setEmailPopup(true)}> 
                                    Change your email
                                </button>
                            </div>
                        </div>

                        <div className="settings-form-group">
                            <label>Password</label>
                            {/* Password shown like this at all times? */}
                            <div className="settings-form-value"> ••••••••• &nbsp;
                                <button className="settings-action" onClick={() => setPasswordPopup(true)}>
                                    Change your password
                                </button>
                            </div>
                        </div>

                        <div className="settings-form-group">
                            <label>Created On</label> 
                            <div className="settings-form-value"> {user?.creationTimestamp ? new Date(user.creationTimestamp).toLocaleString() : "N/A"}</div>
                        </div>

                        <h2>Notification Settings</h2>

                        <div className="settings-form-value">Send a corresponding email for every notification.</div>
                        <div className="toggle-row">
                            <label className="switch">
                                {/* Handle it like a checkbox, styles applied */}
                                <input type="checkbox" checked={notificationsEnabled} onChange={handleToggle} />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="delete-section">
                            <button className="delete-account" onClick={() => setDeletePopup(true)}>
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <Return/>
            </TabContainer>

            {/* Manage the email popup if active. Pass the data necessary and store the updated information, confirm. */}
            {emailPopup && (
                <ChangeEmailPopup
                    userId={user.id}
                    onClose={() => setEmailPopup(false)}    // closes the popup
                    onSubmit={(updatedUser) => {            // handles successful update
                        setUser(updatedUser);
                        localStorage.setItem("user", JSON.stringify(updatedUser));
                        alert("Successfully changed email.");
                    }}
                />
            )}

            {/* Manage the password popup if active. */}
            {passwordPopup && (
                <ChangePasswordPopup
                    userId={user.id}
                    onClose={() => setPasswordPopup(false)}
                    onSubmit={() => {
                        // No need to store something in localStorage - password is updated only on the backend
                        alert("Successfully changed password.");
                    }}
                />
            )}

            {deletePopup && (
                <DeleteAccountPopup
                    userId={user.id}
                    onClose={() => setDeletePopup(false)}
                />
            )}

            <div className="footer" />
        </div>
    );
}

export default SettingsPage;