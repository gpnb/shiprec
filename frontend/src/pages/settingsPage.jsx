import React from "react";
// import { useState,useEffect } from 'react';
import NavigationBar from "../components/navigationBar";
import TabContainer from "../components/tabContainer";

function SettingsPage() {


    return (
        <div className="body">
            <NavigationBar isRegistered = {true} currentTab="Settings"/>
            <TabContainer currentTab="Settings"/>
            <div className="footer"/>
        </div>
    )
}

export default SettingsPage;