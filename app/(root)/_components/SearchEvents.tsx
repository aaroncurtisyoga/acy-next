"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search as SearchIcon } from "lucide-react";
import { formUrlQuery, removeKeysFromQuery } from "@/app/_lib/utils";
import { track } from "@vercel/analytics";

const SearchEvent = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";

      if (query) {
        track("search", {
          action: "search_events",
          query: query,
        });
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
    <div className="space-y-2">
      <Label htmlFor="search-events">Search</Label>
      <div className="relative">
        <SearchIcon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="search-events"
          placeholder="e.g. 'Power Vinyasa'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          className="pl-9"
        />
      </div>
    </div>
  );
};

export default SearchEvent;
