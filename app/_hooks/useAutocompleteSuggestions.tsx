"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (value: string) => {
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
    } catch (error: any) {
      if (error?.name !== "AbortError") {
        console.error("Autocomplete error:", error);
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSuggestions(searchValue), 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [searchValue, fetchSuggestions]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return { setSearchValue, suggestions, isLoading, clearCache };
};

export default useAutocompleteSuggestions;
