// This page includes the contents for the "My Profile" page under the "My account" tab and will be embedded in that

import React from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/myprofile.css'
import editIcon from '../icons/Misc/Edit_dark.png';
import arrowIcon from '../icons/Misc/Arrow.png'
import Return from "../components/return";


function MyProfilePage() {
    const navigate = useNavigate();

  return (
    <div className="profile-container">
        <div className="profile-card">

        <form className="profile-form">
            <div className="form-group">
                <label>First Name</label>
                <input type="text" value="Athanasios"/>
            </div>

            <div className="form-group">
                <label>Last Name</label>
                <input type="text" value="Giavridis"/>
            </div>

            <div className="form-group">
                <label>Country</label>
                <input type="text" value="Greece"/>
            </div>

            <div className="form-group">
                <label>Academic Institution*</label>
                <input type="text" value="NKUOA"/>
            </div>

            <div className="form-group">
                <label>Business*</label>
                <input type="text"/>
            </div>

            <div className="form-group">
                <label>Phone Number*</label>
                <input type="text"/>
            </div>
        </form>

        
        <div className="button-container">
            <div></div>
            <button type="button" className="edit-button" onClick={() => navigate('/editprofile')}>
                Edit Account 
                <img src={editIcon} alt="Edit icon" className="edit-icon" />
            </button>
        </div>
         
        
        </div>
    </div>
  );
}

export default MyProfilePage;
