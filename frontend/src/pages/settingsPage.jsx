import React from "react";
// import { useState,useEffect } from 'react';
import NavigationBar from "../components/navigationBar";
import TabContainer from "../components/tabContainer";
import Return from "../components/return";

function SettingsPage() {


    return (
        <div className="body">
            <NavigationBar isRegistered = {true} currentTab="Settings"/>
            <TabContainer currentTab="Settings">
            <Return/>
            </TabContainer>
            <div className="footer"/>
        </div>
    )
}

export default SettingsPage;