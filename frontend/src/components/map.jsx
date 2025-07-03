import React, { useState } from "react";
import { MapContainer, TileLayer,Marker,Popup} from 'react-leaflet';
import AreaSelector from './areaSelector';
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
import { useNavigate } from 'react-router-dom';
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
import logo_port from '../icons/Logo/PortRec.png'
import portIcon from '../icons/ships/port.png'

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





function MapButtons({ map, setDarkMode, darkMode, isRegistered,activeFilters,setActiveFilters, drawMode, setDrawMode, confirmMode, setConfirmMode, selectionPixels, setSelectionPixels, setSelectionBounds}) {
    return (
      <div className="map_buttons">
        <ToggleDisplayMode setDarkMode={setDarkMode} darkMode={darkMode} />
  
        <Filters map={map} darkMode={darkMode} activeFilters={activeFilters}  setActiveFilters={setActiveFilters}/>
  
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
          <button
            onClick={() => { 
              // enter draw mode and immediately wipe last selection
               setSelectionPixels(null);
               setSelectionBounds(null);
               setConfirmMode(false);
               setDrawMode(true);
            }}
            className={`select_area ${darkMode ? 'dark-zoom' : ''}`}
          >
            <img src={select} alt="select area" />
            <p>Select Area</p>
          </button>
        )}
      </div>
    );
}



function MapFunctions({map,setDarkMode,darkMode,isRegistered,isAdmin,activeFilters,setActiveFilters,liveVessels,drawMode, setDrawMode, confirmMode, setConfirmMode, selectionPixels, setSelectionPixels, selectionBounds, setSelectionBounds}) {

    return(  
        <div className="map_functions">
            <NavigationBar isRegistered={isRegistered} isAdmin={isAdmin} currentTab="Live Map"/>  
            <SearchBar map = {map} isRegistered={isRegistered} darkMode={darkMode} liveVessels={liveVessels}/>
            <MapButtons map = {map} setDarkMode={setDarkMode} darkMode={darkMode} isRegistered={isRegistered} activeFilters={activeFilters} setActiveFilters={setActiveFilters} drawMode={drawMode} setDrawMode={setDrawMode} confirmMode={confirmMode} setConfirmMode={setConfirmMode} selectionPixels={selectionPixels} setSelectionPixels={setSelectionPixels} setSelectionBounds={setSelectionBounds}/>
        </div> 
    );
}

function MapWrapper({setDarkMode,darkMode,isRegistered,isAdmin,activeFilters,setActiveFilters, drawMode, setDrawMode, confirmMode, setConfirmMode, selectionPixels, setSelectionPixels, selectionBounds, setSelectionBounds}) {
    const map = useMap();

    // Disable map panning while drawing or confirming; re-enable otherwise
    useEffect(() => {
      if (drawMode || confirmMode) {
        map.dragging.disable();
        map.boxZoom.disable();
      } else {
        map.dragging.enable();
        map.boxZoom.enable();
      }
    }, [map, drawMode, confirmMode]);

    return <MapFunctions map={map} setDarkMode={setDarkMode} darkMode={darkMode} isRegistered={isRegistered} isAdmin={isAdmin} activeFilters={activeFilters}  setActiveFilters={setActiveFilters} drawMode={drawMode} setDrawMode={setDrawMode} confirmMode={confirmMode} setConfirmMode={setConfirmMode} selectionBounds={selectionBounds} setSelectionBounds={setSelectionBounds} selectionPixels={selectionPixels} setSelectionPixels={setSelectionPixels}/>;
}

