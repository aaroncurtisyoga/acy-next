"use client";

import { FC } from "react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Trash2, Layers } from "lucide-react";
import { Category } from "@prisma/client";
import AdminCard from "@/app/admin/_components/AdminCard";

interface CategoryCardProps {
  category: Category;
  onDeleteClick: (category: Category) => void;
}

const CategoryCard: FC<CategoryCardProps> = ({ category, onDeleteClick }) => {
  return (
    <AdminCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-default-400" />
          <p className="font-medium">{category.name}</p>
        </div>
        <Tooltip content="Delete">
          <Button
            isIconOnly
            size="sm"
            color="danger"
            variant="light"
            onPress={() => onDeleteClick(category)}
            aria-label={`Delete ${category.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
    </AdminCard>
  );
};

export default CategoryCard;
