"use client";

import { Button } from "@nextui-org/react";
import { SlidersHorizontal } from "lucide-react";

interface FilterButtonProps {
  hasFiltersApplied: boolean;
  isMobile: boolean;
  numberOfFilters: number;
  onOpen: () => void;
}

const FilterButton = ({
  hasFiltersApplied,
  isMobile,
  numberOfFilters,
  onOpen,
}: FilterButtonProps) => {
  return (
    <Button
      color={hasFiltersApplied ? "primary" : "default"}
      onPress={onOpen}
      radius={"full"}
      size={"sm"}
      startContent={<SlidersHorizontal size={14} />}
      type={"button"}
      variant={hasFiltersApplied ? "solid" : "bordered"}
      {...(isMobile ? { isIconOnly: true } : {})}
    >
      {isMobile ? null : (
        <p>Filters {hasFiltersApplied && ` (${numberOfFilters})`}</p>
      )}
    </Button>
  );
};

export default FilterButton;
