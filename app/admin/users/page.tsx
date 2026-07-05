import { FC } from "react";
import ManageUsersTable from "@/app/admin/users/_components/ManageUsersTable";

const Users: FC = () => {
  return (
    <div className={"wrapper"}>
      <h1 className="my-5 font-display text-3xl uppercase text-foreground">
        Users
      </h1>
      <ManageUsersTable />
    </div>
  );
};

export default Users;
