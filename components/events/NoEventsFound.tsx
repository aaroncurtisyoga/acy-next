interface NoEventsFoundProps {
  hasFiltersApplied: boolean;
}

const NoEventsFound = ({ hasFiltersApplied }: NoEventsFoundProps) => {
  return (
    <div className={"flex flex-col"}>
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
