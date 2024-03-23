import Image from "next/image";
import desertLandscapeImage from "@/public/assets/images/ desertlandscape.png";

interface NoEventsFoundProps {
  hasFilteredSearch: boolean;
}

const NoEventsFound = ({ hasFilteredSearch }: NoEventsFoundProps) => {
  return (
    <div className={"flex flex-col items-center"}>
      <Image
        width={500}
        src={desertLandscapeImage}
        alt={"No events found"}
        className={"w-1/2 md:w-3/4"}
      />
      <p className={"text-center font-bold text-xl md:text-2xl"}>
        No Events Found
      </p>
      {hasFilteredSearch ? (
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
