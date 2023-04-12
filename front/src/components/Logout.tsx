import React from "react";
import { Navigate } from "react-router-dom";

export const Logout = () => {
    return <Navigate to="/login" />;
};
