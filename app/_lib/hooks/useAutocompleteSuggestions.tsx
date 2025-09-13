"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import _ from "lodash";
import { autocompleteSuggestions } from "@/app/_lib/actions/google.actions";

interface LocationSuggestion {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

const useAutocompleteSuggestions = () => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, LocationSuggestion[]>>(new Map());

  const debouncedAutocomplete = useRef(
    _.debounce(async (value: string) => {
      if (!value.trim()) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      // Check cache first
      const cached = cacheRef.current.get(value.toLowerCase());
      if (cached) {
        setSuggestions(cached);
        setIsLoading(false);
        return;
      }

      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      setIsLoading(true);

      try {
        const result = await autocompleteSuggestions(value);
        if (result && Array.isArray(result)) {
          setSuggestions(result);
          // Cache the result (limit cache size to 50 entries)
          if (cacheRef.current.size > 50) {
            const firstKey = cacheRef.current.keys().next().value;
            cacheRef.current.delete(firstKey);
          }
          cacheRef.current.set(value.toLowerCase(), result);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Autocomplete error:", error);
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300),
  ).current;

  useEffect(() => {
    return () => {
      debouncedAutocomplete.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedAutocomplete]);

  useEffect(() => {
    debouncedAutocomplete(searchValue);
  }, [searchValue, debouncedAutocomplete]);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return { setSearchValue, suggestions, isLoading, clearCache };
};

export default useAutocompleteSuggestions;
