import React, { ReactNode } from "react";
import { Navigate, redirect } from "react-router-dom";

export const Protector: React.FC<{ children?: ReactNode }> = ({ children }) => {
    console.log("passing through protector");
    return <>{children ? children : <Navigate to="/login" />}</>;
};
