"use client";

import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SimpleTooltipProps {
  content: string;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export function SimpleTooltip({ content, children, side }: SimpleTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </Tooltip>
  );
}
