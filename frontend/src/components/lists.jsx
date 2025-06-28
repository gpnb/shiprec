import React from "react";
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/myprofile.css'
import '../styles/lists.css'
import ListButtons from '../components/listbtn';
import dropdown from '../icons/Misc/Dropdown.png'
import arrow from "../icons/Misc/Arrow.png"
import { useParams } from 'react-router-dom';


function ItemLists({ type }) {

    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    // const [isDropdownOpen, setDropdownOpen] = useState(false);
    // const [selectedOption, setSelectedOption] = useState("All"); // Default selection

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

    

    return (
        <>
        <ListButtons/>
        <div className="itemlists-container">
            <div className="itemlists-card">
                <div className="itemlists-actions">
                    <div className="itemlists-left">


                        {/* <div className="select-dropdown" onClick={toggleDropdown}>
                            <div className="per-page">

                                
                                <img 
                                    src={dropdown} 
                                    alt="arrow" 
                                    className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} 
                                />
                                
                                <span className="per-page-label">{selectedOption}</span>
                        </div>
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    {["All", "Added", "Not Added"].map(option => (
                                        <div 
                                            key={option}
                                            className={`dropdown-option ${selectedOption === option ? 'selected' : ''}`}
                                            onClick={() => handleOptionClick(option)}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div> */}
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
                        {type !== "Ports" && (
                        <div className="selectall-list">
                        <input
                        type="checkbox"
                        className="selectall-check"
                        checked={selectAll || selectedItems.length === data.length}
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
                                    )}
                            {data[0] && Object.keys(data[0]).map((key) => (
                                <th
                                key={key}
                                onClick={() => handleSort(key)}
                                className="sortable-header"
                            >
                                <span className="header-label">
                                {key
                                    .split('_') // Split by underscore
                                    .map(word =>
                                    (word === "wpi" || word === 'mmsi') && word === word.toLowerCase()
                                        ? word.toUpperCase() // Acronym: all caps (e.g., wpi → WPI)
                                        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Normal: Capitalize
                                    )
                                    .join(' ')
                                }
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
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((row, i) => {
                            const isSelected = selectAll
                            ? !deselectedItems.includes(row[idKey])
                            : selectedItems.includes(row[idKey]);
                            return (
                                <tr key={i} className={isSelected ? 'row-selected' : ''}>
                                    {type !== "Ports" && (
                                    <div className="selectall-list">
                                        <input
                                        type="checkbox"
                                        className="selectall-check"
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
                                    {Object.entries(row).map(([key, value], j) => (
                                    <td
                                        key={j}
                                        style={{ cursor: 'pointer'}}
                                        onClick={() => navigate(`/${type}/${row[Object.keys(row)[0]]}`)}
                                    >
                                        {String(value)}
                                    </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>


            </div>

            </div>
        </div>
        </>
    );
}

export default ItemLists;
