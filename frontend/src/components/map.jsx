import React, { useState } from "react";
import { MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/map.css';
import { useMap } from "react-leaflet";
import select from '../icons/Buttons/Select-Area.png';
import NavigationBar from "./navigationBar";
import SearchBar from "./searchBar";
import Filters from "./filters";
import '../styles/toggle.css'
import light from '../icons/Buttons/Light-outlined.png'
import dark from '../icons/Buttons/Dark-outlined.png'
import { useEffect } from "react";


function ToggleDisplayMode({setDarkMode,darkMode}) {
    

    return (
        <div className="toggle">
           <button className={darkMode ? 'inactive-light' : 'active-light'}  onClick={() => setDarkMode(false)}>
                <img src={light} alt="light mode"/>
           </button>
           
           <button className={darkMode ? 'active-dark' : 'inactive-dark'}  onClick={() => setDarkMode(true)}>
                <img src={dark} alt="dark mode"/>
           </button>
        
        </div>        
    )


}





function MapButtons({ map, setDarkMode, darkMode, isRegistered }) {
    return (
      <div className="map_buttons">
        <ToggleDisplayMode setDarkMode={setDarkMode} darkMode={darkMode} />
  
        <Filters map={map} />
  
        <div className="zoom_buttons">
          <button
            onClick={() => map.zoomIn()}
            className="zoom_button"
            style={{ borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}
          >
            +
          </button>
          <button
            onClick={() => map.zoomOut()}
            className="zoom_button"
            style={{ borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }}
          >
            −
          </button>
        </div>
  
        {isRegistered && (
          <button className="select_area">
            <img src={select} alt="select area" />
            <p>Select Area</p>
          </button>
        )}
      </div>
    );
  }



function MapFunctions({map,setDarkMode,darkMode,isRegistered,isAdmin}) {


    return(  
        <div className="map_functions">
            <NavigationBar isRegistered={isRegistered} isAdmin={isAdmin} currentTab="Live Map"/>  
            <SearchBar map = {map}/>
            <MapButtons map = {map} setDarkMode={setDarkMode} darkMode={darkMode} isRegistered={isRegistered}/>  
        </div> 
    );
}

function MapWrapper({setDarkMode,darkMode,isRegistered,isAdmin}) {
    const map = useMap();
    return <MapFunctions map={map} setDarkMode={setDarkMode}  darkMode={darkMode} isRegistered = {isRegistered} isAdmin= {isAdmin} />;
}


function Map() {

    const lightmodeUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";  

    const [darkMode, setDarkMode] = useState(false);

    const [liveVessels,setLiveVessels] = useState([]);
    const [ws, setWs] = useState(null);


    useEffect(() => {
            const websocket = new WebSocket('ws://localhost:8080/ws');
            setWs(websocket);

            websocket.onopen = () => console.log('Connected to WebSocket server');
            websocket.onmessage = (event) => {
            setLiveVessels((vessels) => [...vessels, event.data]);};
            websocket.onclose = () => console.log('Disconnected from WebSocket server');
            console.log(liveVessels)

            // Cleanup on unmount
            return () => websocket.close();
    }, []);

    return (
        <div className={`map ${darkMode ? 'dark' : ''}`}>
        <MapContainer
                center={[50, 0]}
                zoom={2}
                attributionControl={false}
                closePopupOnClick={false}
                zoomAnimation={true}
                maxBounds={[[-85.0511, -180], [85.0511, 180]]}
                maxBoundsViscosity={1.0}
                scrollWheelZoom={true}
                dragging={true}
                zoomControl={false}
        >
            <TileLayer
                url={lightmodeUrl}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                subdomains="abcd"
                minZoom={2}
                maxZoom={12}
            />
            {/* Change isRegistered to true if we need to see the user's abilities */}
            <MapWrapper setDarkMode={setDarkMode} darkMode={darkMode} isRegistered={false} isAdmin={false}/>
        </MapContainer>
        </div>
    );
}




export default Map;