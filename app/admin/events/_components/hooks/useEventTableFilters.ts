import { useState, useCallback } from "react";

export interface EventTableFilters {
  searchText: string;
  category: string;
  statusFilter: string;
  page: number;
}

export interface UseEventTableFiltersReturn {
  filters: EventTableFilters;
  hasActiveFilters: boolean;
  handleSearchChange: (value: string) => void;
  handleCategoryChange: (value: string) => void;
  handleStatusChange: (value: string) => void;
  handlePageChange: (page: number) => void;
  clearFilters: () => void;
}

export function useEventTableFilters(): UseEventTableFiltersReturn {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchText("");
    setCategory("");
    setStatusFilter("all");
    setPage(1);
  }, []);

  const hasActiveFilters =
    searchText !== "" || category !== "" || statusFilter !== "all";

  return {
    filters: { searchText, category, statusFilter, page },
    hasActiveFilters,
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    handlePageChange,
    clearFilters,
  };
}
