import React, { FC } from "react";
import { Table, TableBody, TableColumn, TableHeader } from "@nextui-org/react";

interface EmptyTableProps {
  columns: Array<string>;
  message: string;
}

const TableLoading: FC<EmptyTableProps> = ({ columns, message }) => {
  return (
    <Table>
      <TableHeader>
        {columns.map((column, index) => (
          <TableColumn key={index}>{column}</TableColumn>
        ))}
      </TableHeader>
      <TableBody emptyContent={`${message}`}>{[]}</TableBody>
    </Table>
  );
};

export default TableLoading;