import React from 'react';
import {Routes, Route,useLocation,useNavigate} from 'react-router-dom';
import { useState,useEffect } from 'react';
import MapPage from '../pages/mapPage';

const SERVER_URL = "https://localhost:8080";



const Main=()=>{



    return(
        // all app routes
        <Routes>
            <Route exact path='/' element={<MapPage/>} ></Route>
        </Routes>
    );
}

export default Main;