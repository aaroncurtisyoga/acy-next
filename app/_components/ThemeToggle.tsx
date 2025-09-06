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
    if (!mounted) return <Sun className="w-5 h-5" />;

    if (resolvedTheme === "dark") {
      return <Moon className="w-5 h-5" />;
    } else {
      return <Sun className="w-5 h-5" />;
    }
  };

  const getThemeText = () => {
    if (!mounted) return "Theme";

    return resolvedTheme === "dark" ? "Dark" : "Light";
  };

  const getNextTheme = () => {
    if (theme === "light") return "dark";
    if (theme === "dark") return "system";
    return "light";
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
        <Sun className="w-5 h-5" />
        <span className="text-sm font-medium">Light</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleThemeChange}
      onTouchStart={() => {}} // Enable touch events on mobile
      className="group flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 touch-manipulation select-none cursor-pointer"
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
