import { FC, PropsWithChildren } from "react";
import { CircleAlert } from "lucide-react";

const Error: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col justify-center items-center text-center max-w-4xl mx-auto my-16 gap-4 px-3">
      <CircleAlert className={"text-yellow-500"} size={100} />
      {children}
    </div>
  );
};
export default Error;
