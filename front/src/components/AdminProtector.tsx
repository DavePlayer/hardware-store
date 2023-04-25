import React, { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { readToken } from "../redux/reducers/user.js";
import { RootState } from "../redux/store.js";

export const AdminProtector: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const user = useSelector((state: RootState) => state.user);
    const [fetched, setFetched] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        //get token from local storage. forward to login if token doesn't exist
        const token = localStorage.getItem("token");
        if (token == null || token == undefined || token == "undefined") {
            localStorage.removeItem("token");
            return navigate("/login");
        }

        if (user.jwt.length <= 0 && token != null && token.length > 0) {
            fetch(`${import.meta.env.VITE_API_URL}/login/validate-token`, {
                method: "GET",
                headers: { authorization: token },
            })
                .then(async (data) => {
                    const json = await data.json();
                    console.log(json);
                    if (!data.ok) {
                        localStorage.removeItem("token");
                        return setError(json);
                    } else {
                        dispatch(readToken({ token }));
                        if (user.isAdmin == false) {
                            console.log("user is not an admin");
                            setFetched(false);
                            navigate("/hardware-store");
                        } else {
                            console.log("user is an admin");
                        }
                        setFetched(true);
                    }
                })
                .catch((err) => {
                    console.error(err.message);
                    localStorage.removeItem("token");
                    setError(err.message);
                    return navigate("/login");
                });
            return;
        }
        // secure fake token paste (verify before forwarding to element)
        if (user.jwt.length > 0) {
            fetch(`${import.meta.env.VITE_API_URL}/login/validate-token`, {
                headers: { authorization: user.jwt },
            })
                .then(async (data) => {
                    const json = await data.json();
                    if (!data.ok) setError((json as { status: string }).status);
                    return json;
                })
                .then(() => {
                    if (user.isAdmin == false) {
                        console.log("user is not an admin");
                        setFetched(false);
                        navigate(-1);
                    } else {
                        console.log("user is an admin");
                    }
                })
                .finally(() => setFetched(true));
        }
    }, []);
    console.log("passing through admin protector");
    return (
        <>
            {error && error.length > 0 ? (
                <Navigate to={`/login?${new URLSearchParams({ error })}`} />
            ) : (
                fetched &&
                (children ? (
                    children
                ) : (
                    <Navigate
                        to={`/login?${new URLSearchParams({
                            error: "no react component provided",
                        })}`}
                    />
                ))
            )}
        </>
    );
};
