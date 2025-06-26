import React from "react";
import { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/details.css'
import port from '../icons/Logo/PortRec.png'
import ship from '../icons/Logo/Ship.png'

function Details({ type }) {

    const { id } = useParams();  // Gets the ID from the URL
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const excludedKeys = ['port', 'type','shiptype','wpi','mmsi','name']; // Add any keys you want to skip

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/${type.toLowerCase()}/${id}`);
                if (!res.ok) throw new Error("Failed to fetch details");
                const result = await res.json();
                setData(result);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        fetchDetails();
    }, [type, id]);


    if (error) return <div>Error: {error}</div>;
    if (!data) return <div>Loading...</div>;


    return (

        <div className="itemdetails-container">
            <div className="itemdetails-card">
                <div className="itemdetails-header">
                {data && type === 'Vessels' && (
                    <div className="itemdetails">
                        {/* Vessel-specific data */}
                        <img src={ship} alt="ship" style={{transform: "rotate(18deg) translateX(-3px) translateY(-5px)"}}/>
                        <div className="itemdetails-name">{data.name || "N/A"}</div>
                        
                        <div className="itemdetails-subname">
                         {data.shiptype || "N/A"}
                        </div>
                        
                        <div className="itemdetails-subname">
                        <strong>, MMSI:</strong> {data.mmsi || "N/A"}
                        </div>

                    </div>
                    )}

                    {data && type === 'Ports' && (
                    <div className="itemdetails">
                        <img src={port} alt="port" style={{transform: "rotate(23deg) translateX(-10px)"}}/>
                        <div className="itemdetails-name">{data.port || "N/A"}</div>
                        
                        <div className="itemdetails-subname">
                         {data.type || "N/A"}
                        </div>
                        
                        <div className="itemdetails-subname">
                        <strong>, WPI:</strong> {data.wpi || "N/A"}
                        </div>
                    </div>
                    )}
                </div>
                <div className="itemdetails-table">
                    <table>
                        <tbody>
                        {Object.entries(data)
                            .filter(([key]) => !excludedKeys.includes(key))
                            .map(([key, value]) => (
                            <tr key={key}>
                                <td className="label-cell">
                                <strong>
                                    {key
                                    .split('_')
                                    .map((part) =>
                                        (part === "wpi" || part === "mmsi") && part === part.toLowerCase()
                                        ? part.toUpperCase()
                                        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                                    )
                                    .join(' ')}
                                    :
                                </strong>
                                </td>
                                <td className="value-cell">{String(value)}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Details;