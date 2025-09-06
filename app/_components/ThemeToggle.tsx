"use client";

import { FC, useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle: FC = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("ThemeToggle mounted:", { theme, resolvedTheme, systemTheme });
  }, [theme, resolvedTheme, systemTheme]);

  const handleThemeChange = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Theme button clicked!", {
      current: theme,
      resolved: resolvedTheme,
      system: systemTheme,
      mounted,
    });

    if (!mounted) return;

    // Simple toggle between light and dark
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    console.log("Setting theme to:", nextTheme);
    setTheme(nextTheme);
  };

  const getIcon = () => {
    if (!mounted) return <Monitor className="w-5 h-5" />;

    if (theme === "system") {
      return <Monitor className="w-5 h-5" />;
    } else if (resolvedTheme === "dark") {
      return <Moon className="w-5 h-5" />;
    } else {
      return <Sun className="w-5 h-5" />;
    }
  };

  const getThemeText = () => {
    if (!mounted) return "Theme";

    if (theme === "system") return "System";
    return resolvedTheme === "dark" ? "Dark" : "Light";
  };

  const getNextTheme = () => {
    if (theme === "light") return "dark";
    if (theme === "dark") return "system";
    return "light";
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-lg border border-gray-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
        <Monitor className="w-5 h-5" />
        <span className="text-sm font-medium">Theme</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleThemeChange}
      onTouchStart={() => {}} // Enable touch events on mobile
      className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 dark:active:bg-slate-600 transition-all duration-200 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 touch-manipulation select-none cursor-pointer"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      title={`Current: ${getThemeText()}. Click to switch.`}
      type="button"
    >
      <div className="transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
        {getIcon()}
      </div>
      <span className="text-sm font-medium">{getThemeText()}</span>
    </button>
  );
};

export default ThemeToggle;
