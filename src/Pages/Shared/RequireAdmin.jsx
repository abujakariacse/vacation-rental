import React from 'react';
import { Navigate } from 'react-router-dom';
import useDbUser from '../../hooks/useDbUser';
import Loader from './Loader.jsx';

const RequireAdmin = ({ children }) => {
    const { data: dbUser, isLoading } = useDbUser();

    if (isLoading) {
        return <Loader />;
    }

    if (!dbUser || dbUser.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default RequireAdmin;
