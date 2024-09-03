import { Button, Skeleton, Spinner } from "@nextui-org/react";
import React from "react";

const SkeletonButton: React.FC = () => {
  return (
    <Skeleton className={"rounded-xl"}>
      <Button type="button" fullWidth={true} color={"primary"}></Button>
    </Skeleton>
  );
};

export default SkeletonButton;
