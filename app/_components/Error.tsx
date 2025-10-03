import { FC, PropsWithChildren } from "react";
import { CircleAlert } from "lucide-react";

const Error: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col justify-center items-center text-center max-w-4xl mx-auto my-16 gap-6 px-4">
      <div className="relative">
        <CircleAlert
          className="text-yellow-500 dark:text-yellow-400 animate-pulse"
          size={100}
        />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};
export default Error;
