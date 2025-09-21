"use client";

import { FC } from "react";

interface AnimatedHamburgerProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

const AnimatedHamburger: FC<AnimatedHamburgerProps> = ({
  isOpen,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-10 h-10 flex flex-col justify-center items-center gap-1.5 p-2 rounded-xl transition-all duration-300 ${
        isOpen
          ? "bg-primary-50 dark:bg-primary-900/20"
          : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
      } ${className}`}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      data-testid="menu-toggle"
    >
      <span
        className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full transition-all duration-300 ease-out ${
          isOpen ? "rotate-45 translate-y-2" : ""
        }`}
      />
      <span
        className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full transition-all duration-300 ease-out ${
          isOpen ? "opacity-0 scale-x-0" : ""
        }`}
      />
      <span
        className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full transition-all duration-300 ease-out ${
          isOpen ? "-rotate-45 -translate-y-2" : ""
        }`}
      />
    </button>
  );
};

export default AnimatedHamburger;
