"use client";

import { FC, useEffect, useState } from "react";
import { Category } from "@prisma/client";
import { getAllCategories } from "@/app/_lib/actions/category.actions";
import TableCategoryManagement from "@/app/admin/categories/_components/TableCategoryManagement";

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
      <TableCategoryManagement
        categories={categories}
        setCategories={setCategories}
      />
    </div>
  );
};

export default AdminCategories;
