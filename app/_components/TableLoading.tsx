import { FC } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";

interface EmptyTableProps {
  columns: Array<string>;
}

const TableLoading: FC<EmptyTableProps> = ({ columns }) => {
  return (
    <Table aria-label="Table Loading">
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            <Spinner />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TableLoading;
