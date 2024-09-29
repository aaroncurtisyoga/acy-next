"use client";

import { FC } from "react";
import {
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { TableManageUsersColumns } from "@/_lib/constants";
import { Trash2 } from "lucide-react";

const ManageUsersTable: FC = () => {
  const users = [];

  return (
    <>
      <Table aria-label={"Table for Managing Users"} className={"mt-5"}>
        <TableHeader>
          {TableManageUsersColumns.map((column) => (
            <TableColumn key={column}>{column}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableColumn>{user.firstName}</TableColumn>
              <TableColumn>{user.lastName}</TableColumn>
              <TableColumn>{user.email}</TableColumn>
              <TableColumn>{user.id}</TableColumn>
              <TableColumn>
                <Tooltip content={"Delete"}>
                  <span className="text-lg text-danger-600 cursor-pointer active:opacity-50">
                    <Trash2
                      size={16}
                      onClick={() => {
                        console.log("Delete user");
                      }}
                    />
                  </span>
                </Tooltip>
              </TableColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ManageUsersTable;
