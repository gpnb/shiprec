import React from "react";
import { useState,useEffect } from 'react';
import '../styles/myprofile.css'
import '../styles/lists.css'
import ListButtons from '../components/listbtn';
import dropdown from '../icons/Misc/Dropdown.png'
import arrow from "../icons/Misc/Arrow.png"

function ItemLists() {

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("All"); // Default selection

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };


    const [isPageOpen, setIsPageOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(8); // default value

    const togglePage = () => {
        setIsPageOpen((prev) => !prev);
    };

    const totalItems = 48;
    const [currentPage, setCurrentPage] = useState(1);

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


    return (
        <>
        <ListButtons/>
        <div className="itemlists-container">
            <div className="itemlists-card">
                <div className="itemlists-actions">
                    <div className="itemlists-left">
                        <div className="selectall-list">
                            <input type="checkbox" className="selectall-check" />
                        </div>

                        <div className="select-dropdown" onClick={toggleDropdown}>
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

                        </div>
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

            </div>

            <div>

            </div>

            </div>
        </div>
        </>
    );
}

export default ItemLists;
