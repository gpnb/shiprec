import React from "react";
// import { useState,useEffect } from 'react';
import TabContainer from "../components/tabContainer";
import NavigationBar from "../components/navigationBar";
import { Routes, Route } from "react-router-dom";
import ItemLists from "../components/lists";
import Return from "../components/return";
import Details from "../components/details";


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

    return (
        <div className="body">
            <NavigationBar isRegistered = {isRegistered} currentTab="Vessels"/>
            <TabContainer currentTab="Vessels">
            <Routes>
                <Route index element={<ItemLists type="Vessels"/>}/>
                <Route path="/:id" element={<Details type="Vessels"/>} />
            </Routes>
            <Return/>
            </TabContainer>
            <div className="footer"/>
        </div>
    )
}

export default VesselsPage;