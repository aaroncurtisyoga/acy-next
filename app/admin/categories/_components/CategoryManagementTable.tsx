"use client";

import { FC, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Category } from "@prisma/client";
import { getAllCategories } from "@/lib/actions/category.actions";

const CategoryManagementTable: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <Table
      aria-label={"Table for Managing Event Categories"}
      className={"mt-5"}
    >
      <TableHeader>
        <TableColumn>Id</TableColumn>
        <TableColumn>Name</TableColumn>
      </TableHeader>
      <TableBody>
        {categories.map((category: Category) => (
          <TableRow key={category.id}>
            <TableCell>{category.id}</TableCell>
            <TableCell>{category.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CategoryManagementTable;
