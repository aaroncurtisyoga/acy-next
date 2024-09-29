"use client";

import { FC } from "react";
import { Table, TableColumn, TableHeader } from "@nextui-org/react";
import { TableManageUsersColumns } from "@/_lib/constants";

const ManageUsersTable: FC = () => {
  return (
    <>
      <Table aria-label={"Table for Managing Users"} className={"mt-5"}></Table>
      <TableHeader>
        {TableManageUsersColumns.map((column) => (
          <TableColumn key={column}>{column}</TableColumn>
        ))}
      </TableHeader>
    </>
  );
};

export default ManageUsersTable;
