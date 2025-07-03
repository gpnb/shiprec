import React from "react";
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/myprofile.css'
import '../styles/lists.css'
import ListButtons from '../components/listbtn';
import dropdown from '../icons/Misc/Dropdown.png'
import trash from "../icons/Misc/trash.png";
import arrow from "../icons/Misc/Arrow.png"
import QueryPopup from "./queryPopup";

function AdminLists({ type }) {

    const navigate = useNavigate();

    const shipTypes = [
        "Other", "Cargo", "Tanker", "Passenger", "Fishing", "Pleasure", "Speed", 
        "Tug", "Navigation"
    ];

    const handleShipTypeChange = async (vesselId, newType) => {
        try {
            const response = await fetch(`https://localhost:8080/api/vessels/${vesselId}/type`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shipType: newType })
            });
    
            if (response.ok) {
                setData(prev =>
                    prev.map(row =>
                        row[idKey] === vesselId ? { ...row, shiptype: newType } : row
                    )
                );
            } else {
                console.error("Failed to update ShipType");
            }
        } catch (err) {
            console.error("Error updating ShipType:", err);
        }
    };

    const [data, setData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    const [selectedQuery, setSelectedQuery] = useState(null);

    const [isPageOpen, setIsPageOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(8); // default value

    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });

    const [currentPage, setCurrentPage] = useState(1);

    const [selectedItems, setSelectedItems] = useState([]); // manual selection
    const [deselectedItems, setDeselectedItems] = useState([]); // deselected while in global-select-all
    const [selectAll, setSelectAll] = useState(false); // global select-all mode


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://localhost:8080/api/${type.toLowerCase()}?page=${currentPage - 1}&size=${itemsPerPage}`);
                const result = await response.json();
    
                setData(result.content || []);
                setTotalItems(result.totalElements || 0);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, [type, currentPage, itemsPerPage]);


    const togglePage = () => {
        setIsPageOpen((prev) => !prev);
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const goNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const goPrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handlePerPageChange = (value) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
        setIsPageOpen(false);
    };


    const handleSort = (key) => {
        setSortConfig((prevConfig) => {
            if (prevConfig.key === key) {
                // Toggle direction
                return {
                    key,
                    direction: prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
                };
            } else {
                // New sort key
                return {
                    key,
                    direction: 'ascending',
                };
            }
        });
    };
    
    const sortedData = [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const res = await fetch(`/api/${type}?page=${currentPage}&limit=${itemsPerPage}`);
    //             const json = await res.json();
    //             setData(json.data); // assuming response has `data` and `total`
    //             setTotalItems(json.total);
    //         } catch (err) {
    //             console.error("Failed to fetch", err);
    //         }
    //     };

    //     fetchData();
    // }, [type, currentPage, itemsPerPage]);

    const handleDelete = async (e) => {
        let idsToDelete;
      
        if (selectAll) {
          // Get all banned users from the current page
          const visibleBannedIds = sortedData
            .filter(item => !item.isRegistered)
            .map(item => item[idKey]);
      
          idsToDelete = visibleBannedIds.filter(id => !deselectedItems.includes(id));
        } else {
          idsToDelete = [...selectedItems];
      
          // Filter out non-banned users for safety
          idsToDelete = sortedData
            .filter(item => !item.isRegistered && selectedItems.includes(item[idKey]))
            .map(item => item[idKey]);
        }
      
        if (idsToDelete.length === 0) {
          alert("No banned users selected.");
          return;
        }
      
        try {
          const fetchResult = await fetch(`https://localhost:8080/api/${type.toLowerCase()}/delbulk`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(idsToDelete)
          });
      
          if (fetchResult.ok) {
            window.location.reload(true);
          } else {
            alert("Delete failed.");
          }
        } catch (err) {
          alert("Error: " + err.message);
        }
      };
      
    
    function findUniqueKey(data) {
        if (!data || data.length === 0) return null;
    
        const keys = Object.keys(data[0]);
    
        for (const key of keys) {
            const seen = new Set();
            let allUnique = true;
    
            for (const row of data) {
                const value = row[key];
                if (seen.has(value)) {
                    allUnique = false;
                    break;
                }
                seen.add(value);
            }
    
            if (allUnique) {
                return key; // Found a unique column!
            }
        }
    
        return null; // No unique field found
    }

    const idKey = findUniqueKey(sortedData);

    const handleToggleBan = async (userId, currentStatus) => {
        try {
            const response = await fetch(`https://localhost:8080/api/users/${userId}/ban`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(!currentStatus),
            });
    
            if (response.ok) {
                setData(prev =>
                    prev.map(row =>
                        row[idKey] === userId
                            ? { ...row, isRegistered: !currentStatus }
                            : row
                    )
                );
            } else {
                console.error('Failed to update user status');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const [searchResults, setSearchResults] = useState([]);
    const [searchActive, setSearchActive] = useState(false);



    return (
        <>
        <ListButtons type={type} setResults={setSearchResults} setActive={setSearchActive}/>
        <div className="itemlists-container">
            <div className="itemlists-card">
                <div className="itemlists-actions">
                    <div className="itemlists-left">
                    </div>
                    <div className="itemlists-right">

                        <div className="per-page">
                            <span className="per-page-label">Per page: {itemsPerPage}</span>
                            <div className="select-dropdown" onClick={togglePage}>
                                <img
                                    src={dropdown}
                                    alt="arrow"
                                    className={`dropdown-icon ${isPageOpen ? "open" : ""}`}
                                />
                                {isPageOpen && (
                                    <div className="dropdown-menu-2">
                                        {[8, 16, 24, 32].map((num) => (
                                            <div
                                                key={num}
                                                className={`dropdown-option ${itemsPerPage === num ? 'selected' : ''}`}
                                                onClick={() => handlePerPageChange(num)}
                                            >
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <span>
                            {startItem}-{endItem} from {totalItems}
                        </span>
                        <button className="nav-btn-left" onClick={goPrev} disabled={currentPage === 1}>
                          <img
                            src={arrow}
                            alt="arrow"
                            className={`nav-arrow`}/>
                        </button>
                        <button className="nav-btn-right" onClick={goNext} disabled={currentPage === totalPages}>
                          <img
                            src={arrow}
                            alt="arrow"
                            className={`nav-arrow`}/>
                        </button>
                    </div>
                </div>

            <div>

            <div className="itemlists-table">
                <table>
                    <thead>
                        <tr className="hide">
                        {type !== "vessels" && (
                        <div className="selectall-wraper">
                            <div className="selectall-list">
                                <input
                                    type="checkbox"
                                    className="selectall-check"
                                    checked={selectAll}
                                    onChange={(e) => {
                                        const checked = e.target.checked;

                                        if (checked) {
                                            setSelectAll(true);
                                            setSelectedItems([]);      // reset manual selection
                                            setDeselectedItems([]);    // reset manual unchecking
                                        } else {
                                            setSelectAll(false);
                                            setSelectedItems([]);
                                            setDeselectedItems([]);
                                        }
                                    }}
                                />
                            </div>

                            <div className="delete-btn" onClick={() => handleDelete()}>
                                <img src={trash} alt="delete icon"/>
                            </div>
                        </div>
                                    
                                    )}
                        {data[0] &&
                            Object.keys(data[0])
                                .filter(key => !(type === "queries" && key.toLowerCase() === "question") &&  !['password', 'id', 'isadmin', 'isregistered','notificationsactive'].includes(key.toLowerCase()))
                                .map((key) => (
                                <th
                                    key={key}
                                    onClick={() => handleSort(key)}
                                    className="sortable-header"
                                >
                                    <span className="header-label">
                                    {key
                                        .split('_')
                                        .map(word =>
                                        ['wpi', 'mmsi'].includes(word.toLowerCase())
                                            ? word.toUpperCase()
                                            : word.charAt(0).toUpperCase() + word.slice(1)
                                        )
                                        .join('  ')}
                                    </span>
                                    {sortConfig.key === key && (
                                    <img
                                        src={dropdown}
                                        alt="arrow"
                                        className={`dropdown-icon sorting ${sortConfig.direction === 'descending' ? "open" : "lowered"}`}
                                    />
                                    )}
                                </th>
                            ))}
                            {type === "queries" && <th>View</th>}
                        </tr>
                    </thead>
                    <tbody>
                    {sortedData.filter((row, i) => ((!searchActive || searchResults.includes(row[idKey])))).map((row, i) => {
                            const isSelected = selectAll
                            ? !deselectedItems.includes(row[idKey])
                            : selectedItems.includes(row[idKey]);
                            return (
                                <tr key={i} className={isSelected ? 'row-selected' : ''}>
                                    
                                    {type !== "vessels" && (
                                    <div className="selectall-list">
                                        <input
                                        type="checkbox"
                                        className="selectall-check"
                                        disabled={row.isRegistered}
                                        style={{ opacity: row.isRegistered ? 0.6 : 1 }}
                                        checked={
                                          selectAll
                                            ? !deselectedItems.includes(row[idKey])
                                            : selectedItems.includes(row[idKey])
                                        }
                                        onChange={() => {
                                            const id = row[idKey];

                                            if (selectAll) {
                                            // In select-all mode: toggle deselections
                                            setDeselectedItems(prev =>
                                                prev.includes(id)
                                                ? prev.filter(item => item !== id)
                                                : [...prev, id]
                                            );
                                            } else {
                                            // In normal mode: toggle individual selections
                                            setSelectedItems(prev =>
                                                prev.includes(id)
                                                ? prev.filter(item => item !== id)
                                                : [...prev, id]
                                            );
                                            }
                                        }}
                                        />
                                    </div>
                                    )}
                                    {
                                    Object.entries(row)
                                    .filter(([key]) => !(type === "queries" && key.toLowerCase() === "question") && !['password', 'id', 'isadmin', 'isregistered','notificationsactive'].includes(key.toLowerCase()))
                                    .map(([key, value], j) => (
                                        <td key={j}>
                                        {type === "vessels" && key === "shiptype" ? (
                                            <select
                                            value={value}
                                            onChange={(e) => handleShipTypeChange(row[idKey], e.target.value)}
                                            className="shiptype-dropdown"
                                            >
                                            {shipTypes.map((option) => (
                                                <option key={option} value={option}>
                                                {option}
                                                </option>
                                            ))}
                                            </select>
                                        ) : (                                             
                                            String(value)
                                        )}
                                        </td>
                                    ))}

                                    {type === "queries" && (
                                        <td>
                                            <button className="view-query-button" onClick={() => setSelectedQuery(row.query || row.Query || row.question)}>
                                                View Query
                                            </button>
                                        </td>
                                    )}
                                    {type === "users" && (
                                        <td>
                                            <button
                                                className="ban-user-button"
                                                style={{ opacity: row.isRegistered ? 1 : 0.6 }}
                                                onClick={() => handleToggleBan(row[idKey], row.isRegistered)}
                                            >
                                                {row.isRegistered ? "Ban User" : "Unban User"}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>


            </div>

            </div>
        </div>
        {selectedQuery && (
        <QueryPopup
        queryText={selectedQuery}
        onClose={() => setSelectedQuery(null)}
            />
        )}
        </>
    );
}

export default AdminLists;
