import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { logout } from "../redux/reducers/user.js";

export const Logout = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(logout() as any);
        return;
    }, []);
    return <Navigate to="/login" />;
};
