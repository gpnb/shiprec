// This page includes the contents for the "My Profile" page under the "My account" tab and will be embedded in that

import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/myprofile.css'
import editIcon from '../icons/Misc/Edit_dark.png';


function MyProfilePage() {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
            setUser(JSON.parse(currentUser));
        }
    }, []);

    if (!user) {
        console.log("Error : Could not fetch any user");
        return <div>Loading user...</div>;
    }

    return (
    <div className="profile-container">
        <div className="profile-card">

        <form className="profile-form">
            <div className="form-group">
                <label>First Name</label>
                <span className="form-value">{user.firstName || ""}</span>
            </div>

            <div className="form-group">
                <label>Last Name</label>
                <span className="form-value">{user.lastName || ""}</span>
            </div>

            <div className="form-group">
                <label>Country</label>
                <span className="form-value">{user.country || ""}</span>
            </div>

            <div className="form-group">
                <label>Academic Institution</label>
                <span className="form-value">{user.education || ""}</span>
            </div>

            <div className="form-group">
                <label>Business</label>
                <span className="form-value">{user.business || ""}</span>
            </div>

            <div className="form-group">
                <label>Phone Number</label>
                <span className="form-value">{user.phoneNumber || ""}</span>
            </div>
        </form>

        
        <div className="button-container">
            <div></div>
            <button type="button" className="edit-button" onClick={() => navigate('/MyAccount/editprofile')}>
                Edit Account 
                <img src={editIcon} alt="Edit icon" className="edit-icon" />
            </button>
        </div>
        
        
        </div>
    </div>
    );
}

export default MyProfilePage;
