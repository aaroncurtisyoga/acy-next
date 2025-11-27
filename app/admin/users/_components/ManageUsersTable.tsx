"use client";

import { FC, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import { useDisclosure } from "@heroui/modal";
import { Trash2 } from "lucide-react";
import BasicModal from "@/app/_components/BasicModal";
import TableEmpty from "@/app/_components/TableEmpty";
import TableLoading from "@/app/_components/TableLoading";
import { deleteUser, getAllUsers } from "@/app/_lib/actions/user.actions";
import { TableManageUsersColumns } from "@/app/_lib/constants";
import { handleError } from "@/app/_lib/utils";

const ManageUsersTable: FC = () => {
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  // const [totalPages, setTotalPages] = useState(0); // Unused - for future pagination
  const [page /*, setPage */] = useState(1); // setPage for future pagination
  const [searchText /*, setSearchText */] = useState(""); // setSearchText for future search

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data /* , totalPages */ } = await getAllUsers({
          limit: 8,
          page,
          query: searchText,
        });
        setUsers(data);
        // setTotalPages(totalPages); // Unused - for future pagination
        setLoading(false);
      } catch (error) {
        handleError("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, [page, searchText]);

  const handleDeleteUser = async () => {
    const response = await deleteUser(selectedUser.id);

    if (response.success) {
      onOpenChange();
      setUsers(users.filter((user) => user.id !== selectedUser.id));
    } else {
      //   Todo: Toast notification saying there was an error
    }
  };

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
                        setSelectedUser(user);
                        onOpen();
                      }}
                    />
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <BasicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        header={<h1>Confirm deletion of User</h1>}
        primaryAction={handleDeleteUser}
        primaryActionLabel={"Delete"}
      >
        {selectedUser && (
          <div>
            <p className={"mb-5"}>Are you sure you want to delete user?</p>
            <p>
              {selectedUser.firstName} {selectedUser.lastName}
            </p>
            <p>{selectedUser.email}</p>
          </div>
        )}
      </BasicModal>
    </>
  );
};

export default ManageUsersTable;
