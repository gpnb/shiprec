import React from "react";
// import { useState,useEffect } from 'react';
import TabContainer from "../components/tabContainer";
import NavigationBar from "../components/navigationBar";
import { Routes, Route } from "react-router-dom";
import ItemLists from "../components/lists";

import Return from "../components/return";
import Details from "../components/details";

function PortsPage() {

    {/* Change isRegistered to true if we need to see the user's abilities */}
    let isRegistered = false;
    // wrapped in try-catch in case retrieval of user fails
    try {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        isRegistered = currentUser?.isRegistered === true;
    } catch (err) {
        console.error("Couldn't get user from localStorage : ", err);
    }

    return (
        <div className="body">
            <NavigationBar isRegistered = {isRegistered} currentTab="Ports"/>
            <TabContainer currentTab="Ports">
            <Routes>
                <Route index element={<ItemLists type="Ports"/>} />
                <Route path="/:id" element={<Details type="Ports"/>} />
            </Routes>
            <Return/>
            </TabContainer>
            <div className="footer"/>
        </div>
    )
}

export default PortsPage;