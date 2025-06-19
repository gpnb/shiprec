import React from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/myprofile.css'


function FAQ() {
    const navigate = useNavigate();

  return (
    <div className="profile-container">
        <div className="profile-card">

        <form className="profile-form">
            <div className="form-group">
                <label>First Name</label>
                <input type="text" value="Athanasios"/>
            </div>
        </form>

        

         
        </div>
    </div>
  );
}

export default FAQ;
