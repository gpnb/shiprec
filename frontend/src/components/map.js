import React, { useState } from "react";
import { MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/map.css';
import { useMap } from "react-leaflet";
import select from '../icons/select.png';
import NavigationBar from "./navigationBar";
import SearchBar from "./searchBar";
import Filters from "./filters";

function MapButtons({map,setMapFilters}) {



    return (
          <div className="map_buttons">

                <div className="display_mode">
                   
                </div>

                <Filters map = {map} setMapFilters={setMapFilters}/>

                
                <div className="zoom_buttons">
                        <button onClick={() => map.zoomIn()} className="zoom_button" style={{borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>+</button>
                        <button onClick={() => map.zoomOut()} className="zoom_button"  style={{borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px"}}>−</button>
                </div>

                <button  className="select_area">
                    <img src= {select} alt = 'select area'/>
                    <p> Select Area </p>
                </button>    
                

        </div>
    );  
     
}



function MapFunctions({map}) {


    return(  
        <div className="map_functions">
            <NavigationBar/>  
            <SearchBar map = {map}/>
            <MapButtons map = {map}/>  
        </div> 
    );
}

function MapWrapper() {
    const map = useMap();
    return <MapFunctions map={map} />;
}


function Map() {

    const darkmodeUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";           // it's black :(
    const lightmodeUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";  
    
    const [darkMode,setDarkMode] = useState(false);


    return (
    <div className="map">
        <MapContainer
            center={[50, 0]}    // puts the user at the center of the map when the page loads
            zoom={2}            // default zoom
            attributionControl={false} // hides the attribution credits
            closePopupOnClick={false}   // a popup won't close when the user clicks out of it
            zoomAnimation={true}    // zoom animation is enabled
            maxBounds={[[-85.0511, -180], [85.0511, 180]]}  // set the world bounds 
            maxBoundsViscosity={1.0}    
            scrollWheelZoom={true}  // enable scrolling
            dragging={true} // and dragging
            zoomControl={false}
        >

        <TileLayer
            url= {darkMode ? darkmodeUrl : lightmodeUrl}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            minZoom={2}
            maxZoom={12}
        />

        <MapWrapper/>
        </MapContainer>
    </div>
    );
}




export default Map;