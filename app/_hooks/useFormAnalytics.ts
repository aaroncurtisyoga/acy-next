"use client";

import { useCallback, useEffect, useRef } from "react";
import { track } from "@vercel/analytics";

interface FormAnalyticsOptions {
  formName: string;
  fields?: string[];
  trackFieldInteractions?: boolean;
}

export const useFormAnalytics = ({
  formName,
  // fields = [],
  trackFieldInteractions = false,
}: FormAnalyticsOptions) => {
  const formStartTimeRef = useRef<number | null>(null);
  const fieldInteractionsRef = useRef<Record<string, number>>({});

  const trackFormStart = () => {
    formStartTimeRef.current = Date.now();
    track("form_start", {
      form_name: formName,
      timestamp: new Date().toISOString(),
    });
  };

  const trackFormSubmit = (success: boolean = true, errorMessage?: string) => {
    const formTime = formStartTimeRef.current
      ? Date.now() - formStartTimeRef.current
      : null;

    track("form_submit", {
      form_name: formName,
      success,
      form_completion_time_ms: formTime,
      field_interactions: Object.keys(fieldInteractionsRef.current).length,
      error_message: errorMessage,
      timestamp: new Date().toISOString(),
    });
  };

  const trackFormAbandon = useCallback(() => {
    const formTime = formStartTimeRef.current
      ? Date.now() - formStartTimeRef.current
      : null;

    track("form_abandon", {
      form_name: formName,
      time_spent_ms: formTime,
      field_interactions: Object.keys(fieldInteractionsRef.current).length,
      timestamp: new Date().toISOString(),
    });
  }, [formName]);

  const trackFieldInteraction = (fieldName: string) => {
    if (!trackFieldInteractions) return;

    fieldInteractionsRef.current[fieldName] =
      (fieldInteractionsRef.current[fieldName] || 0) + 1;

    track("form_field_interaction", {
      form_name: formName,
      field_name: fieldName,
      interaction_count: fieldInteractionsRef.current[fieldName],
    });
  };

  const trackValidationError = (fieldName: string, errorMessage: string) => {
    track("form_validation_error", {
      form_name: formName,
      field_name: fieldName,
      error_message: errorMessage,
      timestamp: new Date().toISOString(),
    });
  };

  // Auto-track form abandonment on component unmount
  useEffect(() => {
    return () => {
      if (formStartTimeRef.current) {
        trackFormAbandon();
      }
    };
  }, [trackFormAbandon]);

  return {
    trackFormStart,
    trackFormSubmit,
    trackFormAbandon,
    trackFieldInteraction,
    trackValidationError,
  };
};

export default useFormAnalytics;
