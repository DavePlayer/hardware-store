import React from "react";
import { TableTitle } from "./Table/TableTitle";
import { CellProps, Column, useSortBy, useTable } from "react-table";

interface IProps {
    title: String;
    buttonName: String;
    handleCustomButton: (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        ...args: [any]
    ) => void;
    columns: Column<any>[];
    data: any;
}

export const Table: React.FC<IProps> = ({
    title,
    buttonName,
    handleCustomButton,
    columns,
    data,
}) => {
    const table = useTable({ columns, data }, useSortBy);
    return (
        <>
            <TableTitle title={title} />
            <section className="flex justify-center items-center">
                {table.rows.length <= 0 ? (
                    <h1 className="text-3xl mt-4">
                        Ups. looks like there is no product in this table
                    </h1>
                ) : (
                    <table
                        className="w-11/12 text-lg font-normal rounded-lg overflow-hidden mt-8"
                        {...table.getTableProps()}
                    >
                        <thead className="sticky top-[0px]">
                            {table.headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            className="font-medium bg-slate-100 p-3 first:rounded-s-lg last:rounded-e-lg"
                                            {...column.getHeaderProps(
                                                column.getSortByToggleProps()
                                            )}
                                        >
                                            <span className="flex no-tap gap-1 justify-start items-center">
                                                {column.render("Header")}
                                                {/* checking if column is sorted */}
                                                {column.isSorted ? (
                                                    // checking sorting type and adding by it proper svg icon
                                                    column.isSortedDesc ? (
                                                        <svg
                                                            className="h-[1rem]"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M12 3.202l3.839 4.798h-7.678l3.839-4.798zm0-3.202l-8 10h16l-8-10zm8 14h-16l8 10 8-10z" />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            className="h-[1rem]"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M12 0l-8 10h16l-8-10zm3.839 16l-3.839 4.798-3.839-4.798h7.678zm4.161-2h-16l8 10 8-10z" />
                                                        </svg>
                                                    )
                                                ) : (
                                                    // it's hacky way of not adding svg if column is not sortable
                                                    column.canSort && (
                                                        <svg
                                                            className="h-[1rem]"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M12 3.202l3.839 4.798h-7.678l3.839-4.798zm0-3.202l-8 10h16l-8-10zm3.839 16l-3.839 4.798-3.839-4.798h7.678zm4.161-2h-16l8 10 8-10z" />
                                                        </svg>
                                                    )
                                                )}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...table.getTableBodyProps()}>
                            {table.rows.map((row) => {
                                table.prepareRow(row);
                                return (
                                    <tr className="border-b-2" {...row.getRowProps()}>
                                        {row.cells.map((cell) => {
                                            return (
                                                <td className="p-4" {...cell.getCellProps()}>
                                                    {cell.render("Cell")}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </section>
        </>
    );
};
