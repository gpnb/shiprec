import React, { useState} from 'react';
// import { useState,useEffect } from 'react';
import filter from "../icons/Buttons/Filters-filled.png"
import search from "../icons/Buttons/Search-outlined.png"
import '../styles/listbtn.css';
import dropdown from '../icons/Misc/Dropdown.png'

function ListButtons({type, setResults, setActive}) {

    const [searchTerm, setSearchTerm]= useState('');

    const handleTyping = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);

    }

    const handleNameSearch = async(name) => {
        // change empty spaces in name with %20 for url passing
        name = name.replaceAll(" ", "%20");
        let num = 0; // just a local counter for the number of results found

        setResults([]);
        
        // search vessels
        console.log("search");
        try {
            const response = await fetch(`https://localhost:8080/api/${type.toLowerCase()}/byname/${name}`);
            const result = await response.json();

            if (result.totalElements === 0) {
                console.log("found nothing from vessels");
            } else {
                setResults(result.content);
                num += result.totalElements;
            }
        } catch(err) {
            console.log("vessel search failed: " + err);
        }

        console.log("found " + num + " results");
        setActive(true);
    }

    const handleSearch = (e) => {
        e.preventDefault();

        if (searchTerm === "") {
            setActive(false);
            return;
        }

        if (type === "Vessels" || type === "vessels") {
            handleNameSearch(searchTerm + " ");
        } else {
            handleNameSearch(searchTerm);
        }

        // alert(`Search term is: ${searchTerm}`);
    }

    return (
        <>
        <div className="listbtn-container">
            {/* <button type="button" className="list-btn" onClick={() => (null)}>
                <img src={filter} alt="Filters" className="list-btn-icons"/>
                Add Filter
                <img src={dropdown} alt="arrow" className={`list-btn-dropdown-icon`}/>
            </button> */}
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