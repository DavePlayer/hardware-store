import React, { useState } from "react";
import config from "./../../../config.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store.js";
interface IItem {
    nameAndCompany: string;
    date: string;
    rentedTo: string | null;
    beingRepaired: boolean;
}

export const AddElement: React.FC<{
    visibility: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ visibility }) => {
    const [data, setData] = useState<IItem>({
        nameAndCompany: "",
        date: new Date().toISOString().split("T")[0],
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
        const date = value.split("-").reverse().join(".");
        setData((prev) => {
            prev.date = date;
            return prev;
        });
    };

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            const result = await fetch(`${config.serverUrl}/items/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: user.jwt,
                },
                body: JSON.stringify(data),
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
        <>
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
                defaultValue={data.date}
                onChange={(e) => handleDate(e)}
                className="p-3 border mb-5 rounded-full w-1/2 text-center"
            />
            <button onClick={(e) => handleClick(e)} className="w-1/2 button">
                Create item
            </button>
        </>
    );
};
