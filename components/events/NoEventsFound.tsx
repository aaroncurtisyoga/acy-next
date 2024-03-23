interface NoEventsFoundProps {
  hasFilteredSearch: boolean;
}

const NoEventsFound = ({ hasFilteredSearch }: NoEventsFoundProps) => {
  return (
    <div className={"flex flex-col items-center"}>
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
