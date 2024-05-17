import { FC } from "react";
import CreateCategory from "@/app/admin/categories/_components/CreateCategory";
import CategoryManagementTable from "@/app/admin/categories/_components/CategoryManagementTable";

const AdminCategories: FC = () => {
  return (
    <div className={"wrapper"}>
      <h1 className={"text-xl mb-5"}>Categories</h1>
      <ul>
        <CreateCategory />
        <CategoryManagementTable />
      </ul>
    </div>
  );
};

export default AdminCategories;
