"use client";

import { FC } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Minus, Plus } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";
import {
  MIN_SESSIONS,
  MAX_SESSIONS,
  POPULAR_SESSION_COUNTS,
} from "@/app/(root)/private-sessions/_lib/constants";
import {
  calculateSessionPricing,
  getNextDiscountTier,
} from "@/app/(root)/private-sessions/_lib/helpers";
import { SessionType } from "@/app/(root)/private-sessions/_lib/types";
import { track } from "@vercel/analytics";

interface SessionCountSelectorProps {
  sessionType: SessionType;
  name: string;
}

const SessionCountSelector: FC<SessionCountSelectorProps> = ({
  sessionType,
  name,
}) => {
  const { control } = useFormContext();
  const { field } = useController({ name, control });

  const sessionCount = field.value || 1;
  const pricing = calculateSessionPricing(sessionType, sessionCount);
  const nextTier = getNextDiscountTier(sessionType, sessionCount);

  const increment = () => {
    if (sessionCount < MAX_SESSIONS) {
      track("private_sessions", {
        action: "session_count_increment",
        session_type: sessionType,
        from_count: sessionCount,
        to_count: sessionCount + 1,
      });
      field.onChange(sessionCount + 1);
    }
  };

  const decrement = () => {
    if (sessionCount > MIN_SESSIONS) {
      track("private_sessions", {
        action: "session_count_decrement",
        session_type: sessionType,
        from_count: sessionCount,
        to_count: sessionCount - 1,
      });
      field.onChange(sessionCount - 1);
    }
  };

  const setCount = (count: number) => {
    track("private_sessions", {
      action: "session_count_preset_select",
      session_type: sessionType,
      from_count: sessionCount,
      to_count: count,
    });
    field.onChange(count);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Popular choices */}
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
          Popular choices:
        </p>
        <div className="flex gap-2 justify-center">
          {POPULAR_SESSION_COUNTS.map((count) => (
            <Button
              key={count}
              variant={sessionCount === count ? "solid" : "bordered"}
              color={sessionCount === count ? "primary" : "default"}
              size="sm"
              onPress={() => setCount(count)}
              className="min-w-12"
            >
              {count}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom counter */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardBody className="p-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              isIconOnly
              variant="bordered"
              onPress={decrement}
              isDisabled={sessionCount <= MIN_SESSIONS}
              className="border-gray-200 dark:border-gray-700"
            >
              <Minus size={16} />
            </Button>

            <div className="text-center min-w-[100px]">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-200">
                {sessionCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                session{sessionCount !== 1 ? "s" : ""}
              </div>
            </div>

            <Button
              isIconOnly
              variant="bordered"
              onPress={increment}
              isDisabled={sessionCount >= MAX_SESSIONS}
              className="border-gray-200 dark:border-gray-700"
            >
              <Plus size={16} />
            </Button>
          </div>

          {/* Pricing */}
          <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-200">
              ${pricing.totalPrice}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              ${pricing.pricePerSession}/session
            </div>

            {pricing.discount && (
              <div className="text-green-600 dark:text-green-400 text-sm font-medium mt-1">
                {pricing.discount.label} • Save ${pricing.discount.amount}
              </div>
            )}

            {nextTier && (
              <div className="text-blue-600 dark:text-blue-400 text-xs mt-2">
                Book {nextTier.minSessions}+ sessions to get {nextTier.label}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SessionCountSelector;
