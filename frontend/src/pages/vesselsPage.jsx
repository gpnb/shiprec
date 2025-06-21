import React from "react";
// import { useState,useEffect } from 'react';
import TabContainer from "../components/tabContainer";
import NavigationBar from "../components/navigationBar";
import Return from "../components/return";

function VesselsPage() {

    const accountTabs = [];

    return (
        <div className="body">
            <NavigationBar isRegistered = {true} currentTab="Vessels"/>
            <TabContainer currentTab="Vessels">
            <Return/>
            </TabContainer>
            
            <div className="footer"/>
        </div>
    )
}

export default VesselsPage;