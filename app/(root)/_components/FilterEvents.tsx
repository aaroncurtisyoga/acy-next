"use client";

import { useDisclosure } from "@nextui-org/react";
import BasicModal from "@/components/shared/BasicModal";
import CategoryButtons from "@/app/(root)/_components/CategoryButtons";
import FilterButton from "@/app/(root)/_components/FilterButton";
import Search from "@/components/shared/Search";

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
