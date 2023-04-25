import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store.js";

export interface IForm {
    login: string;
    password: string;
    userName: string;
    isAdmin: boolean;
}

export const CreateNewUser: React.FC<{
    visibility: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ visibility }) => {
    const user = useSelector((state: RootState) => state.user);
    const [data, setData] = useState<IForm>({
        login: "",
        password: "",
        userName: "",
        isAdmin: false,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };
    const handleFile = (file: File) => {
        if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg") {
            setSelectedFile(file);
        }
    };

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const domainTest = /@example\.com$/.test(data.login);
        if (
            data.login.length <= 0 ||
            data.password.length <= 0 ||
            data.userName.length <= 0 ||
            selectedFile == null
        )
            return toast.error("some data is not filled");
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("data", JSON.stringify(data));
        if (!domainTest) return toast.error("wrong login email");
        try {
            const result = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: "POST",
                headers: {
                    authorization: user.jwt,
                },
                body: formData,
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
            <form className="z-10 min-w-[40%] min-h-[70%] flex justify-center items-center flex-col bg-white relative">
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
                        checked={data.isAdmin}
                        onChange={() => {
                            setData((prev) => {
                                return {
                                    ...prev,
                                    isAdmin: !prev.isAdmin,
                                };
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
                <div className="flex items-center justify-center w-1/2 mb-5">
                    <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-100 dark:hover:bg-bray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-300"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {selectedFile == null ? (
                                <>
                                    <svg
                                        aria-hidden="true"
                                        className="w-10 h-10 mb-3 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        ></path>
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or
                                        drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PNG or JPG (MAX. 900x900px)
                                    </p>
                                </>
                            ) : (
                                <>
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        className="w-[40px] h-[40px]"
                                        alt="dasd"
                                    />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">{selectedFile.name}</span>
                                    </p>
                                </>
                            )}
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFile(e.target.files[0])}
                        />
                    </label>
                </div>
                <button onClick={(e) => handleClick(e)} className="w-1/2 button">
                    Add user
                </button>
                <span className="wrapper-x" onClick={() => visibility(false)}>
                    <svg
                        clipRule="evenodd"
                        fillRule="evenodd"
                        strokeLinejoin="round"
                        strokeMiterlimit="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 8.933-2.721-2.722c-.146-.146-.339-.219-.531-.219-.404 0-.75.324-.75.749 0 .193.073.384.219.531l2.722 2.722-2.728 2.728c-.147.147-.22.34-.22.531 0 .427.35.75.751.75.192 0 .384-.073.53-.219l2.728-2.728 2.729 2.728c.146.146.338.219.53.219.401 0 .75-.323.75-.75 0-.191-.073-.384-.22-.531l-2.727-2.728 2.717-2.717c.146-.147.219-.338.219-.531 0-.425-.346-.75-.75-.75-.192 0-.385.073-.531.22z"
                            fillRule="nonzero"
                        />
                    </svg>
                </span>
            </form>
        </>
    );
};
