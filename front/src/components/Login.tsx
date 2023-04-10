import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/reducers/user.js";

export const Login = () => {
    const [form, setForm] = useState<{ login: string; password: string }>({
        login: "",
        password: "",
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };
    const handleButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        console.log(form);
        dispatch(login(form));
    };
    const dispatch = useDispatch();
    return (
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
    );
};
