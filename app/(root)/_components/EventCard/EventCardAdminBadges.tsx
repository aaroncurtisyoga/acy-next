"use client";

import { FC } from "react";

interface EventCardAdminBadgesProps {
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const EventCardAdminBadges: FC<EventCardAdminBadgesProps> = ({
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className="flex justify-end pr-[30px] -mb-[1px] gap-[1px]">
      <button
        onClick={onEditClick}
        className="px-3 py-1 text-xs text-foreground-600 hover:text-foreground-800 bg-white dark:bg-gray-800 border border-divider rounded-tl-lg border-b-0 border-r-0 transition-colors duration-200 cursor-pointer"
      >
        Edit
      </button>
      <button
        onClick={onDeleteClick}
        className="px-3 py-1 text-xs text-danger-600 hover:text-danger-800 bg-white dark:bg-gray-800 border border-divider rounded-tr-lg border-b-0 transition-colors duration-200 cursor-pointer"
      >
        Delete
      </button>
    </div>
  );
};

export default EventCardAdminBadges;
