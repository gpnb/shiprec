import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/myprofile.css'
import editIcon from '../icons/Misc/Edit_dark.png';
import Select from "react-select";
import { getData } from "country-list";

const countries = getData();

function EditProfilePage() {

    // Transform to react-select format
    const countryOptions = countries.map((country) => ({
        value: country.code,
        label: country.name,
    }));

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
            const parsed_data = JSON.parse(currentUser);
            setUser(parsed_data);

            // the default country that will be chosen
            const match = countryOptions.find(c => c.value === parsed_data.country);
            setSelectedCountry(match || null);
        }
    }, []);

    if (!user) {
        console.log("Error : Could not fetch any user");
        return <div>Loading user (editing profile)...</div>;
    }


    const handleFieldChange = (e) => {
        // Copy the old user state and only change the values of the fields the user selects
        setUser({...user, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        try {
            // Get the value of the user's id ($) and inject it into api/users/
            const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
                method: "PUT", // since we're updating something already existing
                headers: {
                    "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        
        if (!response.ok) {
            throw new Error("Failed to update user information.")
        }

        // The updated user data
        const resp_data = await response.json();
        console.log("Update success:", resp_data);
        localStorage.setItem("user", JSON.stringify(resp_data));

        navigate("/MyAccount"); // redirect back to the normal profile view

        } catch (error) {
            console.error("Failed to update user:", error);
            alert("Error updating profile. Please try again."); 
        }
    }



    return (
    <div className="profile-container">
        <div className="profile-card">

        <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>First Name</label>
                <input type="text" name="firstName" value={user.firstName || ""} onChange={handleFieldChange}/>
            </div>

            <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" value={user.lastName || ""} onChange={handleFieldChange}/>
            </div>

            <div className="form-group">
                <label>Country</label>
                <Select
                    name="country"
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={(selectedOption) => {
                        setSelectedCountry(selectedOption);
                        setUser(prev => ({ ...prev, country: selectedOption?.value || "" }));
                    }}
                    placeholder="Choose your country..."
                    className="country-select"
                    classNamePrefix="rs"
                />
            </div>

            <div className="form-group">
                <label>Academic Institution</label>
                <input type="text" name="education" value={user.education || ""} onChange={handleFieldChange}/>
            </div>

            <div className="form-group">
                <label>Business</label>
                <input type="text" name="business" value={user.business || ""} onChange={handleFieldChange}/>
            </div>

            <div className="form-group">
                <label>Phone Number</label>
                <input type="text" name="phoneNumber" value={user.phoneNumber || ""} onChange={handleFieldChange}/>
            </div>
        </form>

        <div className="button-container">
        <div></div>
            <button type="button" className="edit-button" onClick={handleSubmit}>
                Save Changes
                <img src={editIcon} alt="Edit icon" className="edit-icon" />
            </button>
        </div>
        </div>
    </div>
    );
}

export default EditProfilePage;
