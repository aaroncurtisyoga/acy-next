"use client";

import { FC, useEffect, useState } from "react";
import { HiSun, HiMoon, HiComputerDesktop } from "react-icons/hi2";
import { useTheme } from "next-themes";
import { track } from "@vercel/analytics";

const ThemeToggle: FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <fieldset className="inline-flex items-center p-1 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm border border-gray-300 dark:border-slate-600">
        <div className="flex items-center gap-1">
          <div className="p-2 rounded-full">
            <HiComputerDesktop className="w-4 h-4 text-slate-500" />
          </div>
          <div className="p-2 rounded-full">
            <HiSun className="w-4 h-4 text-slate-500" />
          </div>
          <div className="p-2 rounded-full">
            <HiMoon className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </fieldset>
    );
  }

  return (
    <fieldset
      className="inline-flex items-center p-1 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm border border-gray-300 dark:border-slate-600"
      aria-label="Select theme"
    >
      <legend className="sr-only">Select a display theme:</legend>

      <div className="flex items-center gap-1">
        {/* System theme option */}
        <div className="relative">
          <input
            type="radio"
            id="theme-system"
            name="theme"
            value="system"
            checked={theme === "system"}
            onChange={() => {
              track("theme", {
                action: "theme_change",
                theme: "system",
                previous_theme: theme,
              });
              setTheme("system");
            }}
            className="sr-only peer"
            aria-label="System theme"
          />
          <label
            htmlFor="theme-system"
            className="flex items-center justify-center p-2 rounded-full cursor-pointer transition-all duration-200 
                     text-slate-500 dark:text-slate-400
                     hover:text-slate-700 dark:hover:text-slate-200
                     peer-checked:bg-gray-100 dark:peer-checked:bg-slate-700
                     peer-checked:text-slate-900 dark:peer-checked:text-slate-100
                     peer-checked:shadow-sm"
            title="Use system theme"
          >
            <HiComputerDesktop className="w-4 h-4" />
            <span className="sr-only">System theme</span>
          </label>
        </div>

        {/* Light theme option */}
        <div className="relative">
          <input
            type="radio"
            id="theme-light"
            name="theme"
            value="light"
            checked={theme === "light"}
            onChange={() => {
              track("theme", {
                action: "theme_change",
                theme: "light",
                previous_theme: theme,
              });
              setTheme("light");
            }}
            className="sr-only peer"
            aria-label="Light theme"
          />
          <label
            htmlFor="theme-light"
            className="flex items-center justify-center p-2 rounded-full cursor-pointer transition-all duration-200
                     text-slate-500 dark:text-slate-400
                     hover:text-slate-700 dark:hover:text-slate-200
                     peer-checked:bg-gray-100 dark:peer-checked:bg-slate-700
                     peer-checked:text-slate-900 dark:peer-checked:text-slate-100
                     peer-checked:shadow-sm"
            title="Light theme"
          >
            <HiSun className="w-4 h-4" />
            <span className="sr-only">Light theme</span>
          </label>
        </div>

        {/* Dark theme option */}
        <div className="relative">
          <input
            type="radio"
            id="theme-dark"
            name="theme"
            value="dark"
            checked={theme === "dark"}
            onChange={() => {
              track("theme", {
                action: "theme_change",
                theme: "dark",
                previous_theme: theme,
              });
              setTheme("dark");
            }}
            className="sr-only peer"
            aria-label="Dark theme"
          />
          <label
            htmlFor="theme-dark"
            className="flex items-center justify-center p-2 rounded-full cursor-pointer transition-all duration-200
                     text-slate-500 dark:text-slate-400
                     hover:text-slate-700 dark:hover:text-slate-200
                     peer-checked:bg-gray-100 dark:peer-checked:bg-slate-700
                     peer-checked:text-slate-900 dark:peer-checked:text-slate-100
                     peer-checked:shadow-sm"
            title="Dark theme"
          >
            <HiMoon className="w-4 h-4" />
            <span className="sr-only">Dark theme</span>
          </label>
        </div>
      </div>
    </fieldset>
  );
};

export default ThemeToggle;
