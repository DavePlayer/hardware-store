import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchLogin } from "../redux/reducers/user.js";
import { RootState } from "../redux/store.js";

export const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<{ login: string; password: string }>({
        login: "",
        password: "",
    });
    const user = useSelector((state: RootState) => state.user);
    console.log(user);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token != null) navigate("/hardware-store");
    }, []);
    const handleButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        console.log(form);
        dispatch(fetchLogin(form) as any);
    };
    const dispatch = useDispatch();
    return (
        <>
            {user.isLoged ? (
                <Navigate to="/hardware-store" />
            ) : (
                <section className="w-full h-[100vh] flex justify-center items-center flex-col">
                    <h2 className="text-4xl font-semibold mb-8">Welcome Back</h2>
                    <form className="w-1/4">
                        <label htmlFor="login" className="text-sm">
                            Email
                        </label>
                        <input
                            onChange={(e) => handleChange(e)}
                            type="text"
                            name="login"
                            id="login"
                            className="p-3 border mt-1 mb-5 rounded-full w-full"
                            value={form.login}
                        />
                        <label htmlFor="password" className="text-sm">
                            Password
                        </label>
                        <input
                            onChange={(e) => handleChange(e)}
                            type="password"
                            name="password"
                            id="password"
                            className="p-3 border mt-1 rounded-full w-full"
                            value={form.password}
                        />
                        <button
                            onClick={(e) => handleButton(e)}
                            className="p-3 bg-blue-600 w-full rounded-full mt-[3rem] text-white font-semibold"
                        >
                            Login
                        </button>
                    </form>
                </section>
            )}
        </>
    );
};
