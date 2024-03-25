interface NoEventsFoundProps {
  hasFiltersApplied: boolean;
}

const NoEventsFound = ({ hasFiltersApplied }: NoEventsFoundProps) => {
  return (
    <div className={"flex flex-col"}>
      <p className={"font-bold text-xl md:text-2xl mt-unit-3 mb-unit-1"}>
        No Events Found
      </p>
      {hasFiltersApplied ? (
        <p className={"text-default-600"}>
          Whoops... there&apos;s no events that match your search.
        </p>
      ) : (
        <p className={"text-default-600"}>
          Whoops... there aren&apos;t any events listed just yet. Check back
          soon!
        </p>
      )}
    </div>
  );
};
export default NoEventsFound;
