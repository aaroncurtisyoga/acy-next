"use client";

import { FC, useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle: FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with same dimensions to avoid layout shift
    return (
      <Button
        isIconOnly
        variant="light"
        className="w-10 h-10"
        aria-label="Theme toggle"
      >
        <div className="w-5 h-5" />
      </Button>
    );
  }

  const getIcon = () => {
    if (theme === "system") {
      return <Monitor className="w-5 h-5" />;
    }
    return resolvedTheme === "dark" ? (
      <Moon className="w-5 h-5" />
    ) : (
      <Sun className="w-5 h-5" />
    );
  };

  const themes = [
    { key: "light", label: "Light", icon: Sun },
    { key: "dark", label: "Dark", icon: Moon },
    { key: "system", label: "System", icon: Monitor },
  ];

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          className="w-10 h-10 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
          aria-label="Theme toggle"
        >
          {getIcon()}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme selection"
        selectedKeys={[theme || "system"]}
        selectionMode="single"
        onSelectionChange={(keys) => {
          const selectedTheme = Array.from(keys)[0] as string;
          setTheme(selectedTheme);
        }}
      >
        {themes.map((themeOption) => {
          const IconComponent = themeOption.icon;
          return (
            <DropdownItem
              key={themeOption.key}
              startContent={<IconComponent className="w-4 h-4" />}
            >
              {themeOption.label}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};

export default ThemeToggle;
