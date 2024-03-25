import Image from "next/image";
import noResultsFoundImg from "../../public/assets/images/desert.png";

// Then in your component
interface NoEventsFoundProps {
  hasFiltersApplied: boolean;
}

const NoEventsFound = ({ hasFiltersApplied }: NoEventsFoundProps) => {
  return (
    <div className={"flex flex-col items-center"}>
      <Image
        loading={"eager"}
        width={347}
        height={249}
        src={noResultsFoundImg.src}
        alt={"No events found"}
        className={"w-1/2 md:w-3/4"}
      />
      <p className={"text-center font-bold text-xl md:text-2xl"}>
        No Events Found
      </p>
      {hasFiltersApplied ? (
        <p>Whoops... there&apos;`s no events that match your search</p>
      ) : (
        <p className={"text-center text-default-600"}>
          Whoops... there aren&apos;t any events listed just yet. Check back
          soon!
        </p>
      )}
    </div>
  );
};
export default NoEventsFound;
