import React from "react";
import { Button, Skeleton } from "@heroui/react";

const CheckoutSkeleton: React.FC = () => {
  return (
    <div
      className={
        "flex-1 w-full border-t-2 h-[140px] p-[24px] fixed bottom-0 z-10 bg-white" +
        " md:border-[1px] md:rounded-2xl md:relative" +
        " md:max-w-[360px]"
      }
    >
      <Skeleton className={"mb-3"}>
        <p className={"text-center text-lg"}>$</p>
      </Skeleton>
      <Skeleton>
        <Button
          type="button"
          fullWidth={true}
          color={"primary"}
          className={"rounded-xl"}
        ></Button>
      </Skeleton>
    </div>
  );
};

export default CheckoutSkeleton;
