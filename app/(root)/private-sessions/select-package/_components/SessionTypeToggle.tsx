"use client";

import { FC } from "react";
import { User, Users } from "lucide-react";

interface SessionTypeToggleProps {
  sessionType: "individual" | "group";
  onSessionTypeChange: (type: "individual" | "group") => void;
}

const SessionTypeToggle: FC<SessionTypeToggleProps> = ({
  sessionType,
  onSessionTypeChange,
}) => {
  const baseButtonClass =
    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300";
  const activeClass = "bg-white text-blue-600 shadow-md border border-blue-200";
  const inactiveClass =
    "bg-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50";

  return (
    <div className="flex gap-2 mt-2 sm:mt-0 bg-gray-100 p-1 rounded-full">
      <button
        onClick={() => onSessionTypeChange("individual")}
        className={`${baseButtonClass} ${sessionType === "individual" ? activeClass : inactiveClass}`}
      >
        <div className="flex items-center gap-2">
          <User
            size={16}
            className={sessionType === "individual" ? "text-blue-600" : ""}
          />
          <span>Individual</span>
        </div>
      </button>
      <button
        onClick={() => onSessionTypeChange("group")}
        className={`${baseButtonClass} ${sessionType === "group" ? activeClass : inactiveClass}`}
      >
        <div className="flex items-center gap-2">
          <Users
            size={16}
            className={sessionType === "group" ? "text-blue-600" : ""}
          />
          <span>Group</span>
        </div>
      </button>
    </div>
  );
};

export default SessionTypeToggle;
