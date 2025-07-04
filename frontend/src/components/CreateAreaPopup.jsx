import React, { useEffect, useState } from "react";
import "../styles/popups.css";

export default function CreateAreaPopup({ trigger, setTrigger, bounds, onSuccess }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

  // load current user
  useEffect(() => {
    const current = localStorage.getItem("user");
    if (current) setUser(JSON.parse(current));
  }, []);

  // if popup is not triggered, render nothing
  if (!trigger) return null;

  const handleCreate = async (e) => {
    e.preventDefault();

    // validate bounds
    if (!bounds?.southWest || !bounds?.northEast) {
      alert("No valid rectangle to save.");
      return;
    }
    // validate name
    if (!name.trim()) {
      alert("Please enter an area name.");
      return;
    }

    // build payload
    const payload = {
      userId: user?.id,
      name: name.trim(),
      southWestLat: bounds.southWest.lat,
      southWestLng: bounds.southWest.lng,
      northEastLat: bounds.northEast.lat,
      northEastLng: bounds.northEast.lng,
    };

    try {
      const resp = await fetch("https://localhost:8080/api/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        if (resp.status === 409 || text.includes("duplicate")) {
          throw new Error("duplicate");
        }
        throw new Error(text || resp.statusText);
      }

      // success!
      alert("Area saved.");
      onSuccess();          // clear map selection
      setTrigger(false);    // close popup
    } catch (err) {
      if (err.message === "duplicate") {
        alert("An area with this name already exists.");
      } else {
        console.error(err);
        alert("Could not save area, see console.");
      }
    }
  };

  return (
    <div className="popup-background">
      <div className="popup">
        <h3 className="popup-heading">Create New Area</h3>

        <div className="popup-field">
          <label className="popup-label">Area Name</label>
          <input
            type="text"
            placeholder="Enter an Area Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="popup-buttons">
          <button onClick={() => setTrigger(false)}>Cancel</button>
          <button onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>
  );
}