"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import { OpenLibrarySearchResult } from "@/app/_lib/types";

interface BookSearchProps {
  onSelect: (
    result: OpenLibrarySearchResult,
    description: string | null,
  ) => void;
}

const BookSearch: FC<BookSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OpenLibrarySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const detailsAbortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return () => {};
    }

    setIsSearching(true);

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(
          `/api/books/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        const data = await res.json();
        setResults(data);
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          console.error("Search failed:", e);
        }
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query]);

  const handleSelect = async (result: OpenLibrarySearchResult) => {
    if (detailsAbortRef.current) detailsAbortRef.current.abort();
    const controller = new AbortController();
    detailsAbortRef.current = controller;

    setIsFetchingDetails(true);
    try {
      const res = await fetch(
        `/api/books/details?key=${encodeURIComponent(result.openLibraryKey)}`,
        { signal: controller.signal },
      );
      const data = await res.json();
      onSelect(result, data.description);
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        onSelect(result, null);
      }
    } finally {
      setIsFetchingDetails(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by book title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          autoFocus
        />
      </div>

      {isSearching && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Searching...
        </div>
      )}

      {isFetchingDetails && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading book details...
        </div>
      )}

      {!isSearching && !isFetchingDetails && results.length > 0 && (
        <div className="border rounded-lg divide-y">
          {results.map((result) => (
            <button
              key={result.openLibraryKey}
              type="button"
              onClick={() => handleSelect(result)}
              className="flex items-center gap-3 w-full p-3 text-left hover:bg-muted/50 transition-colors"
            >
              {result.coverImageUrl ? (
                <Image
                  src={result.coverImageUrl}
                  alt={result.title}
                  width={40}
                  height={60}
                  className="rounded object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-[40px] h-[60px] bg-muted rounded flex items-center justify-center flex-shrink-0">
                  <Search className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium truncate">{result.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {result.author}
                  {result.year && ` (${result.year})`}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {!isSearching &&
        !isFetchingDetails &&
        query.trim().length >= 2 &&
        results.length === 0 && (
          <p className="text-sm text-muted-foreground py-2">
            No results found.
          </p>
        )}
    </div>
  );
};

export default BookSearch;
