"use client";

import { FC, useEffect, useState } from "react";
import CreateCategory from "@/app/admin/categories/_components/CreateCategory";
import CategoryManagementTable from "@/app/admin/categories/_components/CategoryManagementTable";
import { getAllCategories } from "@/lib/actions/category.actions";
import { Category } from "@prisma/client";

const AdminCategories: FC = async () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const removeCategoryFromState = (categoryId: string) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
  };

  const addCategoryToState = (category: Category) => {
    setCategories([...categories, category]);
  };

  return (
    <div className={"wrapper"}>
      <h1 className={"text-xl mb-5"}>Categories</h1>
      <CreateCategory setCategories={setCategories} />
      {/*     <CategoryManagementTable />*/}
    </div>
  );
};

export default AdminCategories;
