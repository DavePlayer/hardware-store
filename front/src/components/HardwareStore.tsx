import React, { useMemo } from "react";
import { unmountComponentAtNode } from "react-dom";
import { useSelector } from "react-redux";
import { CellProps, Column, Row } from "react-table";
import { IProduct } from "../redux/reducers/product";
import { RootState } from "../redux/store";
import { Table } from "./CustomTable/Table";

interface IData {
  id: number;
  nameAndCompany: String;
  date: String;
  rentedTo: number | null;
  beingRepaired?: boolean;
}

export function HardwareStore() {
  const products = useSelector((state: RootState) => state.products);
  const handleButton = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    values: IProduct
  ) => {
    console.log(values);
  };
  const data = React.useMemo<Array<IProduct>>(() => [...products], [products]);
  const columns = React.useMemo<Column<IProduct>[]>(
    () => [
      {
        Header: "Name & Company",
        accessor: "nameAndCompany",
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Avaibality",
        accessor: "rentedTo",
        sortType: (a, b, id) => {
          return +!(
            a!.original!.rentedTo != null || a!.original!.beingRepaired
          ) > +!(b?.original?.rentedTo != null || b?.original?.beingRepaired)
            ? 1
            : -1;
        },
        Cell: (cellData) => {
          return (
            <span
              className={`flex gap-1 items-center ${
                cellData?.row?.original?.rentedTo == null &&
                !cellData?.row?.original?.beingRepaired
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
              {cellData?.row?.original?.rentedTo == null &&
              !cellData?.row?.original?.beingRepaired
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
              disabled={
                cellData?.row?.original?.rentedTo != null ||
                cellData?.row?.original?.beingRepaired
              }
              className="bg-button-enabled-0 text-button-enabled-1 border-button-enabled-1 border-[1px] font-bold py-1 px-8 rounded-lg hover:bg-button-enabled-1 hover:text-button-enabled-0 cursor-pointer transition-colors disabled:bg-button-disabled-0 disabled:text-button-disabled-1 disabled:border-button-disabled-1"
              onClick={(e) => handleButton(e, cellData?.cell?.row?.original)}
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
    <div className="w-5/6">
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
