"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
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
          <Layers size={16} className="text-muted-foreground" />
          <p className="font-medium">{category.name}</p>
        </div>
        <SimpleTooltip content="Delete">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDeleteClick(category)}
            aria-label={`Delete ${category.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </SimpleTooltip>
      </div>
    </AdminCard>
  );
};

export default CategoryCard;