function getShipIconByType(type = '') {
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

function getShipType(type = '') {
  const normalized = type.toLowerCase();

  if (normalized.includes('cargo')) return "Cargo";
  if (normalized.includes('fishing')) return "Fishing";
  if (normalized.includes('navigation') || normalized.includes('nav')) return "Navigation Aid";
  if (normalized.includes('passenger')) return "Passenger";
  if (normalized.includes('pleasure') || normalized.includes('yacht') || normalized.includes('recreational')) return "Pleasure";
  if (normalized.includes('speed') || normalized.includes('fast')) return "High Speed";
  if (normalized.includes('tug')) return "Tug/Special";
  if (normalized.includes('tanker')) return "Tanker";
  return "Other";
}


function Map() {

    {/* Change isRegistered to true if we need to see the user's abilities */}
    let isRegistered = false;
    // wrapped in try-catch in case retrieval of user fails
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      isRegistered = currentUser?.isRegistered === true;
    } catch (err) {
      console.error("Couldn't get user from localStorage : ", err);
    }

    const isAdmin = false;

    const lightmodeUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";  

    const [drawMode,    setDrawMode]    = useState(false);    // true while mouse is down → up
    
    const [confirmMode, setConfirmMode] = useState(false);    // true after rectangle is done, until user Confirm/Cancel

    const [selectionPixels, setSelectionPixels] = useState(null);
    
    const [selectionBounds, setSelectionBounds] = useState(null);
    
    const [darkMode, setDarkMode] = useState(false);

    const [liveVessels,setLiveVessels] = useState([]);

    const [activeFilters, setActiveFilters] = useState([
      'cargo',
      'fishing',
      'navigation',
      'passenger',
      'other',
      'pleasure',
      'speed',
      'tugs',
      'tankers'
    ]);

    const navigate = useNavigate();

    const fakeVessel = {
      mmsi: 12930812,
      ship_name: "Test Vessel",
      latitude: 37.86375081807442,             
      longitude: 23.749947150715165,
      heading: 21,
      course_over_ground: 0.2,
      speed_over_ground: 0.2,
      ship_type: "speed",
      imonumber: "21062003",
      navigational_status: "template status",
      draught: 7.8,
      destination: "Port of testing",
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
        const websocket = new WebSocket('wss://localhost:8080/ws');

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

      const [ports, setPorts] = useState(null);
      const [error, setError] = useState(null);
  
      useEffect(() => {
        const fetchPorts = async () => {
            try {
                const res = await fetch(`https://localhost:8080/api/ports/all`);
                if (!res.ok) throw new Error("Failed to fetch Ports");
                const result = await res.json();
                setPorts(result);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };
    
        fetchPorts();
    }, []);
    
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
        
        return '#D9D9D9'; 
    }

    function renderFilters(type) {


        const normalized = type?.toLowerCase();
         
        if (normalized.includes('cargo')) return 'cargo';
        if (normalized.includes('fishing')) return 'fishing';
        if (normalized.includes('navigation') || normalized.includes('nav')) return 'navigation';
        if (normalized.includes('passenger')) return 'passenger';
        if (normalized.includes('pleasure') || normalized.includes('yacht') || normalized.includes('recreational')) return 'pleasure';
        if (normalized.includes('speed') || normalized.includes('fast')) return 'speed';
        if (normalized.includes('tug')) return 'tugs';
        if (normalized.includes('tanker')) return 'tankers';


        return 'other';

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


          {Array.isArray(ports) &&
            ports
              .filter(port => activeFilters.includes('all') || activeFilters.includes('ports'))
              .map(port => (
                <Marker
                  key={port.id}
                  position={[port.latitude, port.longitude]}
                  style={{zIndex: 10001}}
                  icon={getRotatedShipIcon(
                    0,
                    portIcon,
                    [20, 20],
                    darkMode ? 'dark-filter-portIcon' : ''
                  )}
                >
                  <Popup className="port_popup" autoPan={false} offset={0}>
                    <div className="popup_header">
                      <div className="popup_header_2" style={{ backgroundColor: '#ab3b4c' }}>
                        <img src={logo_port} alt="port" style={{ transform: 'translateY(3px)' }}/>
                      </div>
                      <div className="popup_title">
                        <div className="vessel_name">{port.port || "Unnamed Port"}</div>
                        <div className="meta_data">
                          <div className="meta_line"><strong>WPI:</strong> {port.wpi || "N/A"}</div>
                          <div className="meta_line" style={{ color: '#ab3b4c', filter: 'brightness(0.65)'}}><strong>Country:</strong> {port.country || "N/A"}</div>
                        </div>
                      </div>
                    </div>

                    <div className="popup_header_info_port">
                      <div className="vessel_meta">
                        <div className="meta_line_2"><strong>• Port Type:</strong> {port.type}</div>
                        <div className="meta_line_2"><strong>• Port Size:</strong> {port.size}</div>
                        <div className="meta_line_2"><strong>• Tidal Range:</strong> {port.tidal_range  >= 0 ? port.tidal_range + " m" : "N/A"}</div>
                        <div className="meta_line_2"><strong>• Entrance Width:</strong> {port.entrance_width  >= 0 ? port.entrance_width + " m" : "N/A"}</div>
                        <div className="meta_line_2"><strong>• Channel Depth:</strong> {port.channel_depth  >= 0 ? port.channel_depth + " m" : "N/A"}</div>
                        <div className="meta_line_2"><strong>• Latitude:</strong> {port.latitude || "N/A"}</div>
                        <div className="meta_line_2"><strong>• Longitude:</strong> {port.longitude || "N/A"}</div>
                      </div>
                    </div>

                    <div className="popup_buttons">
                        <button className="view_button" style={{ transform: 'translateX(16px)' }}>
                          <div style={{ transform: 'translateY(1px)' }} onClick={() => navigate(`/Ports/${port.wpi}`)}>Port Details</div>
                          
                        </button>
                    </div>
                  </Popup>
                </Marker>
              ))}



              {Object.values(liveVessels).filter(vessel => activeFilters.includes('all') || activeFilters.includes(renderFilters(vessel.ship_type)))
              .map((vessel) => (
                    <Marker key={vessel.ship_name} style={{zIndex: 10004}} position={[vessel.latitude, vessel.longitude]}   icon={getRotatedShipIcon(
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
                                      <div className="meta_line"><strong>MSSI:</strong> {vessel.mmsi|| "N/A"}</div>
                                      <div className="meta_line" style={{ color: getBackgroundColorByShipType(vessel.ship_type), filter: 'brightness(0.65)'}} ><strong>Type:</strong> {getShipType(vessel.ship_type) || "N/A"}</div>
                                    </div>
                                  </div>
                            </div>
                                  <div className="popup_header_info">
                                    
                                      <div className="vessel_meta">
                                        
                                        <div className="meta_line_2"><strong>• IMO:</strong> {vessel.imonumber|| "N/A"}</div>
                                        <div className="meta_line_2"><strong>• Status:</strong> {vessel.navigational_status || "N/A"}</div>
                                        <div className="meta_line_2"><strong>• Speed:</strong> {vessel.speed_over_ground} knots</div>
                                            
                                            
                                        <div className="meta_line_2"><strong>• Course:</strong> {vessel.course_over_ground}°</div>
                                        <div className="meta_line_2"><strong>• Heading:</strong> {vessel.heading}°</div>
                                            
                                            
                                        <div className="meta_line_2"><strong>• Draught:</strong> {vessel.draught >= 0 ? vessel.draught + " m" : "N/A"}</div>
                                        <div className="meta_line_2"><strong>• Destination:</strong> {vessel.destination || "Unknown"}</div>
                                        <div className="meta_line_3"><strong>Received:</strong> {vessel.time_received? new Date(vessel.time_received).toLocaleString(): 'No Time'}</div>
                                      </div>
                                      
                                    </div>
                            
                                <div className="popup_buttons">
                                  <button className="view_button" onClick={() => navigate(`/Vessels/${vessel.mmsi}`)}>
                                  <div style={{ transform: 'translateY(1px)' }}>Vessel Details</div>
                                  </button>

                                  {isRegistered && (
                                    <button className="add_fleet">
                                      <div style={{ transform: 'translateY(1px)' }}>Add to Fleet</div>
                                    </button>
                                  )}
                                </div>

                        </Popup>
                    </Marker>
            ))}


            <MapWrapper setDarkMode={setDarkMode} darkMode={darkMode} isRegistered={isRegistered} isAdmin={isAdmin} activeFilters={activeFilters} setActiveFilters={setActiveFilters} drawMode={drawMode} setDrawMode={setDrawMode} confirmMode={confirmMode} setConfirmMode={setConfirmMode} selectionPixels={selectionPixels} setSelectionPixels={setSelectionPixels} selectionBounds={selectionBounds} setSelectionBounds={setSelectionBounds}/>

            {(drawMode || confirmMode) && (
              <div className="selection-ui" onMouseDown={e => e.stopPropagation()} onMouseUp={e => e.stopPropagation()} onMouseMove={e => e.stopPropagation()}>
                <div className="message">Click & drag to draw your area</div>
                <div className="btn-row">
                  <button
                    onClick={() => {
                      setDrawMode(false);
                      setConfirmMode(false);
                      setSelectionPixels(null);
                      setSelectionBounds(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Only confirm if selectionPixels is a real rectangle
                      if (
                        !selectionPixels ||
                        selectionPixels.width < 5 ||
                        selectionPixels.height < 5
                      ) {
                        alert("Please draw a bigger area first.");
                        // stay in drawMode, keep selectionPixels alive so that next mousedown wipes it:
                        setConfirmMode(false);
                        setDrawMode(true);
                        return;
                      }
                      console.log("Area confirmed:", selectionBounds);
                      // TODO: send selectionBounds to backend
                      // now clear everything
                      setSelectionPixels(null);
                      setSelectionBounds(null);
                      setDrawMode(false);
                      setConfirmMode(false);
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {(drawMode || confirmMode) && (
              <AreaSelector drawMode={drawMode} confirmMode={confirmMode} setDrawMode={setDrawMode} setConfirmMode={setConfirmMode} selectionPixels={selectionPixels} setSelectionPixels={setSelectionPixels} selectionBounds={selectionBounds} setSelectionBounds={setSelectionBounds}/>
            )}


        </MapContainer>
        </div>
    );
}


export default Map;
