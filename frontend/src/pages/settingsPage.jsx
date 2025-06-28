import React from "react";
import { useState, useEffect, useNavigate } from "react";
import NavigationBar from "../components/navigationBar";
import TabContainer from "../components/tabContainer";
import Return from "../components/return";
import "../styles/settings.css";

function SettingsPage() {

    const [user, setUser] = useState(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    // const navigate = useNavigate();

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

    // This will be updated later, dummy for now
    const handleDelete = () => {
        alert("This action is permanent - are you sure you want to delete your account?");
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
                                <button className="settings-action">Change your email</button>
                            </div>
                        </div>

                        <div className="settings-form-group">
                            <label>Password</label>
                            {/* Password shown like this at all times? */}
                            <div className="settings-form-value"> ••••••••• &nbsp;
                                <button className="settings-action">Change your password</button>
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
                            <button className="delete-account" onClick={handleDelete}>
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <Return/>
            </TabContainer>
            <div className="footer" />
        </div>
    );
}

export default SettingsPage;