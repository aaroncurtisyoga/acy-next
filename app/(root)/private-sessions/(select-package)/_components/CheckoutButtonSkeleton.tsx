import { Button, Skeleton } from "@nextui-org/react";
import React from "react";

const CheckoutSkeleton: React.FC = () => {
  return (
    <Skeleton className={"w-full max-w-[440px] mx-auto mt-10 mb-40 rounded-xl"}>
      <Button fullWidth={true}></Button>
    </Skeleton>
  );
};

export default CheckoutSkeleton;
