import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAllEvents, deleteEvent } from "@/app/_lib/actions/event.actions";
import { handleError } from "@/app/_lib/utils";
import type { EventTableFilters } from "@/app/admin/events/_components/hooks/useEventTableFilters";

interface Category {
  id: string;
  name: string;
}

export interface UseEventTableDataReturn {
  events: any[];
  categories: Category[];
  totalPages: number;
  totalCount: number;
  loading: boolean;
  handleDeleteEvent: (eventId: string) => Promise<boolean>;
  refreshEvents: () => void;
}

export function useEventTableData(
  filters: EventTableFilters,
): UseEventTableDataReturn {
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { searchText, category, statusFilter, page } = filters;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { getAllCategories } =
          await import("@/app/_lib/actions/category.actions");
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const {
          data,
          totalPages: pages,
          totalCount: count,
        } = await getAllEvents({
          category,
          limit: 10,
          page,
          query: searchText,
          isActive:
            statusFilter === "all" ? undefined : statusFilter === "active",
        });
        setEvents(data);
        setTotalPages(pages);
        setTotalCount(count);
      } catch (error) {
        handleError("Failed to fetch events", error);
        toast.error("Failed to fetch events. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [page, searchText, category, statusFilter, refreshTrigger]);

  const handleDeleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      const response = await deleteEvent(eventId);
      if (response.success) {
        setEvents((prev) => prev.filter((event) => event.id !== eventId));
        setTotalCount((prev) => prev - 1);
        toast.success("Event deleted successfully");
        return true;
      }
      throw new Error("Failed to delete event");
    } catch (error) {
      handleError("Failed to delete event", error);
      toast.error("Failed to delete event. Please try again.");
      return false;
    }
  };

  const refreshEvents = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return {
    events,
    categories,
    totalPages,
    totalCount,
    loading,
    handleDeleteEvent,
    refreshEvents,
  };
}
