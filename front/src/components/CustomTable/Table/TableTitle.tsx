import React from "react";

interface IProps {
  title: String;
}

export const TableTitle: React.FC<IProps> = ({ title }) => {
  return (
    <header className="w-full p-6 text-4xl font-semibold border-b-2">
      <h1>{title}</h1>
    </header>
  );
};
