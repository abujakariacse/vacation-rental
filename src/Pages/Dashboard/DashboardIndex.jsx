import React from "react";
import { Navigate } from "react-router-dom";
import useDbUser from "../../hooks/useDbUser";
import Loader from "../Shared/Loader.jsx";

const DashboardIndex = () => {
  const { data: dbUser, isLoading } = useDbUser();

  if (isLoading) {
    return <Loader />;
  }

  if (dbUser?.role === "admin") {
    return <Navigate to="/dashboard/allbookings" replace />;
  }

  return <Navigate to="/dashboard/mybookings" replace />;
};

export default DashboardIndex;
