import { Button } from "@nextui-org/react";
import { SlidersHorizontal } from "lucide-react";

const FilterModal = () => {
  return (
    <>
      <Button
        variant="light"
        color="default"
        endContent={<SlidersHorizontal />}
      >
        Filters
      </Button>
    </>
  );
};

export default FilterModal;
