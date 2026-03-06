"use client";

import { FC, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { useDisclosure } from "@/app/_hooks/useDisclosure";
import { Trash2 } from "lucide-react";
import BasicModal from "@/app/_components/BasicModal";
import TableEmpty from "@/app/_components/TableEmpty";
import TableLoading from "@/app/_components/TableLoading";
import UserManagementCard from "@/app/admin/users/_components/UserManagementCard";
import { deleteUser, getAllUsers } from "@/app/_lib/actions/user.actions";
import { TableManageUsersColumns } from "@/app/_lib/constants";
import { handleError } from "@/app/_lib/utils";

const ManageUsersTable: FC = () => {
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [page /*, setPage */] = useState(1);
  const [searchText /*, setSearchText */] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getAllUsers({
          limit: 8,
          page,
          query: searchText,
        });
        setUsers(data);
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
    }
  };

  if (loading) {
    return <TableLoading columns={TableManageUsersColumns} />;
  }

  const handleUserDeleteClick = (user: any) => {
    setSelectedUser(user);
    onOpen();
  };

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
      {/* Mobile: Cards */}
      <div className="md:hidden space-y-3 mt-5">
        {users.map((user) => (
          <UserManagementCard
            key={user.id}
            user={user}
            onDeleteClick={handleUserDeleteClick}
          />
        ))}
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:block mt-5">
        <Table aria-label="Table for Managing Users">
          <TableHeader>
            <TableRow>
              {TableManageUsersColumns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <SimpleTooltip content="Delete">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      aria-label="Delete user"
                      onClick={() => handleUserDeleteClick(user)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </SimpleTooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
