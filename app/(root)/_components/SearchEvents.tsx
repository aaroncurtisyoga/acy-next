"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@heroui/react";
import { Search as SearchIcon } from "lucide-react";
import { formUrlQuery, removeKeysFromQuery } from "@/app/_lib/utils";

const SearchEvent = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";

      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: query,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        });
      }

      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router]);

  return (
    <Input
      label="Search"
      placeholder="e.g. 'Power Vinyasa'"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      type="search"
      variant="flat"
      startContent={<SearchIcon size={16} />}
    />
  );
};

export default SearchEvent;
