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
import admin_open from "../icons/Logo/ShipRecAdmin-Open.png"
import admin_closed from "../icons/Logo/ShipRecAdmin-Closed.png"
import { href } from 'react-router-dom';

const NavigationBar = ({ isRegistered, isAdmin,currentTab}) => {
    const [isHovered, setIsHovered] = useState(false);

    const commonTabs = [
        { icon: map, label: "Live Map", href: '/'},
        { icon: vessel, label: "Vessels", href: '/Vessels' },
        { icon: port, label: "Ports", href: '/Ports' },
    ];

    const guestTabs = [
        { icon: register, label: "Register", style: "register", href: '/Register'},
        { icon: signin, label: "Sign In" , style: "signin", href: '/SignIn'},
        { icon: help, label: "Help" , href: '/Help'},
    ];


    const baseRegisteredTabs = [
        { icon: profile, label: "My Account", href: '/MyAccount' },
        { icon: settings, label: "Settings" , href: '/Settings'},
        { icon: help, label: "Help", href: '/Help' },
        { icon: signout, label: "Sign Out", style: "signout", href: '/' },
    ];

    const registeredTabs = isAdmin
        ? [{ icon: admin, label: "Admin Page", href: '/Admin'}, ...baseRegisteredTabs]
        : baseRegisteredTabs;

    return (



    <div className={`side-nav ${isHovered ? "expanded" : "collapsed"}`} onMouseEnter={() => setIsHovered(true)}onMouseLeave={() => setIsHovered(false)}>
        <div className="nav-body">

            <div>
                <div className="shipreclogo-container">
                    <img src={ isAdmin ? isHovered ? admin_open : admin_closed : isHovered ? logo_open : logo_closed} alt="Logo" className={`shipreclogo-icon${isAdmin ? '-admin-logo' : ''}`}/>
                </div>

                <div className="top-tabs">
                    {commonTabs.map((tab, index) => (
                        <div key={index} className={`tab ${tab.style || ""} ${currentTab === tab.label ? "active-tab" : ""}`} onClick={() => window.location.href = tab.href}>
                        <img src={tab.icon} alt={tab.label} className="tab-icon" />
                        {isHovered && <span className="tab-label">{tab.label}</span>}
                        </div>
                    ))}
                </div>

            </div>
    





        <div className="bottom-tabs">
        {(isRegistered ? registeredTabs : guestTabs).map((tab, index) => (
                // <div  key={index} className={`tab ${tab.style || ""} ${currentTab === tab.label ? "active-tab" : ""}`}  onClick={() => window.location.href = tab.href}>
                <div  key={index} className={`tab ${tab.style || ""} ${currentTab === tab.label ? "active-tab" : ""}`}  
                    onClick={() => {
                        if (tab.label === "Sign Out")  {
                            localStorage.removeItem("user");
                            window.location.href = "/SignIn";
                        } else {
                            window.location.href = tab.href;
                        }
                    }}
                >
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
