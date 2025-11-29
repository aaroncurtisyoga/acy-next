"use client";

import { FC } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Search, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface EventTableToolbarProps {
  searchText: string;
  category: string;
  statusFilter: string;
  categories: Category[];
  hasActiveFilters: boolean;
  disabled?: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

const EventTableToolbar: FC<EventTableToolbarProps> = ({
  searchText,
  category,
  statusFilter,
  categories,
  hasActiveFilters,
  disabled = false,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onClearFilters,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          isClearable={!disabled}
          placeholder="Search events..."
          value={searchText}
          onValueChange={onSearchChange}
          startContent={<Search className="text-default-400" size={18} />}
          className="max-w-xs"
          disabled={disabled}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Select
          placeholder="All Categories"
          className="w-44"
          selectedKeys={category ? [category] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            onCategoryChange(selected || "");
          }}
          isDisabled={disabled}
        >
          {categories.map((cat) => (
            <SelectItem key={cat.id}>{cat.name}</SelectItem>
          ))}
        </Select>
        <Select
          placeholder="Status"
          className="w-36"
          selectedKeys={[statusFilter]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            onStatusChange(selected);
          }}
          isDisabled={disabled}
        >
          <SelectItem key="all">All Events</SelectItem>
          <SelectItem key="active">Active</SelectItem>
          <SelectItem key="inactive">Inactive</SelectItem>
        </Select>
        {hasActiveFilters && (
          <Button
            color="default"
            variant="flat"
            size="md"
            startContent={<X size={16} />}
            onPress={onClearFilters}
            isDisabled={disabled}
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventTableToolbar;
