import React, { ReactNode, useState } from "react";
import { Wraper } from "./Wrapper/Wraper.js";
import { AddElement } from "./Wrapper/wraperElements/AddElement.js";
import { CreateNewUser } from "./Wrapper/wraperElements/CreateNewUser.js";
import { ManageItems } from "./Wrapper/wraperElements/ManageItems.js";
import { ManageUsers } from "./Wrapper/wraperElements/ManageUsers.js";

export const AdminPanel = () => {
    const [element, setElement] = useState<JSX.Element | null>(null);
    const [showWrapper, setShowWrapper] = useState<boolean>(false);
    return (
        <div className="w-5/6 max-h-[100vh] overflow-y-scroll">
            <header className="w-full p-6 text-4xl font-semibold border-b-2">
                <h1>Admin Actions</h1>
            </header>
            <section className="flex w-full justify-center gap-5 mt-10">
                <button
                    className="button"
                    onClick={() => {
                        setElement(() => <AddElement visibility={setShowWrapper} />);
                        setShowWrapper(true);
                    }}
                >
                    Add items
                </button>
                <button
                    className="button"
                    onClick={() => {
                        setElement(<CreateNewUser visibility={setShowWrapper} />);
                        setShowWrapper(true);
                    }}
                >
                    create new user
                </button>
                <button
                    className="button"
                    onClick={() => {
                        setElement(<ManageItems />);
                        setShowWrapper(true);
                    }}
                >
                    manage existing items
                </button>
                <button
                    className="button"
                    onClick={() => {
                        setElement(ManageUsers);
                        setShowWrapper(true);
                    }}
                >
                    manage users
                </button>
            </section>
            {showWrapper && element && <Wraper visibility={setShowWrapper}>{element}</Wraper>}
        </div>
    );
};
