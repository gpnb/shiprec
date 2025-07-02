// This component takes arguments from the page calling it and handles the apropriate calls to the backend

import React from 'react'
import { useEffect, useState } from 'react'
import "../styles/popups.css"

function CreateFleetPopup(props) {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = localStorage.getItem('user');
            
        if (currentUser) {
            setUser(JSON.parse(currentUser));
        }
    }, []);

    const [createData, setCreateData] = useState({
        name: "",
        userId: "",
        vesselIds: [],
    });

    const handleChange = (e) => {
        e.preventDefault();

        setCreateData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
            userId: user.id,
            vesselIds: props.list,
        }));
    }

    const resetData = () => {
        setCreateData((prev) => ({
            ...prev,
            name: "",
        }));
    }


    const handleCreate = async(e) => {
        e.preventDefault();


        setCreateData((prev) => ({
            ...prev,
            vesselIds: [1, 2, 4],
        }));


        try {
            const fetchResult = await fetch("https://localhost:8080/api/fleets/create2", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(createData),
            });

            const result = await fetchResult;

            if (fetchResult.ok) {

                alert("Created fleet successfully.");
                resetData();
                props.setTrigger(false)
            }
            else {
                alert(`Error creating fleet: ${JSON.stringify(result)}`);
            }
        } catch(err) {
            alert("Failed to reach backend : " + err.message);
        }
    }


    return (props.trigger) ? (
        <div className="popup-background">

            <div className="popup">
                <h3 className="popup-heading">Create new Fleet</h3>

                <div className="popup-field">
                    <label className="popup-label">Fleet Name</label>
                    <input
                        type="name"
                        id="name"
                        placeholder="Enter your fleet name..."
                        value={createData.name}
                        onChange={handleChange}
                    />
                </div>
                <br></br>
                <div className="popup-buttons">
                    <button onClick={() => props.setTrigger(false)}>Cancel</button>
                    <button onClick={handleCreate}>Create</button>
                </div>
            </div>

            
        </div>
    ) : "";
}

export default CreateFleetPopup