import { Button, Skeleton } from "@nextui-org/react";
import React from "react";

const CheckoutSkeleton: React.FC = () => {
  return (
    <Skeleton className={"rounded-xl"}>
      <Button type="button" fullWidth={true} color={"primary"}></Button>
    </Skeleton>
  );
};

export default CheckoutSkeleton;
