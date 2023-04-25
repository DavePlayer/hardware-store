import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";
import {
    Delete,
    fetchAllProducts,
    getFromRepair,
    IProduct,
    sendToRepair,
} from "../../../redux/reducers/product.js";
import { RootState } from "../../../redux/store.js";
import { Table } from "../../CustomTable/Table.js";
import { DateTime } from "luxon";

interface IItem {
    nameAndCompany: string;
    date: string;
    rentedTo: string | null;
    beingRepaired: boolean;
}

export const ManageItems: React.FC<{
    visibility: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ visibility }) => {
    const products = useSelector((state: RootState) => state.products);
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllProducts({ token: user.jwt }) as any);
    }, []);
    // useEffect(() => {
    //     console.log("products updated", products);
    // }, [products]);
    const handleFix = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        values: IProduct
    ) => {
        e.preventDefault();
        const product = products.data.filter((o) => o._id == values._id);
        if (product[0].beingRepaired)
            await dispatch(getFromRepair({ token: user.jwt, itemId: values._id }) as any);
        else await dispatch(sendToRepair({ token: user.jwt, itemId: values._id }) as any);
        console.log(products.data);
    };
    const handleRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, values: IProduct) => {
        e.preventDefault();
        console.log(values._id);
        dispatch(Delete({ token: user.jwt, itemId: values._id }) as any);
    };
    const columns = React.useMemo<Column<IProduct>[]>(
        () => [
            {
                Header: "Name & Company",
                accessor: "nameAndCompany",
            },
            {
                Header: "Date",
                accessor: "date",
                sortType: (a, b) => {
                    const aa = DateTime.fromISO(a.original.date.split(".").reverse().join("-"))
                    const bb = DateTime.fromISO(b.original.date.split(".").reverse().join("-"))
                    return bb.diff(aa).milliseconds > 0 ? 1 : -1;
                },
            },
            {
                Header: "Status",
                accessor: "beingRepaired",
                sortType: (a, b) => {
                    // it's tedious to make it look normal in if statements, so I left it like that
                    // it's custom sort function which returns either 1 or -1 depending on a or b element
                    // + transforms boolean to number and ! makes typescript to not cry about possible errors(those won't occur)
                    // first and third line check if products are rented or in repair
                    // by that this function sorts elements by either available or unavailable status

                    // prettier-ignore
                    return (
                        +!(a.original.rentedTo != null || a.original.beingRepaired)
                            >
                            +!(b.original.rentedTo != null || b.original.beingRepaired)
                            ? 1 : -1
                    )
                },
                Cell: (cellData) => {
                    return (
                        <span
                            // here's similar example from above, but here it just add custom css properties (red, green color)
                            className={`flex gap-1 items-center ${cellData.row.original.rentedTo != null
                                ? "text-red-500 fill-red-500"
                                : !cellData.row.original.beingRepaired
                                    ? "text-green-500 fill-green-500"
                                    : "text-orange-400 fill-orange-400"
                                }`}
                        >
                            <svg
                                className="h-[1rem]"
                                clipRule="evenodd"
                                fillRule="evenodd"
                                strokeLinejoin="round"
                                strokeMiterlimit="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="11.998" cy="11.998" fillRule="nonzero" r="9.998" />
                            </svg>
                            {/* same check from above */}
                            {cellData.row.original.rentedTo != null
                                ? "rented"
                                : !cellData.row.original.beingRepaired
                                    ? "Ok"
                                    : "In repair"}
                        </span>
                    );
                },
            },
            {
                Header: "send to Repair",
                Cell: (cellData: any) => {
                    return (
                        <button
                            disabled={cellData.row.original.rentedTo != null}
                            className="bg-button-enabled-0 text-button-enabled-1 border-button-enabled-1 border-[1px] font-bold py-1 px-8 rounded-lg hover:bg-button-enabled-1 hover:text-button-enabled-0 cursor-pointer transition-colors disabled:bg-button-disabled-0 disabled:text-button-disabled-1 disabled:border-button-disabled-1"
                            onClick={(e) => handleFix(e, cellData.cell.row.original)}
                        >
                            {!cellData.row.original.beingRepaired ? "Repair" : "Get back"}
                        </button>
                    );
                },
            },
            {
                Header: "Remove Product",
                Cell: (cellData: any) => {
                    return (
                        <button
                            // this check is reversed version from above to add disabled status to button
                            disabled={
                                cellData.row.original.rentedTo != null ||
                                cellData.row.original.beingRepaired
                            }
                            className="bg-red-300 text-red-600 border-red-600 border-[1px] font-bold py-1 px-8 rounded-lg hover:bg-red-500 hover:text-button-enabled-0 cursor-pointer transition-colors disabled:bg-button-disabled-0 disabled:text-button-disabled-1 disabled:border-button-disabled-1"
                            onClick={(e) => handleRemove(e, cellData.cell.row.original)}
                        >
                            {"Delete"}
                        </button>
                    );
                },
            },
        ],
        [products.data]
    );
    return (
        <form className="z-10 min-w-[40%] min-h-[70%] flex items-center flex-col bg-white relative">
            <div className="min-w-[80rem] max-h-[100vh] overflow-y-scroll">
                <Table title="" data={products.data} columns={columns} />
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
        </form>
    );
}; //
