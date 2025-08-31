"use client";

import { useDisclosure } from "@heroui/react";
import CategoryButtons from "@/app/(root)/_components/CategoryButtons";
import FilterButton from "@/app/(root)/_components/FilterButton";
import SearchEvents from "@/app/(root)/_components/SearchEvents";
import BasicModal from "@/app/_components/BasicModal";

interface FilterModalProps {
  hasFiltersApplied: boolean;
}

const FilterEventsModal = ({ hasFiltersApplied }: FilterModalProps) => {
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
          <SearchEvents />
          <CategoryButtons />
        </div>
      </BasicModal>
    </>
  );
};

export default FilterEventsModal;
