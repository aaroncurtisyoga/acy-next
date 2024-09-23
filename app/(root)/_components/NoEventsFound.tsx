import { FC } from "react";
import NoEventsCard from "@/app/(root)/_components/NoEventsCard";

interface NoEventsFoundProps {
  hasFiltersApplied: boolean;
}

const NoEventsFound: FC<NoEventsFoundProps> = ({ hasFiltersApplied }) => {
  return (
    <div className={"flex flex-col"}>
      {hasFiltersApplied ? (
        <p className={"text-default-600"}>
          Whoops... there&apos;s no events that match your search.
        </p>
      ) : (
        <NoEventsCard />
      )}
    </div>
  );
};
export default NoEventsFound;
