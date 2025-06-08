"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, cn } from "@heroui/react";
import { Search as SearchIcon } from "lucide-react";
import { formUrlQuery, removeKeysFromQuery } from "@/app/_lib/utils";

interface SearchEventProps {
  className?: string;
}

const SearchEvent = ({ className }: SearchEventProps) => {
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
      className={cn("w-full", className)}
      endContent={<SearchIcon size={14} />}
      placeholder={"e.g. 'Power Vinyasa'"}
      key={"SearchInput"}
      label="Search for Events"
      labelPlacement={"outside"}
      onChange={(e) => setQuery(e.target.value)}
      type="text"
      variant={"bordered"}
    />
  );
};

export default SearchEvent;
