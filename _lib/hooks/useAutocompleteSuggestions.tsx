"use client";

import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { autocompleteSuggestions } from "@/_lib/actions/google.actions";

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
        console.log("autocompleteSuggestions", r);
        setSuggestions(r);
      });
    }, 2000),
  ).current;

  useEffect(() => {
    return () => {
      debouncedAutocomplete.cancel();
    };
  }, [debouncedAutocomplete]);

  useEffect(() => {
    debouncedAutocomplete(searchValue);
  }, [searchValue, debouncedAutocomplete]);

  return { setSearchValue, suggestions };
};

export default useAutocompleteSuggestions;
