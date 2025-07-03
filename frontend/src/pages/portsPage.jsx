import React, { useEffect, useState } from "react";
// import { useState,useEffect } from 'react';
import TabContainer from "../components/tabContainer";
import NavigationBar from "../components/navigationBar";
import { Routes, Route } from "react-router-dom";
import ItemLists from "../components/lists";

import Return from "../components/return";
import Details from "../components/details";

function PortsPage() {

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

    return (
        <div className="body">
            <NavigationBar isRegistered = {user?.isRegistered} isAdmin = {user?.isAdmin} currentTab="Ports"/>
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