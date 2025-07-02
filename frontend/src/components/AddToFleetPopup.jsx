import React from 'react'
import { useEffect, useState } from 'react'
import Select from "react-select";
import "../styles/popups.css"


function AddToFleetPopup(props) {

    const [user, setUser] = useState(null);
    const [data, setData] = useState([]);
    const [ready, setReady] = useState(false);
    const [totalItems, setTotalItems] = useState(0);

    // select fields
    const [selectedFleet, setSelectedFleet] = useState(null);
    const fleetOptions = data.map((fleet) => ({
        label: fleet.fleetName,
        value: fleet.id,
    }))

    useEffect(() => {
        const currentUser = localStorage.getItem('user');
            
        if (currentUser) {
            setUser(JSON.parse(currentUser));
        }
    }, []);
        

    useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch(`https://localhost:8080/api/fleets/list/${user.id}`);
                    const result = await response.json();
                    
                    setData(result.content || []);
                    setTotalItems(result.totalElements || 0);
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setReady(true);
                    console.log(data);
                }

            };
        
            fetchData();
    }, [user]);

    const [createData, setCreateData] = useState({
        id: 0,
        name: "",
        userId: "",
        vesselIds: [],
    });


    const handleChange = (e) => {

        setSelectedFleet(e);
        console.log(e);

        setCreateData((prev) => ({
            ...prev,
            id: e.value,
            name: e.label,
            userId: user.id,
            vesselIds: props.list,
        }));

        console.log(createData);
    }

    const resetData = () => {
        setCreateData((prev) => ({
            ...prev,
            id: 0,
            name: "",
            userId: "",
            vesselIds: [],
            selectedFleet: null,
        }));
    }


    const handleAdd = async(e) => {

        try {
            const fetchResult = await fetch("https://localhost:8080/api/fleets/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(createData),
            });

            const result = await fetchResult;

            if (fetchResult.ok) {
                alert("added");
            }
            else {
                alert("error");
            }
            resetData();
            props.setTrigger(false)
        } catch(err) {
            alert("error");
        }
    }

    if (!ready) return <p>loading</p>

    return (props.trigger) ? (
        <div className="popup-background">
            <div className="popup">
                <h3 className="popup-heading">Select your Fleet</h3>

                <form className="popup-form">
                    <lable className="popup-lable">Fleets</lable>
                    <Select 
                        id="fleet"
                        options={fleetOptions}
                        onChange={handleChange}
                        placeholder="Choose your fleet..."
                        className="popup-select"
                        classNamePrefix="rs"
                    />
                </form>
                <br/>
                <br/>
                <div className="popup-buttons">
                    <button onClick={() => props.setTrigger(false)}>Cancel</button>
                    <button onClick={handleAdd}>Add to Fleet</button>
                </div>
            </div>
        </div>
    ) : "";
}

export default AddToFleetPopup