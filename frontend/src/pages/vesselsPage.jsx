import React from "react";
// import { useState,useEffect } from 'react';
import TabContainer from "../components/tabContainer";
import NavigationBar from "../components/navigationBar";
import { Routes, Route } from "react-router-dom";
import ItemLists from "../components/lists";
import Return from "../components/return";


function VesselsPage() {

    const accountTabs = [];

    const username = '';

    return (
        <div className="body">
            <NavigationBar isRegistered = {true} currentTab="Vessels"/>
            <TabContainer currentTab="Vessels" username={username}>
            <Routes>
                <Route index element={<ItemLists/>} />
                {/* <Route path="" element={<Details/>} /> */}
            </Routes>
            <Return/>
            </TabContainer>
            <div className="footer"/>
        </div>
    )
}

export default VesselsPage;