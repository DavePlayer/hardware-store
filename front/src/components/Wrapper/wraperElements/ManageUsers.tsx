import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";
import { Delete, IProduct } from "../../../redux/reducers/product.js";
import { fetchAllUsers, IUser } from "../../../redux/reducers/users.js";
import { RootState } from "../../../redux/store.js";
import { Table } from "../../CustomTable/Table.js";

interface IItem {
    nameAndCompany: string;
    date: string;
    rentedTo: string | null;
    beingRepaired: boolean;
}

export const ManageUsers = () => {
    const usersData = useSelector((state: RootState) => state.users);
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const [idOfEdited, setIdOfEdited] = useState<string>("nothing");
    const [editedUser, setEditedUser] = useState<IUser>({
        _id: "",
        isAdmin: false,
        login: "",
        userName: "",
    });

    useEffect(() => {
        dispatch(fetchAllUsers({ token: user.jwt }) as any);
    }, []);

    const handleUpdate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, values: IUser) => {
        e.preventDefault();
        setEditedUser({
            ...values,
        });
        setIdOfEdited(values._id);
    };
    const handleValuesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
        console.log(name, value, editedUser);
    };
    const handleSave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, values: IUser) => {
        e.preventDefault();
        console.log(values, editedUser);
        setIdOfEdited("nothing");
    };
    const handleRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, values: IUser) => {
        e.preventDefault();
        console.log(values);
        // dispatch(Delete({ token: user.jwt, itemId: values._id }) as any);
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
                    return (
                        <>
                            {cellData.row.original._id != idOfEdited ? (
                                cellData.row.original.login
                            ) : (
                                <input
                                    onChange={(e) => handleValuesChange(e)}
                                    className="w-[8em] border rounded-full"
                                    type="text"
                                    name="login"
                                    value={editedUser.login}
                                />
                            )}
                        </>
                    );
                },
            },
            {
                Header: "User Name",
                accessor: "userName",
                Cell: (cellData) => {
                    return (
                        <>
                            {cellData.row.original._id != idOfEdited ? (
                                cellData.row.original.userName
                            ) : (
                                <input
                                    onChange={(e) => handleValuesChange(e)}
                                    className="w-[8em] border rounded-full"
                                    type="text"
                                    name="userName"
                                    value={editedUser.userName}
                                />
                            )}
                        </>
                    );
                },
            },
            {
                Header: "Is Admin",
                accessor: "isAdmin",
                Cell: (cellData) => {
                    return (
                        <>
                            {cellData.row.original._id != idOfEdited ? (
                                <input
                                    disabled={true}
                                    type="checkbox"
                                    defaultChecked={cellData.row.original.isAdmin}
                                />
                            ) : (
                                <input
                                    onChange={(e) => handleValuesChange(e)}
                                    disabled={false}
                                    type="checkbox"
                                    name="isAdmin"
                                    checked={editedUser.isAdmin}
                                />
                            )}
                        </>
                    );
                },
            },
            {
                Header: "Edit User",
                Cell: (cellData: any) => {
                    return (
                        <>
                            {cellData.row.original._id != idOfEdited ? (
                                <button
                                    // this check is reversed version from above to add disabled status to button
                                    className="bg-button-enabled-0 text-button-enabled-1 border-button-enabled-1 border-[1px] font-bold py-1 px-8 rounded-lg hover:bg-button-enabled-1 hover:text-button-enabled-0 cursor-pointer transition-colors disabled:bg-button-disabled-0 disabled:text-button-disabled-1 disabled:border-button-disabled-1"
                                    onClick={(e) => handleUpdate(e, cellData.cell.row.original)}
                                >
                                    {"Update"}
                                </button>
                            ) : (
                                <button
                                    // this check is reversed version from above to add disabled status to button
                                    className="bg-button-enabled-0 text-button-enabled-1 border-button-enabled-1 border-[1px] font-bold py-1 px-8 rounded-lg hover:bg-button-enabled-1 hover:text-button-enabled-0 cursor-pointer transition-colors disabled:bg-button-disabled-0 disabled:text-button-disabled-1 disabled:border-button-disabled-1"
                                    onClick={(e) => handleSave(e, cellData.cell.row.original)}
                                >
                                    {"Save"}
                                </button>
                            )}
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
        [usersData, idOfEdited]
    );
    return (
        <div className="w-11/12 max-h-[100vh] overflow-y-scroll">
            <Table title="" data={usersData} columns={columns} />
        </div>
    );
};
