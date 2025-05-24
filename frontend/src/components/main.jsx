import React from 'react';
import {Routes, Route,useLocation,useNavigate} from 'react-router-dom';
import { useState,useEffect } from 'react';
import MapPage from '../pages/mapPage';
import VesselsPage from '../pages/vesselsPage';
import PortsPage from '../pages/portsPage';
import SettingsPage from '../pages/settingsPage';
import MyAccountPage from '../pages/myAccountPage';
import HelpPage from '../pages/helpPage';
import SignInPage from '../pages/signInPage';
import RegisterPage from '../pages/registerPage';
import AdminPage from '../pages/adminPage';
import ProtectedRoute from './protectedRoute';
import axios from 'axios';

const SERVER_URL = "https://localhost:8080";

const authenticate = (token) => {
    const API_URL = SERVER_URL + "/auth/";
    return axios.get(API_URL,{
        params: {token : token},
        responseType: 'json'
    }).then(response => response.data);
}

const Main=()=>{


    return(
        // all app routes
        <Routes>
            <Route exact path='/' element={<MapPage/>} ></Route>
            <Route exact path='/Vessels' element={<VesselsPage/>}></Route>
            <Route exact path='/Ports' element={<PortsPage/>}></Route>
            <Route exact path='/MyAccount' element={<MyAccountPage/>}></Route>
            <Route exact path='/Settings' element={<SettingsPage/>}></Route>
            <Route exact path='/Help' element={<HelpPage/>}></Route>
            <Route exact path='/SignIn' element={<SignInPage/>}></Route>
            <Route exact path='/Register' element={<RegisterPage/>}></Route>
            <Route exact path='/Admin' element={<AdminPage/>}></Route>
        </Routes>
    );
}

export default Main;