"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { track } from "@vercel/analytics";

interface ABTestConfig {
  testName: string;
  variants: string[];
  weights?: number[]; // Optional weights for each variant
}

// Simple hash function for consistent variant assignment
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Compute variant from localStorage and config
const computeVariant = (
  testName: string,
  variants: string[],
  weights?: number[],
): { variant: string; userId: string } => {
  let userId = localStorage.getItem("ab_user_id");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("ab_user_id", userId);
  }

  const hash = hashString(`${userId}_${testName}`);
  let selectedVariant: string;

  if (weights && weights.length === variants.length) {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const randomValue = (hash % 10000) / 10000;
    let cumulativeWeight = 0;
    selectedVariant = variants[variants.length - 1];

    for (let i = 0; i < variants.length; i++) {
      cumulativeWeight += weights[i] / totalWeight;
      if (randomValue <= cumulativeWeight) {
        selectedVariant = variants[i];
        break;
      }
    }
  } else {
    const variantIndex = hash % variants.length;
    selectedVariant = variants[variantIndex];
  }

  return { variant: selectedVariant, userId };
};

// useSyncExternalStore for hydration-safe client detection
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const useABTest = ({ testName, variants, weights }: ABTestConfig) => {
  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const hasTracked = useRef(false);

  // Compute variant only on client
  const result = isClient ? computeVariant(testName, variants, weights) : null;

  const variant = result?.variant ?? null;
  const isLoading = !isClient;

  // Track variant assignment once
  useEffect(() => {
    if (result && !hasTracked.current) {
      hasTracked.current = true;
      track("ab_test_assignment", {
        test_name: testName,
        variant: result.variant,
        user_id: result.userId,
      });
    }
  }, [result, testName]);

  const trackConversion = (conversionType: string, value?: number) => {
    if (variant) {
      track("ab_test_conversion", {
        test_name: testName,
        variant,
        conversion_type: conversionType,
        value,
      });
    }
  };

  return {
    variant,
    isLoading,
    trackConversion,
    isVariant: (variantName: string) => variant === variantName,
  };
};

export default useABTest;
