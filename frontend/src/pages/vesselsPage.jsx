import React, { useEffect, useState } from "react";
// import { useState,useEffect } from 'react';
import TabContainer from "../components/tabContainer";
import NavigationBar from "../components/navigationBar";
import { Routes, Route } from "react-router-dom";
// import ItemLists from "../components/lists";
import Return from "../components/return";
import Details from "../components/details";

// import Fltbtn from "../components/fleetbuttons";
import CreateFleetPopup from "../components/CreateFleetPopup";
import AddToFleetPopup from "../components/AddToFleetPopup";
import VesselLists from "../components/vessellists";

function VesselsPage() {

        const [user, setUser] = useState(null);
    
        useEffect(() => {
            const currentUser = localStorage.getItem('user');
    
            if (currentUser) {
                const parsed_data = JSON.parse(currentUser);
                
                // Session expiration check
                if (parsed_data.expiresAt && Date.now() > parsed_data.expiresAt) {
                    localStorage.removeItem('user');
                    window.location.href = "/SignIn";
                } else {
                    setUser(parsed_data);
                }
            }
    
    
        }, []);

    // wrapped in try-catch in case retrieval of user fails

    // variables for communication between components (list and popups)
    const [popup, setPopup] = useState(false);
    const [popup2, setPopup2] = useState(false);
    const [shareList, setShareList] = useState([]);
    // const handleTest = () => {
    //     console.log(shareList);
    // }

    return (
        <div className="body">
            <CreateFleetPopup trigger={popup} setTrigger={setPopup} list={shareList}/>

            <AddToFleetPopup trigger={popup2} setTrigger={setPopup2} list={shareList}/>

            <NavigationBar isRegistered = {user?.isRegistered} isAdmin= {user?.isAdmin} currentTab="Vessels"/>
            <TabContainer currentTab="Vessels">
            <Routes>
                <Route index element={<VesselLists type="Vessels" setTrigger={setPopup} setTriggerSec={setPopup2} setList={setShareList}/>}/>
                <Route path="/:id" element={<Details type="Vessels" setTrigger={setPopup} setTriggerSec={setPopup2} setList={setShareList}/>} />
            </Routes>
            <Return/>
            </TabContainer>
            <div className="footer"/>
        </div>
    )
}

export default VesselsPage;