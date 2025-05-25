import React from "react";
// import { useState,useEffect } from 'react';
import TabContainer from "../components/tabContainer";
import NavigationBar from "../components/navigationBar";
import { Routes, Route } from "react-router-dom";

function MyAccountPage() {

    const accountTabs = [
        { label: "My Profile", href: "/MyAccount" },
        { label: "My Fleets", href: "/MyAccount/fleets" },
        { label: "My Areas", href: "/MyAccount/areas" },
        { label: "My Notifications", href: "/MyAccount/notifications" },
      ];

    return (
        <div className="body">
            <NavigationBar isRegistered = {true} currentTab="My Account"/>
            <TabContainer currentTab="My Account" username="Athanasios" tabs={accountTabs}/>
            <Routes>
                <Route path="/"/>
                <Route path="fleets"/>
                <Route path="areas"/>
                <Route path="notifications"/>
            </Routes>
            <div className="footer"/>
        </div>
    )
}

export default MyAccountPage;