import React, { useState } from "react";
import { MapContainer, TileLayer,Marker,Popup} from 'react-leaflet';
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

import cargo from '../icons/ships/cargo.png'
import fishing from '../icons/ships/fishing.png'
import navigation from '../icons/ships/navigation.png'
import other from '../icons/ships/other.png'
import passenger from '../icons/ships/passenger.png'
import pleasure from '../icons/ships/pleasure.png'
import speed from '../icons/ships/speed.png'
import tugs from '../icons/ships/tugs.png'
import tankers from '../icons/ships/tankers.png'
import ship from '../icons/ships/cargo.png'
import L from 'leaflet';
import logo from '../icons/Logo/ShipRec.png'

function ToggleDisplayMode({setDarkMode,darkMode}) {
    

    return (
        <div className="toggle">
           <button className={darkMode ? 'inactive-light' : 'active-light dark-zoom'}  onClick={() => setDarkMode(false)}>
                <img src={light} alt="light mode" className={`${darkMode ? '' : 'dark-zoom'}`}/>
           </button>
           
           <button className={darkMode ? 'active-dark dark-zoom' : 'inactive-dark'}  onClick={() => setDarkMode(true)}>
                <img src={dark} alt="dark mode" className={`${darkMode ? 'dark-zoom' : ''}`}/>
           </button>
        
        </div>        
    )


}





