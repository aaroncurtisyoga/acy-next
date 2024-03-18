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
import CategoryFilter from "@/components/events/CategoryFilter";
import Search from "@/components/shared/Search";

const FilterModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color="default"
        endContent={<SlidersHorizontal />}
        onPress={onOpen}
        radius={"full"}
        type={"button"}
        variant="light"
      >
        Filters
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl">
                Search Filters
              </ModalHeader>
              <ModalBody>
                <Search />
                <CategoryFilter />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default FilterModal;
