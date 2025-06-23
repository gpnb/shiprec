import React from "react";
// import { useState,useEffect } from 'react';
import TabContainer from "../components/tabContainer";
import NavigationBar from "../components/navigationBar";
import { Routes, Route } from "react-router-dom";
import ItemLists from "../components/lists";
import Return from "../components/return";

function PortsPage() {


    const accountTabs = [];

    return (
        <div className="body">
            <NavigationBar isRegistered = {true} currentTab="Ports"/>
            <TabContainer currentTab="Ports">
            <Routes>
                <Route index element={<ItemLists type="ports"/>} />
                {/* <Route path="" element={<Details type="vessels"/>} /> */}
            </Routes>
            <Return/>
            </TabContainer>
            <div className="footer"/>
        </div>
    )
}

export default PortsPage;