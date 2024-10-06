"use client";

import { FC, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import TableEmpty from "@/_components/TableEmpty";
import TableLoading from "@/_components/TableLoading";
import { getAllUsers } from "@/_lib/actions/user.actions";
import { TableManageUsersColumns } from "@/_lib/constants";
import { handleError } from "@/_lib/utils";

const ManageUsersTable: FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, totalPages } = await getAllUsers({
          limit: 8,
          page,
          query: searchText,
        });
        setUsers(data);
        setTotalPages(totalPages);
        setLoading(false);
      } catch (error) {
        handleError("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, [page, searchText]);

  if (loading) {
    return <TableLoading columns={TableManageUsersColumns} />;
  }

  if (!users.length) {
    return (
      <TableEmpty
        columns={TableManageUsersColumns}
        message={"No users in the system yet"}
      />
    );
  }

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
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.id}</TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ManageUsersTable;
