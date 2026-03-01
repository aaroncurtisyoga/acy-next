"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/app/_lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  className?: string;
  error?: string;
  required?: boolean;
  granularity?: "day" | "minute";
}

export function DateTimePicker({
  value,
  onChange,
  label,
  placeholder = "Pick a date",
  disabled,
  minDate,
  className,
  error,
  required,
  granularity = "minute",
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const hours = value ? value.getHours() : 12;
  const minutes = value ? value.getMinutes() : 0;

  const handleDateSelect = (day: Date | undefined) => {
    if (!day) {
      onChange?.(undefined);
      return;
    }
    // Preserve existing time when selecting a new date
    const newDate = new Date(day);
    if (value) {
      newDate.setHours(value.getHours(), value.getMinutes(), 0, 0);
    } else {
      newDate.setHours(12, 0, 0, 0);
    }
    onChange?.(newDate);
  };

  const handleTimeChange = (type: "hours" | "minutes", val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) return;
    const date = value ? new Date(value) : new Date();
    if (type === "hours") {
      date.setHours(Math.max(0, Math.min(23, num)));
    } else {
      date.setMinutes(Math.max(0, Math.min(59, num)));
    }
    date.setSeconds(0, 0);
    onChange?.(date);
  };

  const displayValue = value
    ? granularity === "minute"
      ? format(value, "MMM d, yyyy h:mm a")
      : format(value, "MMM d, yyyy")
    : undefined;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className={cn(error && "text-destructive")}>
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-destructive",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue ?? <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            disabled={
              minDate
                ? (date) => date < new Date(minDate.setHours(0, 0, 0, 0))
                : undefined
            }
            defaultMonth={value}
          />
          {granularity === "minute" && (
            <div className="border-t p-3 flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Time:</Label>
              <Input
                type="number"
                min={0}
                max={23}
                value={hours.toString().padStart(2, "0")}
                onChange={(e) => handleTimeChange("hours", e.target.value)}
                className="w-16 h-8 text-center"
              />
              <span className="text-muted-foreground">:</span>
              <Input
                type="number"
                min={0}
                max={59}
                value={minutes.toString().padStart(2, "0")}
                onChange={(e) => handleTimeChange("minutes", e.target.value)}
                className="w-16 h-8 text-center"
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
