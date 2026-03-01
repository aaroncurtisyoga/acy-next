import { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CheckoutSkeleton: FC = () => {
  return (
    <div
      className={
        "flex-1 w-full border-t-2 h-[140px] p-[24px] bg-white" +
        " md:border-[1px] md:rounded-2xl" +
        " md:max-w-[360px]"
      }
    >
      <Skeleton className="mb-3 h-7 w-20 mx-auto" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
};

export default CheckoutSkeleton;
