"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
import { Button } from "@heroui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { useDisclosure } from "@heroui/modal";
import { Category } from "@prisma/client";
import BasicModal from "@/app/_components/BasicModal";
import CategoryCard from "@/app/admin/categories/_components/CategoryCard";
import { deleteCategory } from "@/app/_lib/actions/category.actions";
import { handleError } from "@/app/_lib/utils";
import { Trash2 } from "lucide-react";

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

  const handleCategoryDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    onOpen();
  };

  return (
    <>
      {/* Mobile: Cards */}
      <div className="md:hidden space-y-3 mt-2">
        {categories.map((category: Category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onDeleteClick={handleCategoryDeleteClick}
          />
        ))}
      </div>

      {/* Desktop: Table */}
      <Table
        aria-label={"Table for Managing Event Categories"}
        className={"mt-2 hidden md:table"}
      >
        <TableHeader>
          <TableColumn>Category Name</TableColumn>
          <TableColumn width={100}>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {categories.map((category: Category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={() => handleCategoryDeleteClick(category)}
                  aria-label={`Delete ${category.name}`}
                >
                  <Trash2 className="w-4 h-4" />
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
