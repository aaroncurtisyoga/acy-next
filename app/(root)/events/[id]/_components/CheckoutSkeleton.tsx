import { FC } from "react";
import { Button, Skeleton } from "@heroui/react";

const CheckoutSkeleton: FC = () => {
  return (
    <div
      className={
        "flex-1 w-full border-t-2 h-[140px] p-[24px] bg-white" +
        " md:border-[1px] md:rounded-2xl" +
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
