"use client";

import { Button } from "@nextui-org/react";
const EventFormStepButtons = ({ next, prev }) => {
  return (
    <div className="flex justify-between mt-8">
      <Button size="sm" variant="flat" color="primary" onPress={() => prev()}>
        Previous
      </Button>
      <Button size="sm" variant="flat" color="primary" onPress={() => next()}>
        Next
      </Button>
    </div>
  );
};

export default EventFormStepButtons;
