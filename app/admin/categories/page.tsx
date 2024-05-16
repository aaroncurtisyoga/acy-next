import { FC } from "react";
import CreateCategory from "@/app/admin/categories/_components/CreateCategory";

const AdminCategories: FC = () => {
  return (
    <div className={"wrapper"}>
      <h1 className={"text-xl mb-5"}>Categories</h1>
      <ul>
        <CreateCategory />
        <li>list of categories</li>
        <li>delete category</li>
        <li>edit category</li>
      </ul>
    </div>
  );
};

export default AdminCategories;
