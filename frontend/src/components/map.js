import React from "react";
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/map.css';
import { useMap } from "react-leaflet";
import ReactDOM from "react-dom";


function MapButtons() {



    const map = useMap();


      

    return ReactDOM.createPortal(
          <div className="map_buttons">
                
                <div className="zoom_buttons">
                        <button onClick={() => map.zoomIn()} className="zoom_button">+</button>
                        <button onClick={() => map.zoomOut()} className="zoom_button">−</button>
                </div>

                <div className="select_area">

                </div>

        </div>,
        document.getElementById("map-overlay")
    );  
     
}

function Map({ darkmode }) {



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
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            minZoom={2}
            maxZoom={12}
        />

        <MapButtons/>



        </MapContainer>
    </div>
    );
}







export default Map;