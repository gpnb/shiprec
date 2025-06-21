import React from "react";
// import { useState,useEffect } from 'react';
import TabContainer from "../components/tabContainer";
import NavigationBar from "../components/navigationBar";
import { Routes, Route } from "react-router-dom";
import Contact from "../pages/contact";
import FAQ from "../pages/faq";
import Return from "../components/return";


function HelpPage() {

    const accountTabs = [
        { label: "Frequently Asked Questions (FAQ)  ", href: "/Help" },
        { label: "Help Center - Contact Us", href: "/Help/contact" },
      ];

    return (
        <div className="body">
            <NavigationBar isRegistered = {true} currentTab="Help"/>
            <TabContainer currentTab="Help" username="" tabs={accountTabs}>
            <Routes>
                <Route path="/"  element={<FAQ/>}/>
                <Route path="contact"  element={<Contact/>}/>
            </Routes>
            <Return/>
            </TabContainer>

            <div className="footer"/>
        </div>
    )
}

export default HelpPage;