"use client";

import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { autocompleteSuggestions } from "@/lib/actions/google.actions";

const useAutocompleteSuggestions = () => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const debouncedAutocomplete = useRef(
    _.debounce((value) => {
      if (!value.trim()) {
        setSuggestions([]);
        return;
      }

      autocompleteSuggestions(value).then((r) => {
        setSuggestions(r);
      });
    }, 2000),
  ).current;

  useEffect(() => {
    return () => {
      debouncedAutocomplete.cancel();
    };
  }, []);

  useEffect(() => {
    debouncedAutocomplete(searchValue);
  }, [searchValue, debouncedAutocomplete]);

  return { setSearchValue, suggestions };
};

export default useAutocompleteSuggestions;
