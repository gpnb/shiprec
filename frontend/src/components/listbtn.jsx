import React from "react";
// import { useState,useEffect } from 'react';
import filter from "../icons/Buttons/Filters-filled.png"
import search from "../icons/Buttons/Search-outlined.png"
import '../styles/listbtn.css';

function ListButtons() {


    return (
        <>
        <div className="listbtn-container">
            <button type="button" className="list-btn" onClick={() => (null)}>
                <img src={filter} alt="Filters"/>
                Add Filter
            </button>
            <button type="button" className="list-btn" onClick={() => (null)}>
                <img src={search} alt="Search"/>
                Search...
            </button>
        </div> 
        </>
    )
}

export default ListButtons;