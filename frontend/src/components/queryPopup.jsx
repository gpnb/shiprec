import React from "react";
import "../styles/popups.css";

function QueryPopup({ queryText, onClose }) {
    return (
        <div className="popup-background">
            <div className="popup">
                <h3 className="popup-heading">View Query</h3>

                <div className="query-message">
                    {queryText}
                </div>

                <div className="popup-buttons">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default QueryPopup;
