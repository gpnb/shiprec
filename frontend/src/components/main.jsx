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
import userService from '../service/userService';

const SERVER_URL = "https://localhost:8080";

const authenticate = (token) => {
    const API_URL = SERVER_URL + "/auth/";
    return axios.get(API_URL,{
        params: {token : token},
        responseType: 'json'
    }).then(response => response.data);
}

const Main=()=>{
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const excludedPaths = ['/SignIn', '/Register', '/', '/Vessels', '/Ports', '/Help'];

    const navigate = useNavigate();
    const location = useLocation();

    // const checkAuthentication = async () => {
    //     const token = localStorage.getItem('jwt_token');
        
    //     if (token !== null) {
    //         // authenticate user
    //         try {
    //             await authenticate(token);
    //             setIsAuthenticated(true);
    //         }
    //         // if authentication fails, display message and redirect to map page
    //         catch(error) {
    //             console.error('Token validation failed:', error.response);
    //             setIsAuthenticated(false);
    //             alert('token validation failed')
    //             navigate('/');
    //         }
            
    //     } 
    //     // if there is no token, the user is not authenticated, show message and redirect them to map page
    //     else {
    //         console.log('User not authenticated');
    //         alert('User not authenticated')
    //         setIsAuthenticated(false);
    //         navigate('/');
    //     }
    //     setIsLoading(false); // Loading complete
    // };

    // useEffect(() => {

    //     // user doesn't have to be authenticated to access some pages
    //     if (!excludedPaths.includes(location.pathname)) {
            
    //         // check if user is authenticated
    //         checkAuthentication();
    //         const token = userService.decodeToken(localStorage.getItem('jwt_token'));
            
    //     }
    //     else {
    //         setIsLoading(false);
    //     }

    // },  [location.pathname]);

    // // Show a loading state until auth status is determined
    // if (isLoading) {
    //     return <div>Loading...</div>; 
    // }

    return(
        // all app routes
        <Routes>
            <Route exact path='/' element={<MapPage/>} ></Route>
            <Route exact path='/Vessels/*' element={<VesselsPage/>}></Route>
            <Route exact path='/Ports/*' element={<PortsPage/>}></Route>
            <Route exact path='/MyAccount/*' element={<MyAccountPage/>}></Route>
            <Route exact path='/Settings' element={<SettingsPage/>}></Route>
            <Route exact path='/Help/*' element={<HelpPage/>}></Route>
            <Route exact path='/SignIn' element={<SignInPage/>}></Route>
            <Route exact path='/Register' element={<RegisterPage/>}></Route>
            <Route exact path='/Admin/*' element={<AdminPage/>}></Route>
            {/* <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}> */}
                {/* add paths when jwt is set up */}
            {/* </Route> */}
        </Routes>
    );
}

export default Main;