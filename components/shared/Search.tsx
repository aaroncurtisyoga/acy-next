"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { Search as SearchIcon } from "lucide-react";
const Search = () => {
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
      className="w-full placeholder:italic"
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

export default Search;
