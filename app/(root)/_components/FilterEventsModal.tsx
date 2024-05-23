"use client";

import { useDisclosure } from "@nextui-org/react";
import BasicModal from "@/components/BasicModal";
import CategoryButtons from "@/app/(root)/_components/CategoryButtons";
import FilterButton from "@/app/(root)/_components/FilterButton";
import SearchEvents from "@/app/(root)/_components/SearchEvents";

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
          <SearchEvents className={"mb-4"} />
          <CategoryButtons />
        </div>
      </BasicModal>
    </>
  );
};

export default FilterEventsModal;
