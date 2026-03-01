"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      <div className="flex-1 max-w-xs relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          placeholder="Search events..."
          aria-label="Search events"
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          disabled={disabled}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Select
          value={category || "all"}
          onValueChange={(value) =>
            onCategoryChange(value === "all" ? "" : value)
          }
          disabled={disabled}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={onStatusChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button
            variant="secondary"
            onClick={onClearFilters}
            disabled={disabled}
          >
            <X size={16} /> Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventTableToolbar;
