"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { SlidersHorizontal } from "lucide-react";
import CategoryButtons from "@/components/events/CategoryButtons";
import Search from "@/components/shared/Search";

interface FilterModalProps {
  hasFiltersApplied: boolean;
  numberOfFilters: number;
}
const FilterModal = ({
  hasFiltersApplied,
  numberOfFilters,
}: FilterModalProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color={hasFiltersApplied ? "primary" : "default"}
        startContent={<SlidersHorizontal />}
        onPress={onOpen}
        radius={"full"}
        type={"button"}
        variant={hasFiltersApplied ? "solid" : "bordered"}
      >
        Filters
        {hasFiltersApplied && `(${numberOfFilters})`}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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

export default FilterModal;
