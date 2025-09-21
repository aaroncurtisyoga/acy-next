"use client";

import { useEffect, useState } from "react";
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

export const useABTest = ({ testName, variants, weights }: ABTestConfig) => {
  const [variant, setVariant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get or create user ID (you might want to use Clerk user ID instead)
    let userId = localStorage.getItem("ab_user_id");
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("ab_user_id", userId);
    }

    // Determine variant based on hash of user ID + test name
    const hash = hashString(`${userId}_${testName}`);

    let selectedVariant: string;

    if (weights && weights.length === variants.length) {
      // Use weighted distribution
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      const randomValue = (hash % 10000) / 10000; // Normalize to 0-1

      let cumulativeWeight = 0;
      selectedVariant = variants[variants.length - 1]; // Default to last variant

      for (let i = 0; i < variants.length; i++) {
        cumulativeWeight += weights[i] / totalWeight;
        if (randomValue <= cumulativeWeight) {
          selectedVariant = variants[i];
          break;
        }
      }
    } else {
      // Equal distribution
      const variantIndex = hash % variants.length;
      selectedVariant = variants[variantIndex];
    }

    setVariant(selectedVariant);
    setIsLoading(false);

    // Track variant assignment
    track("ab_test_assignment", {
      test_name: testName,
      variant: selectedVariant,
      user_id: userId,
    });
  }, [testName, variants, weights]);

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
