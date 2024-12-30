"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
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
import BasicModal from "@/app/_components/BasicModal";
import { deleteCategory } from "@/app/_lib/actions/category.actions";
import { handleError } from "@/app/_lib/utils";

interface CategoryManagementTableProps {
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
}

const TableCategoryManagement: FC<CategoryManagementTableProps> = ({
  categories,
  setCategories,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [categoryToDelete, setCategoryToDelete] = useState<Category>();

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const result = await deleteCategory(categoryId);
      if (result.status) {
        setCategories((prev) =>
          prev.filter((category) => category.id !== categoryId),
        );
        onOpenChange();
      }
    } catch (error) {
      handleError(error);
    }
  };

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
      <BasicModal
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        header={"Delete Category"}
        primaryAction={() => handleDeleteCategory(categoryToDelete?.id)}
        primaryActionLabel={"Delete Category"}
      >
        <div>
          <p>Are you sure you want to delete this Category?</p>
          <p>{categoryToDelete?.name}</p>
        </div>
      </BasicModal>
    </>
  );
};
export default TableCategoryManagement;
