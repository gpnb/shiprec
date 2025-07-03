// This page includes the contents for the "My Fleets" page under the "My account" tab and will be embedded in that

import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/myprofile.css'
import FleetDetails from "../components/fleetdetails";

function FleetPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
            setUser(JSON.parse(currentUser));
        }
    }, []);

    if (!user) {
        console.log("Error :Could not fetch any user");
        return <div>Loading user...</div>;
    }

    return (
        <div className="profile-container">
            <FleetDetails type={user.id}/>
        </div>
    )
}

export default FleetPage;