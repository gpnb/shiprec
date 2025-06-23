import React from "react";
import { useState,useEffect } from 'react';
import '../styles/myprofile.css'
import '../styles/lists.css'
import ListButtons from '../components/listbtn';
import dropdown from '../icons/Misc/Dropdown.png'
import arrow from "../icons/Misc/Arrow.png"

function ItemLists({ type }) {

    const [data, setData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("All"); // Default selection

    const [isPageOpen, setIsPageOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(8); // default value

    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });

    const [currentPage, setCurrentPage] = useState(1);

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // TEMPORARY MOCK for vessels
            const mockData = {
                data: [
                    {
                        id: 1,
                        name: "MV Poseidon",
                        imo: "9876543",
                        flag: "Greece",
                        type: "Bulk Carrier"
                    },
                    {
                        id: 2,
                        name: "SS Neptune",
                        imo: "1234567",
                        flag: "Liberia",
                        type: "Container Ship"
                    },
                    {
                        id: 3,
                        name: "Ocean Explorer",
                        imo: "7654321",
                        flag: "Panama",
                        type: "Oil Tanker"
                    },
                    {
                        id: 4,
                        name: "Ocean Explorer",
                        imo: "7654321",
                        flag: "Panama",
                        type: "Oil Tanker"
                    },
                    {
                        id: 5,
                        name: "Ocean Explorer",
                        imo: "7654321",
                        flag: "Panama",
                        type: "Oil Tanker"
                    },
                    {
                        id: 6,
                        name: "Ocean Explorer",
                        imo: "7654321",
                        flag: "Panama",
                        type: "Oil Tanker"
                    },
                    {
                        id: 7,
                        name: "Ocean Explorer",
                        imo: "7654321",
                        flag: "Panama",
                        type: "Oil Tanker"
                    },
                    {
                        id: 8,
                        name: "Ocean Explorer",
                        imo: "7654321",
                        flag: "Panama",
                        type: "Oil Tanker"
                    }
                ]
            };
    
            setTimeout(() => {
                setData(mockData.data);
                setTotalItems(mockData.data.length);
            }, 300); // simulate slight delay
        };
    
        fetchData();
    }, [type, currentPage, itemsPerPage]);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };


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

    const handleSelectItem = (id) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter(itemId => itemId !== id)  // remove if already selected
                : [...prevSelected, id]                         // add if not selected
        );
    };

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
                        <div className="selectall-list">
                        <input
                            type="checkbox"
                            className="selectall-check"
                            checked={selectedItems.length === data.length}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedItems(data.map(item => item.id));
                                } else {
                                    setSelectedItems([]);
                                }
                            }}
                        />
                        </div>
                            {data[0] && Object.keys(data[0]).map((key) => (
                                <th
                                key={key}
                                onClick={() => handleSort(key)}
                                className="sortable-header"
                            >
                                <span className="header-label">{key}</span>
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
                            const isSelected = selectedItems.includes(row.id);

                            return (
                                <tr key={i} className={isSelected ? 'row-selected' : ''}>
                                    <div className="selectall-list">
                                        <input
                                            type="checkbox"
                                            className="selectall-check"
                                            checked={isSelected}
                                            onChange={() => handleSelectItem(row.id)}
                                        />
                                    </div>
                                    {Object.values(row).map((value, j) => (
                                        <td key={j}>{String(value)}</td>
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
