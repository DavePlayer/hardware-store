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

interface IItem {
    nameAndCompany: string;
    date: string;
    rentedTo: string | null;
    beingRepaired: boolean;
}

export const ManageItems = () => {
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
                    const aa = Date.parse(a.original.date.replaceAll(".", "/"));
                    const bb = Date.parse(b.original.date.replaceAll(".", "/"));
                    const dateA = new Date(aa).getTime();
                    const dateB = new Date(bb).getTime();
                    return dateA > dateB ? -1 : 1;
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
                    return(
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
                            className={`flex gap-1 items-center ${
                                cellData.row.original.rentedTo != null
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
        <div className="w-5/6 max-h-[100vh] overflow-y-scroll">
            <Table title="" data={products.data} columns={columns} />
        </div>
    );
}; //