function MapButtons({ map, setDarkMode, darkMode, isRegistered }) {
    return (
      <div className="map_buttons">
        <ToggleDisplayMode setDarkMode={setDarkMode} darkMode={darkMode} />
  
        <Filters map={map} darkMode={darkMode}/>
  
        <div className="zoom_buttons">
          <button
            onClick={() => map.zoomIn()}
            className={`zoom_button ${darkMode ? 'dark-zoom' : ''}`}
            style={{ borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}
          >
            +
          </button>
          <button
            onClick={() => map.zoomOut()}
            className={`zoom_button ${darkMode ? 'dark-zoom' : ''}`}
            style={{ borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }}
          >
            −
          </button>
        </div>
  
        {isRegistered && (
          <button className={`select_area ${darkMode ? 'dark-zoom' : ''}`}>
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
            <SearchBar map = {map} isRegistered={isRegistered} darkMode={darkMode}/>
            <MapButtons map = {map} setDarkMode={setDarkMode} darkMode={darkMode} isRegistered={isRegistered}/>  
        </div> 
    );
}

function MapWrapper({setDarkMode,darkMode,isRegistered,isAdmin}) {
    const map = useMap();
    return <MapFunctions map={map} setDarkMode={setDarkMode}  darkMode={darkMode} isRegistered = {isRegistered} isAdmin= {isAdmin} />;
}

export function getShipIconByType(type = '') {
  const normalized = type.toLowerCase();

  if (normalized.includes('cargo')) return cargo;
  if (normalized.includes('fishing')) return fishing;
  if (normalized.includes('navigation') || normalized.includes('nav')) return navigation;
  if (normalized.includes('passenger')) return passenger;
  if (normalized.includes('pleasure') || normalized.includes('yacht') || normalized.includes('recreational')) return pleasure;
  if (normalized.includes('speed') || normalized.includes('fast')) return speed;
  if (normalized.includes('tug')) return tugs;
  if (normalized.includes('tanker')) return tankers;
  return other;
}


function Map() {

    {/* Change isRegistered to true if we need to see the user's abilities */}
    const isRegistered = true;
    const isAdmin = false;

    const lightmodeUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";  

    const [darkMode, setDarkMode] = useState(false);

    const [liveVessels,setLiveVessels] = useState([]);

    const fakeVessel = {
      ship_name: "Happy Birthday Ntina",
      latitude: 37.86375081807442,             
      longitude: 23.749947150715165,
      heading: 120,
      course_over_ground: 0.2,
      speed_over_ground: 0.2,
      ship_type: "tanker",
      imonumber: "21062003",
      navigational_status: "Hating Frontend",
      draught: 7.8,
      destination: "Port of •(-*•",
      timestamp: "2025-06-21 00:01 UTC"
    };


    const [ws, setWs] = useState(null);

    useEffect(() => {
      if (!ws) {
        setLiveVessels({
          [fakeVessel.imonumber]: fakeVessel
        });
      }
    }, [ws]);

    useEffect(() => {
      const websocket = new WebSocket('ws://localhost:8080/ws');
      setWs(websocket);

      websocket.onopen = () => console.log('Connected to WebSocket server');
      websocket.onmessage = (event) => {
          try {
              const data = JSON.parse(event.data);

              const lat = Number(data.latitude);
              const lon = Number(data.longitude);

              if (!isNaN(lat) && !isNaN(lon)) {
              const id = data.imonumber || data.ship_name || crypto.randomUUID();

              setLiveVessels((prev) => {
                  const existing = prev[id];

                  // Check if location changed
                  const hasMoved = !existing || existing.latitude !== lat || existing.longitude !== lon;

                  if (!hasMoved) return prev; // Skip update if position didn't change

                  return {
                  ...prev,
                  [id]: {
                      ...data,
                      latitude: lat,
                      longitude: lon,
                  }
                  };
              });
              }
          } 
          catch (error) {
              console.error("Failed to parse message:", event.data);
          }
      };

        // Cleanup on unmount
        return () => websocket.close();
    }, []);
    
    const shipIcon = L.icon({
        iconUrl: ship,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });

function getRotatedShipIcon(heading, imageUrl, size = [40, 40], classList = '') {
  return L.divIcon({
    className: '', // prevent Leaflet default class
    html: `
      <div class="filter-icon ${classList}" style="
        transform: rotate(${heading}deg);
        width: ${size[0]}px;
        height: ${size[1]}px;
        background-image: url(${imageUrl});
        background-size: contain;
        background-repeat: no-repeat;
      "></div>
    `,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
  });
}


    function getBackgroundColorByShipType(type = '') {
      const normalized = type.toLowerCase();
      if (normalized.includes('cargo')) return '#C00000';
      if (normalized.includes('fishing')) return '#72D2FF';
      if (normalized.includes('navigation') || normalized.includes('nav')) return '#FF9500';
      if (normalized.includes('passenger')) return '#EDBE00';
      if (normalized.includes('pleasure') || normalized.includes('yacht') || normalized.includes('recreational')) return '#F58DAB';
      if (normalized.includes('speed') || normalized.includes('fast')) return '#50378F';
      if (normalized.includes('tug')) return '#1BAF40';
      if (normalized.includes('tanker')) return '#0064D0';
      return '#D9D9D9'; // default
    }


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


              {Object.values(liveVessels).map((vessel) => (
                    <Marker key={vessel.ship_name} position={[vessel.latitude, vessel.longitude]}   icon={getRotatedShipIcon(
                      vessel.heading || 0,
                      getShipIconByType(vessel.ship_type),
                      [40, 40],
                      darkMode ? 'dark-filter-icon' : '')}>
                        <Popup className="vessel_popup" autoPan={false} offset={0}>
                            <div className="popup_header">
                                <div className="popup_header_2"  style={{backgroundColor: getBackgroundColorByShipType(vessel.ship_type)}} >
                                <img src={logo} alt="logo" />
                                </div>

                                  <div className="popup_title">
                                    <div className="vessel_name">{vessel.ship_name || "Unknown"}</div>
                                    <div className="meta_data">
                                      <div className="meta_line"><strong>IMO:</strong> {vessel.imonumber || "N/A"}</div>
                                      <div className="meta_line"><strong>Type:</strong> {vessel.ship_type || "N/A"}</div>
                                    </div>
                                  </div>
                            </div>
                                  <div className="popup_header_info">
                                    
                                      <div className="vessel_meta">
                                          
                                        <div className="meta_line_2"><strong>Status:</strong> {vessel.navigational_status || "N/A"}</div>
                                        <div className="meta_line_2"><strong>Speed:</strong> {vessel.speed_over_ground} knots</div>
                                            
                                            
                                        <div className="meta_line_2"><strong>Course:</strong> {vessel.course_over_ground}°</div>
                                        <div className="meta_line_2"><strong>Heading:</strong> {vessel.heading}°</div>
                                            
                                            
                                        <div className="meta_line_2"><strong>Draught:</strong> {vessel.draught >= 0 ? vessel.draught + " m" : "N/A"}</div>
                                        <div className="meta_line_2"><strong>Destination:</strong> {vessel.destination || "Unknown"}</div>
                                        <div className="meta_line_3"><strong>Received:</strong> {vessel.timestamp || "No Time"}</div>
                                      </div>
                                      
                                    </div>
                            
                                <div className="popup_buttons">
                                  <button className="view_button">
                                    <div>Vessel Details</div>
                                  </button>

                                  {isRegistered && (
                                    <button className="add_fleet">
                                      <div>Add to Fleet</div>
                                    </button>
                                  )}
                                </div>

                        </Popup>
                    </Marker>
            ))}


            <MapWrapper setDarkMode={setDarkMode} darkMode={darkMode} isRegistered={isRegistered} isAdmin={isAdmin}/>

        </MapContainer>
        </div>
    );
}




export default Map;