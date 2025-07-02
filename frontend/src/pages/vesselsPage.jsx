import React from "react";
// import { useState,useEffect } from 'react';
import TabContainer from "../components/tabContainer";
import NavigationBar from "../components/navigationBar";
import { Routes, Route } from "react-router-dom";
import ItemLists from "../components/lists";
import Return from "../components/return";
import Details from "../components/details";

// import Fltbtn from "../components/fleetbuttons";
import CreateFleetPopup from "../components/CreateFleetPopup";
import AddToFleetPopup from "../components/AddToFleetPopup";
import { useState } from 'react';
import VesselLists from "../components/vessellists";

function VesselsPage() {

    {/* Change isRegistered to true if we need to see the user's abilities */}
    let isRegistered = false;
    // wrapped in try-catch in case retrieval of user fails
    try {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        isRegistered = currentUser?.isRegistered === true;
    } catch (err) {
        console.error("Couldn't get user from localStorage : ", err);
    }

    // variables for communication between components (list and popups)
    const [popup, setPopup] = useState(false);
    const [popup2, setPopup2] = useState(false);
    const [shareList, setShareList] = useState([]);
    const handleTest = () => {
        console.log(shareList);
    }

    return (
        <div className="body">
            <CreateFleetPopup trigger={popup} setTrigger={setPopup} list={shareList}/>

            <AddToFleetPopup trigger={popup2} setTrigger={setPopup2} list={shareList}/>

            <NavigationBar isRegistered = {isRegistered} currentTab="Vessels"/>
            <TabContainer currentTab="Vessels">
            <Routes>
                <Route index element={<VesselLists type="Vessels" setTrigger={setPopup} setTriggerSec={setPopup2} setList={setShareList}/>}/>
                <Route path="/:id" element={<Details type="Vessels"/>} />
            </Routes>
            <Return/>
            </TabContainer>
            <div className="footer"/>
        </div>
    )
}

export default VesselsPage;