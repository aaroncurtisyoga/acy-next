import { FC } from "react";
import { Card, CardBody } from "@heroui/card";

interface EmptyEventsStateProps {
  hasFiltersApplied: boolean;
}

const EmptyEventsState: FC<EmptyEventsStateProps> = ({ hasFiltersApplied }) => {
  return (
    <Card className="flex-1 border border-gray-200 dark:border-gray-800 shadow-none rounded-2xl transition-all duration-300 @container">
      <CardBody className="flex flex-col items-center justify-center text-center py-16 px-6 @sm:py-20 @sm:px-8">
        <h3 className="text-xl @sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          No Events Found
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-base @sm:text-lg leading-relaxed font-medium @sm:px-10">
          {hasFiltersApplied
            ? "No events match your current filters. Try adjusting them to see more events."
            : "There aren't any events scheduled at the moment. Check back soon for upcoming yoga sessions and workshops!"}
        </p>
      </CardBody>
    </Card>
  );
};

export default EmptyEventsState;
