import { FC } from "react";
import { Table, TableBody, TableColumn, TableHeader } from "@heroui/table";
import { Spinner } from "@heroui/spinner";

interface EmptyTableProps {
  columns: Array<string>;
}

const TableLoading: FC<EmptyTableProps> = ({ columns }) => {
  return (
    <Table aria-label={"Table Loading"}>
      <TableHeader>
        {columns.map((column, index) => (
          <TableColumn key={index}>{column}</TableColumn>
        ))}
      </TableHeader>
      <TableBody emptyContent={<Spinner />}>{[]}</TableBody>
    </Table>
  );
};

export default TableLoading;
