"use client";

import { FC, useEffect, useState } from "react";
import CreateCategory from "@/app/admin/categories/_components/CreateCategory";
import TableCategoryManagement from "@/app/admin/categories/_components/TableCategoryManagement";
import { getAllCategories } from "@/lib/actions/category.actions";
import { Category } from "@prisma/client";

const AdminCategories: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <div className={"wrapper"}>
      <h1 className={"text-xl mb-5"}>Categories</h1>
      <CreateCategory setCategories={setCategories} />
      <TableCategoryManagement
        categories={categories}
        setCategories={setCategories}
      />
    </div>
  );
};

export default AdminCategories;
