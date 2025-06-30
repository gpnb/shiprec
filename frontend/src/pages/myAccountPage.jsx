import React from "react";
import { useState, useEffect } from "react";
import TabContainer from "../components/tabContainer";
import NavigationBar from "../components/navigationBar";
import { Routes, Route } from "react-router-dom";

import MyProfilePage from "../pages/myProfilePage";
import EditProfilePage from "../pages/editProfilePage";
import Return from "../components/return";
// import MyFleetsPage from "../pages/myFleetsPage";
// import MyAreasPage from "../pages/myAreasPage";
// import MyNotificationsPage from "../pages/myNotificationsPage";

function MyAccountPage() {

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
    

    const accountTabs = [
        { label: "My Profile", href: "/MyAccount" },
        { label: "My Fleets", href: "/MyAccount/fleets" },
        { label: "My Areas", href: "/MyAccount/areas" },
        { label: "My Notifications", href: "/MyAccount/notifications" },
    ];

    return (
        <div className="body">
            <NavigationBar isRegistered = {user?.isRegistered} currentTab="My Account"/>
            {/* Fix this later so that when the user is a guest, they don't get access to this page */}
            <TabContainer currentTab="My Account" username={user?.firstName + ' ' + user?.lastName || "Guest"} tabs={accountTabs}>
                <Routes>
                <Route index element={<MyProfilePage/>}/>
                <Route path="/editprofile" element={<EditProfilePage/>}/>
                <Route path="fleets"/>
                <Route path="areas"/>
                <Route path="notifications"/>
            </Routes>
            <Return/>
            </TabContainer>
            <div className="footer"/>
        </div>
    )
}

export default MyAccountPage;