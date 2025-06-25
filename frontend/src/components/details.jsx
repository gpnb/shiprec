import React from "react";
import { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Details({ type }) {

    const { id } = useParams();  // Gets the ID from the URL
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

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
        <div className="itemlists-container">
            <div className="itemlists-card">
            <h2>{type} Details</h2>
            <ul>
                {Object.entries(data).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {String(value)}</li>
                ))}
            </ul>
            </div>
        </div>
    )
}

export default Details;