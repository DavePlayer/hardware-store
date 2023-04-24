import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";
import { deleteUser, fetchAllUsers, IUser, updateUser } from "../../../redux/reducers/users.js";
import { RootState } from "../../../redux/store.js";
import { Table } from "../../CustomTable/Table.js";

interface IItem {
    nameAndCompany: string;
    date: string;
    rentedTo: string | null;
    beingRepaired: boolean;
}

export const ManageUsers: React.FC<{
    visibility: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ visibility }) => {
    const usersData = useSelector((state: RootState) => state.users);
    const user = useSelector((state: RootState) => state.user);
    const inputRef = React.useRef(null);
    const dispatch = useDispatch();
    const [idOfEdited, setIdOfEdited] = useState<string>("nothing");
    const [loginValue, setLoginValue] = useState("");
    const [userNameValue, setUserNameValue] = useState("");
    const [isAdminValue, setIsAdminValue] = useState(false);

    useEffect(() => {
        dispatch(fetchAllUsers({ token: user.jwt }) as any);
    }, []);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [idOfEdited]);

    const handleUpdate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, values: IUser) => {
        e.preventDefault();
        setLoginValue(values.login);
        setUserNameValue(values.userName);
        setIsAdminValue(values.isAdmin);
        setIdOfEdited(values._id);
    };
    const handleValuesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        console.log(name, value, loginValue, userNameValue, isAdminValue);
        switch (name) {
            case "login":
                setLoginValue(value);
                break;
            case "userName":
                setUserNameValue(value);
                break;
            case "isAdmin":
                setIsAdminValue(checked);
                break;
            default:
                break;
        }
    };
    const handleSave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        console.log(loginValue, userNameValue, isAdminValue);
        setIdOfEdited("nothing");
        const comperableUser = usersData.filter((o) => o._id == idOfEdited)[0];
        // if no data changes
        if (comperableUser != undefined && comperableUser != null) {
            console.log("found comperable user");
            if (comperableUser.isAdmin == isAdminValue)
                if (comperableUser.login == loginValue)
                    if (comperableUser.userName == userNameValue) return;
            console.log("updating user");
        }
        dispatch(
            updateUser({
                token: user.jwt,
                user: {
                    _id: idOfEdited,
                    login: loginValue,
                    isAdmin: isAdminValue,
                    userName: userNameValue,
                },
            }) as any
        );
    };
    const handleRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, values: IUser) => {
        e.preventDefault();
        console.log(values._id);
        dispatch(deleteUser({ token: user.jwt, _id: values._id }) as any);
    };
    const columns = React.useMemo<Column<IUser>[]>(
        () => [
            {
                Header: "ID",
                accessor: "_id",
                Cell: (cellData) => {
                    return <>{cellData.row.original._id}</>;
                },
            },
            {
                Header: "Login",
                accessor: "login",
                Cell: (cellData) => {
                    return <>{cellData.row.original.login}</>;
                },
            },
            {
                Header: "User Name",
                accessor: "userName",
                Cell: (cellData) => {
                    return <>{cellData.row.original.userName}</>;
                },
            },
            {
                Header: "Is Admin",
                accessor: "isAdmin",
                Cell: (cellData) => {
                    return (
                        <>
                            <input
                                disabled={true}
                                type="checkbox"
                                defaultChecked={cellData.row.original.isAdmin}
                            />
                        </>
                    );
                },
            },
            {
                Header: "Edit User",
                Cell: (cellData: any) => {
                    return (
                        <>
                            <button
                                // this check is reversed version from above to add disabled status to button
                                className="bg-button-enabled-0 text-button-enabled-1 border-button-enabled-1 border-[1px] font-bold py-1 px-8 rounded-lg hover:bg-button-enabled-1 hover:text-button-enabled-0 cursor-pointer transition-colors disabled:bg-button-disabled-0 disabled:text-button-disabled-1 disabled:border-button-disabled-1"
                                onClick={(e) => handleUpdate(e, cellData.cell.row.original)}
                            >
                                {"Update"}
                            </button>
                        </>
                    );
                },
            },
            {
                Header: "Remove User",
                Cell: (cellData: any) => {
                    return (
                        <button
                            // this check is reversed version from above to add disabled status to button
                            disabled={cellData.row.original._id == idOfEdited}
                            className="bg-red-300 text-red-600 border-red-600 border-[1px] font-bold py-1 px-8 rounded-lg hover:bg-red-500 hover:text-button-enabled-0 cursor-pointer transition-colors disabled:bg-button-disabled-0 disabled:text-button-disabled-1 disabled:border-button-disabled-1"
                            onClick={(e) => handleRemove(e, cellData.cell.row.original)}
                        >
                            {"Delete"}
                        </button>
                    );
                },
            },
        ],
        [usersData]
    );
    return (
        <>
            {idOfEdited == "nothing" ? (
                <form className="z-10 min-w-[40%] min-h-[70%] flex items-center flex-col bg-white relative">
                    <div className="min-w-[80rem] max-h-[100vh] overflow-y-scroll flex justify-center items-center">
                        <Table title="" data={usersData} columns={columns} />
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
                    </div>
                </form>
            ) : (
                <form className="z-10 min-w-[40%] min-h-[70%] flex justify-center items-center flex-col bg-white relative">
                    <div className="min-w-[80rem] max-h-[100vh] overflow-y-scroll flex justify-center items-center">
                        <div className="w-1/2 flex justify-center items-center flex-wrap">
                            <input
                                name="login"
                                onChange={(e) => handleValuesChange(e)}
                                type="text"
                                value={loginValue}
                                className="p-3 border mt-1 mb-5 rounded-full w-full"
                            />
                            <input
                                name="userName"
                                onChange={(e) => handleValuesChange(e)}
                                type="text"
                                value={userNameValue}
                                className="p-3 border mt-1 mb-5 rounded-full w-full"
                            />
                            <div className="flex gap-1 w-full justify-center mb-5">
                                <label htmlFor="isAdmin" className="text-sm no-tap">
                                    Is admin
                                </label>
                                <input
                                    name="isAdmin"
                                    id="isAdmin"
                                    onChange={(e) => handleValuesChange(e)}
                                    type="checkbox"
                                    checked={isAdminValue}
                                />
                            </div>
                            <button onClick={(e) => handleSave(e)} className="w-1/3">
                                Update user
                            </button>
                            <button onClick={(e) => setIdOfEdited("nothing")} className="w-1/3">
                                Cancel
                            </button>
                        </div>
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
                    </div>
                </form>
            )}
        </>
    );
};
