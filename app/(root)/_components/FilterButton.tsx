"use client";

import { Button } from "@heroui/react";
import { SlidersHorizontal } from "lucide-react";

interface FilterButtonProps {
  hasFiltersApplied: boolean;
  onOpen: () => void;
}

const FilterButton = ({ hasFiltersApplied, onOpen }: FilterButtonProps) => {
  return (
    <Button
      color={hasFiltersApplied ? "primary" : "default"}
      onPress={onOpen}
      radius={"full"}
      size={"sm"}
      startContent={<SlidersHorizontal size={14} />}
      type={"button"}
      variant={hasFiltersApplied ? "solid" : "flat"}
      isIconOnly={true}
      aria-label={"Filter events"}
    />
  );
};

export default FilterButton;
