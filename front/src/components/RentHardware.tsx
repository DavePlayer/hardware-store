import React, { useEffect, useMemo } from "react";
import { unmountComponentAtNode } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { CellProps, Column, Row } from "react-table";
import {
    fetchProducts,
    fetchRentedProducts,
    IProduct,
    rentProduct,
    returnProduct,
} from "../redux/reducers/product";
import { RootState } from "../redux/store";
import { Table } from "./CustomTable/Table";
import { DateTime } from "luxon";

export function RentHardware() {
    const products = useSelector((state: RootState) => state.products);
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchRentedProducts({ token: user.jwt }) as any);
    }, []);
    const handleButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, values: IProduct) => {
        dispatch(returnProduct({ token: user.jwt, itemId: values._id }) as any);
    };
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
                    const aa = DateTime.fromISO(a.original.date.split(".").reverse().join("-"));
                    const bb = DateTime.fromISO(b.original.date.split(".").reverse().join("-"));
                    return bb.diff(aa).milliseconds > 0 ? 1 : -1;
                },
            },
            {
                Header: "Rent",
                Cell: (cellData: any) => {
                    return (
                        <button
                            // this check is reversed version from above to add disabled status to button
                            disabled={
                                cellData.row.original.rentedTo == null ||
                                cellData.row.original.beingRepaired
                            }
                            className="bg-button-enabled-0 text-button-enabled-1 border-button-enabled-1 border-[1px] font-bold py-1 px-8 rounded-lg hover:bg-button-enabled-1 hover:text-button-enabled-0 cursor-pointer transition-colors disabled:bg-button-disabled-0 disabled:text-button-disabled-1 disabled:border-button-disabled-1"
                            onClick={(e) => handleButton(e, cellData.cell.row.original)}
                        >
                            {"Return"}
                        </button>
                    );
                },
            },
        ],

        []
    );
    return (
        <div className="w-5/6">
            <Table title="Rent Hardware" data={data} columns={columns} />
        </div>
    );
}
