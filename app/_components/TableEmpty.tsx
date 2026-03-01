import { FC } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface EmptyTableProps {
  columns: Array<string>;
  message: string;
}

const TableEmpty: FC<EmptyTableProps> = ({ columns, message }) => {
  return (
    <Table aria-label="Table Empty">
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={columns.length}
            className="h-24 text-center text-muted-foreground"
          >
            {message}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TableEmpty;
