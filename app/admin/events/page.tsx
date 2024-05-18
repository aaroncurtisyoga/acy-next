import { FC } from "react";
import TableEventManagement from "@/app/admin/events/_components/TableEventManagement";

const AdminEventsPage: FC = () => {
  return (
    <div className={"wrapper"}>
      <h1 className={"text-xl my-5"}>Admin Events Page</h1>
      <TableEventManagement />
    </div>
  );
};

export default AdminEventsPage;
