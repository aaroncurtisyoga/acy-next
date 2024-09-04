import { Button, Skeleton } from "@nextui-org/react";
import React from "react";

const CheckoutSkeleton: React.FC = () => {
  return (
    <Skeleton className={"rounded-xl"}>
      <Button fullWidth={true}></Button>
    </Skeleton>
  );
};

export default CheckoutSkeleton;
