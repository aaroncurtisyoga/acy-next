"use client";
import { FC, useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { Category } from "@prisma/client";
import { getAllCategories } from "@/lib/actions/category.actions";
import ModalToDeleteCategory from "@/app/admin/categories/_components/ModalToDeleteCategory";

const CategoryManagementTable: FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [categoryToDelete, setCategoryToDelete] = useState<Category>();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <>
      <Table
        aria-label={"Table for Managing Event Categories"}
        className={"mt-5"}
      >
        <TableHeader>
          <TableColumn>Id</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Delete</TableColumn>
        </TableHeader>
        <TableBody>
          {categories.map((category: Category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                <Button
                  size={"sm"}
                  onPress={() => {
                    onOpen();
                    setCategoryToDelete(category);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ModalToDeleteCategory
        category={categoryToDelete}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
};
export default CategoryManagementTable;
