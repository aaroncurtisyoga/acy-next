"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import CategoryButtons from "@/components/events/CategoryButtons";
import Search from "@/components/shared/Search";
import FilterButton from "@/components/events/Filter/FilterButton";
import { useMediaQuery } from "usehooks-ts";

interface FilterModalProps {
  hasFiltersApplied: boolean;
  numberOfFilters: number;
}

const FilterEvents = ({
  hasFiltersApplied,
  numberOfFilters,
}: FilterModalProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <FilterButton hasFiltersApplied={hasFiltersApplied} onOpen={onOpen} />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={"center"}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl">
                Search Filters
              </ModalHeader>
              <ModalBody className={"mb-unit-10"}>
                <Search className={"mb-4"} />
                <CategoryButtons />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default FilterEvents;
