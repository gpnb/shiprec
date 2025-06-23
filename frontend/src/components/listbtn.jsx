import React, { useState} from 'react';
// import { useState,useEffect } from 'react';
import filter from "../icons/Buttons/Filters-filled.png"
import search from "../icons/Buttons/Search-outlined.png"
import '../styles/listbtn.css';
import dropdown from '../icons/Misc/Dropdown.png'

function ListButtons() {

    const [searchTerm, setSearchTerm]= useState('');

    const handleTyping = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);

    }

    const handleSearch = (e) => {
        e.preventDefault();
        alert(`Search term is: ${searchTerm}`);
    }

    return (
        <>
        <div className="listbtn-container">
            <button type="button" className="list-btn" onClick={() => (null)}>
                <img src={filter} alt="Filters" className="list-btn-icons"/>
                Add Filter
                <img src={dropdown} alt="arrow" className={`list-btn-dropdown-icon`}/>
            </button>
            <form onSubmit={handleSearch}>
                <button type="button" className="list-btn" onSubmit={() => handleSearch()}>
                    <img src={search} alt="Search" className="list-btn-icons"/>
                    <input className='list-btn-search' type='text' placeholder='Search...' onChange={handleTyping}/> 
                </button>
            </form>
        </div> 
        </>
    )
}

export default ListButtons;