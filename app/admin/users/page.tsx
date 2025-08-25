import React, { FC } from "react";
import ManageUsersTable from "@/app/admin/users/_components/ManageUsersTable";

const Users: FC = () => {
  return (
    <div className={"wrapper"}>
      <h1 className={"text-xl my-5 text-foreground"}>Users Page</h1>
      <ManageUsersTable />
    </div>
  );
};

export default Users;
