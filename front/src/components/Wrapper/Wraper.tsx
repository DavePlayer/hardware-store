import React, { ReactNode } from "react";

export const Wraper: React.FC<{
    children: ReactNode;
    visibility: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ children, visibility }) => {
    return (
        <section className="z-20 w-[100vw] h-[100vh] flex justify-center items-center bg-black bg-opacity-60 fixed top-0 left-0 ">
            {children}
        </section>
    );
};
