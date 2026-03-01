"use client";

import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

interface FilterButtonProps {
  hasFiltersApplied: boolean;
  onOpen: () => void;
}

const FilterButton = ({ hasFiltersApplied, onOpen }: FilterButtonProps) => {
  return (
    <Button
      variant={hasFiltersApplied ? "default" : "secondary"}
      onClick={onOpen}
      size="icon"
      className="rounded-full h-8 w-8"
      type="button"
      aria-label="Filter events"
    >
      <SlidersHorizontal size={14} />
    </Button>
  );
};

export default FilterButton;
