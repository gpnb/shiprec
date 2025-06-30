// Protects certain routes by "blocking" them for guest users.

import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.isRegistered) {
        // Redirect them to the Register page
        return <Navigate to="/Register" replace/>;
    }

    return children;
}

export default ProtectedRoute;
