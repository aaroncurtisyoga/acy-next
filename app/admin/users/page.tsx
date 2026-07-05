import { FC } from "react";
import AdminPage from "@/app/admin/_components/AdminPage";
import ManageUsersTable from "@/app/admin/users/_components/ManageUsersTable";

const Users: FC = () => {
  return (
    <AdminPage title="Users">
      <ManageUsersTable />
    </AdminPage>
  );
};

export default Users;
