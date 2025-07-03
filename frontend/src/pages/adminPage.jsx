import React from "react";
import { useState, useEffect } from "react";
import TabContainer from "../components/tabContainer";
import NavigationBar from "../components/navigationBar";
import { Routes, Route, useNavigate } from "react-router-dom";

import MyProfilePage from "../pages/myProfilePage";
import EditProfilePage from "../pages/editProfilePage";
import Return from "../components/return";
import ItemLists from "../components/lists";
import AdminLists from "../components/adminlists";
// import MyFleetsPage from "../pages/myFleetsPage";
// import MyAreasPage from "../pages/myAreasPage";
// import MyNotificationsPage from "../pages/myNotificationsPage";

function AdminPage() {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = localStorage.getItem("user");

        if (currentUser) {
            const parsedUser = JSON.parse(currentUser);

            // Redirect if not admin
            if (!parsedUser.isAdmin) {
                navigate("/");
            } else {
                setUser(parsedUser);
            }
        } else {
            // No user found, redirect
            navigate("/");
        }
    }, [navigate]);
    

    const adminTabs = [
        { label: "Users", href: "/Admin" },
        { label: "Vessels", href: "/Admin/vessels" },
        { label: "Messages", href: "/Admin/messages" },
    ];

    return (
        <div className="body">
            <NavigationBar isRegistered = {user?.isRegistered} isAdmin={user?.isAdmin} currentTab="Admin Page"/>
            {/* Fix this later so that when the user is a guest, they don't get access to this page */}
            <TabContainer currentTab="Admin Page" username={user?.firstName + ' ' + user?.lastName || "Guest"} tabs={adminTabs}>
                <Routes>
                <Route index element={<AdminLists type={"users"} />}/>
                <Route path="vessels" element={<AdminLists type={"vessels"}/>}/>
                <Route path="messages" element={<AdminLists type={"queries"} />}/>
            </Routes>
            <Return/>
            </TabContainer>
            <div className="footer"/>
        </div>
    )
}

export default AdminPage;