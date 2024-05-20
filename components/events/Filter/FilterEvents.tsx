"use client";

import { useDisclosure } from "@nextui-org/react";
import CategoryButtons from "@/components/events/CategoryButtons";
import Search from "@/components/shared/Search";
import FilterButton from "@/components/events/Filter/FilterButton";
import BasicModal from "@/components/shared/BasicModal";

interface FilterModalProps {
  hasFiltersApplied: boolean;
}

const FilterEvents = ({ hasFiltersApplied }: FilterModalProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <FilterButton hasFiltersApplied={hasFiltersApplied} onOpen={onOpen} />
      <BasicModal
        header={"Search Filters"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement={"center"}
        primaryActionLabel={"Filter"}
        hideButtons
      >
        <div>
          <Search className={"mb-4"} />
          <CategoryButtons />
        </div>
      </BasicModal>
    </>
  );
};

export default FilterEvents;
