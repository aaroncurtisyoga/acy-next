import React from "react";
import { Button, Skeleton } from "@heroui/react";

const CheckoutSkeleton: React.FC = () => {
  return (
    <Skeleton className={"w-full max-w-[440px] mx-auto rounded-lg"}>
      <Button
        type="button"
        fullWidth={true}
        color="primary"
        className="font-medium [&:hover]:bg-[#1a5bb8] [&:hover]:text-white transition-colors rounded-lg"
        isDisabled
      >
        Loading...
      </Button>
    </Skeleton>
  );
};

export default CheckoutSkeleton;
