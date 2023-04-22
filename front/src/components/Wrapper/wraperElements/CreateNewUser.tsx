import React, { useState } from "react";
import config from "./../../../config.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface IForm {
    login: string;
    password: string;
    userName: string;
    isAdmin: boolean;
}

export const CreateNewUser: React.FC<{
    visibility: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ visibility }) => {
    const [data, setData] = useState<IForm>({
        login: "",
        password: "",
        userName: "",
        isAdmin: true,
    });
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };
    const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            const result = await fetch(`${config.serverUrl}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const json = await result.json();
            if (!result.ok) throw new Error(json.status);

            // if ok
            toast.success("added new user");
            visibility(false);
        } catch (err) {
            let message = "error when adding new user";
            if (err instanceof Error) message = err.message;
            toast.error(message);
        }
    };
    return (
        <>
            <h1 className="w-full font-semibold text-center mb-[3rem] text-5xl">Add User</h1>
            <input
                type="email"
                name="login"
                value={data.login}
                onChange={(e) => handleInput(e)}
                className="p-3 border mt-1 mb-5 rounded-full w-1/2 text-center"
                placeholder="e-mail"
            />
            <input
                type="text"
                name="userName"
                value={data.userName}
                onChange={(e) => handleInput(e)}
                className="p-3 border mb-5 rounded-full w-1/2 text-center"
                placeholder="user name"
            />
            <input
                type="password"
                name="password"
                value={data.password}
                onChange={(e) => handleInput(e)}
                className="p-3 border mb-5 rounded-full w-1/2 text-center"
                placeholder="password"
            />
            <div className="flex gap-1 mb-5">
                <input
                    key={Math.random()}
                    defaultChecked={!data.isAdmin}
                    onChange={() => {
                        setData((prev) => {
                            prev.isAdmin = !prev.isAdmin;
                            return prev;
                        });
                    }}
                    id="isAdmin"
                    type="checkbox"
                    className=""
                />
                <label htmlFor="isAdmin" className="no-tap">
                    isAdmin
                </label>
            </div>
            <button onClick={(e) => handleClick(e)} className="w-1/2 button">
                Add user
            </button>
        </>
    );
};
