import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/return.css'
import arrow from "../icons/Misc/Arrow.png"

function Return () {

    const navigate = useNavigate();

    return (
        <div className="btn-container">
            <button type="button" className="return-btn" onClick={() => navigate('/')}>
                <img src={arrow} alt="Arrow icon"/>
                Return
            </button>
        </div> 
    )
};

export default Return;