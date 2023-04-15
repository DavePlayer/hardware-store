import React, { useEffect, useMemo } from "react";
import { unmountComponentAtNode } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { CellProps, Column, Row } from "react-table";
import { fetchProducts, IProduct, rentProduct } from "../redux/reducers/product";
import { RootState } from "../redux/store";
import { Table } from "./CustomTable/Table";

export function HardwareStore() {
    const products = useSelector((state: RootState) => state.products);
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchProducts({ token: user.jwt }) as any);
    }, []);
    const handleButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, values: IProduct) => {
        console.log(values._id);
        dispatch(rentProduct({ token: user.jwt, itemId: values._id }) as any);
    };
    console.log(products);
    const data = React.useMemo<Array<IProduct>>(() => [...products.data], [products.data]);
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
                    const aa = new Date(a.original.date.replace(".", "/")).getTime();
                    const bb = new Date(b.original.date.replace(".", "/")).getTime();
                    return aa > bb ? -1 : 1;
                },
            },
            {
                Header: "Avaibality",
                accessor: "rentedTo",
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
                                cellData.row.original.rentedTo == null &&
                                !cellData.row.original.beingRepaired
                                    ? "text-green-500 fill-green-500"
                                    : "text-red-500 fill-red-500"
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
                            {cellData.row.original.rentedTo == null &&
                            !cellData.row.original.beingRepaired
                                ? "Available"
                                : "Not available"}
                        </span>
                    );
                },
            },
            {
                Header: "Rent",
                Cell: (cellData: any) => {
                    return (
                        <button
                            // this check is reversed version from above to add disabled status to button
                            disabled={
                                cellData.row.original.rentedTo != null ||
                                cellData.row.original.beingRepaired
                            }
                            className="bg-button-enabled-0 text-button-enabled-1 border-button-enabled-1 border-[1px] font-bold py-1 px-8 rounded-lg hover:bg-button-enabled-1 hover:text-button-enabled-0 cursor-pointer transition-colors disabled:bg-button-disabled-0 disabled:text-button-disabled-1 disabled:border-button-disabled-1"
                            onClick={(e) => handleButton(e, cellData.cell.row.original)}
                        >
                            {"Rent"}
                        </button>
                    );
                },
            },
        ],

        []
    );
    return (
        <div className="w-5/6 max-h-[100vh] overflow-y-scroll">
            <Table
                title="Hardware List"
                buttonName="Rent"
                handleCustomButton={handleButton}
                data={data}
                columns={columns}
            />
        </div>
    );
}
