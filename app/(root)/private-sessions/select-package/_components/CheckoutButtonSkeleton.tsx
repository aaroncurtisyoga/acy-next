import React from "react";
import { Button, Skeleton } from "@heroui/react";

const CheckoutSkeleton: React.FC = () => {
  return (
    <Skeleton className={"w-full max-w-[440px] mx-auto mt-10 mb-40 rounded-lg"}>
      <Button fullWidth={true}></Button>
    </Skeleton>
  );
};

export default CheckoutSkeleton;
