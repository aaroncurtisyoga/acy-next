"use client";

import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { autocompleteSuggestions } from "@/lib/actions/google.actions";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setPlaceSuggestions,
  selectPlaceSuggestions,
} from "@/lib/redux/features/eventFormSlice";

const useAutocompleteSuggestions = () => {
  const dispatch = useAppDispatch();
  const placeSuggestions = useAppSelector(selectPlaceSuggestions);
  const [searchValue, setSearchValue] = useState("");

  const debouncedAutocomplete = useRef(
    _.debounce((value) => {
      if (!value.trim()) {
        dispatch(setPlaceSuggestions([]));
        return;
      }

      autocompleteSuggestions(value).then((r) => {
        dispatch(setPlaceSuggestions([]));
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

  return { setSearchValue, placeSuggestions };
};

export default useAutocompleteSuggestions;
