import '../styles/navbar.css'
import React, { useState } from "react";
import map from "../icons/NavBar/Map-page.png"
import vessel from "../icons/NavBar/Vessels-page.png"
import port from "../icons/NavBar/Ports-page.png"
import register from "../icons/NavBar/Register.png"
import signin from "../icons/NavBar/Sign-in.png"
import help from "../icons/NavBar/Help-page.png"
import profile from "../icons/NavBar/Profile-page.png"
import settings from "../icons/NavBar/Settings-page.png"
import admin from "../icons/NavBar/Admin-page.png"
import signout from "../icons/NavBar/Sign-out.png"
import logo_open from "../icons/Logo/ShipRecNav-Open.png"
import logo_closed from "../icons/Logo/ShipRecNav-Closed.png"


const NavigationBar = ({ isRegistered  = true }) => {
    const [isHovered, setIsHovered] = useState(false);

    const commonTabs = [
        { icon: map, label: "Live Map" },
        { icon: vessel, label: "Vessels" },
        { icon: port, label: "Ports" },
    ];

    const guestTabs = [
        { icon: register, label: "Sign Up"},
        { icon: signin, label: "Sign In"},
        { icon: help, label: "Help" },
    ];

    const registeredTabs = [
        { icon: profile, label: "My Account" },
        { icon: settings, label: "Settings" },
        { icon: help, label: "Help" },
        { icon: signout, label: "Sign Out" },
    ];

    const tabsToRender = [...commonTabs, ...(isRegistered ? registeredTabs : guestTabs)];

    return (



    <div className={`side-nav ${isHovered ? "expanded" : "collapsed"}`} onMouseEnter={() => setIsHovered(true)}onMouseLeave={() => setIsHovered(false)}>
        <div className="nav-body">

            <div>
                <div className="logo-container">
                    <img src={isHovered ? logo_open : logo_closed} alt="Logo"className="logo-icon"/>
                </div>

                <div className="top-tabs">
                    {commonTabs.map((tab, index) => (
                        <div key={index} className={`tab ${tab.style || ""}`}>
                        <img src={tab.icon} alt={tab.label} className="tab-icon" />
                        {isHovered && <span className="tab-label">{tab.label}</span>}
                        </div>
                    ))}
                </div>

            </div>
    





        <div className="bottom-tabs">
        {(isRegistered ? registeredTabs : guestTabs).map((tab, index) => (
            <div key={index} className={`tab ${tab.style || ""}`}>
            <img src={tab.icon} alt={tab.label} className="tab-icon" />
            {isHovered && <span className="tab-label">{tab.label}</span>}
            </div>
        ))}
        </div>
    </div>
    </div>
    );
};

export default NavigationBar;
