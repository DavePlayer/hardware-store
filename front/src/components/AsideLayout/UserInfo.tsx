import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store.js";

export function UserInfo() {
    const user = useSelector((state: RootState) => state.user);
    return (
        <section className="text-white flex justify-left items-center">
            {user.imgPath == null ? (
                <figure className="w-12 overflow-hidden rounded-lg">
                    <svg viewBox="0 0 24 24" className="fill-white w-full h-full">
                        <path d="M24 0v24h-24v-24h24zm-6.118 16.064c-2.293-.529-4.427-.993-3.394-2.945 3.146-5.942.834-9.119-2.488-9.119-3.388 0-5.643 3.299-2.488 9.119 1.064 1.963-1.15 2.427-3.394 2.945-2.048.473-2.124 1.49-2.118 3.269l.004.667h15.993l.003-.646c.007-1.792-.062-2.815-2.118-3.29z" />
                    </svg>
                </figure>
            ) : (
                <figure className="rounded-md overflow-hidden min-w-[40px] h-[40px]">
                    <img
                        className="w-full h-full"
                        src={`${import.meta.env.VITE_API_URL}/${user.imgPath}`}
                        alt="usrProfile"
                    />
                </figure>
            )}
            <div className="basis-full pl-3">{user.userName}</div>
        </section>
    );
}
