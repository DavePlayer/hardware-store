import React, { useState } from "react";
import config from "./../../../config.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store.js";
import { DateTime } from "luxon";
interface IItem {
    nameAndCompany: string;
    date: DateTime;
    rentedTo: string | null;
    beingRepaired: boolean;
}

export const AddElement: React.FC<{
    visibility: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ visibility }) => {
    const [data, setData] = useState<IItem>({
        nameAndCompany: "",
        date: DateTime.now().setLocale("pl"),
        rentedTo: null,
        beingRepaired: false,
    });
    const user = useSelector((state: RootState) => state.user);
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };
    const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const date = DateTime.fromISO(value).setLocale("pl");
        setData((prev) => ({
            ...prev,
            date: date,
        }));
    };

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (data.nameAndCompany.length <= 0) return toast.error("some field is empty");
        try {
            const result = await fetch(`${config.serverUrl}/items/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: user.jwt,
                },
                body: JSON.stringify({ ...data, date: data.date.toFormat("dd.MM.yyyy") }),
            });
            const json = await result.json();
            if (!result.ok) throw new Error(json.status);

            // if ok
            toast.success("new product created");
            visibility(false);
        } catch (err) {
            let message = "error when creating product";
            if (err instanceof Error) message = err.message;
            toast.error(message);
        }
    };
    return (
        <form className="z-10 min-w-[40%] min-h-[70%] flex justify-center items-center flex-col bg-white relative">
            <h1 className="w-full font-semibold text-center mb-[3rem] text-5xl">Add new product</h1>
            <input
                type="text"
                name="nameAndCompany"
                onChange={(e) => handleInput(e)}
                className="p-3 border mt-1 mb-5 rounded-full w-1/2 text-center"
                placeholder="Product and Company name"
            />
            <input
                type="date"
                name="date"
                value={data.date.toISODate()}
                onChange={(e) => handleDate(e)}
                className="p-3 border mb-5 rounded-full w-1/2 text-center"
            />
            <button onClick={(e) => handleClick(e)} className="w-1/2 button">
                Create item
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
    );
};
