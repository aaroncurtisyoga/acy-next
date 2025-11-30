"use client";

import { FC, useState } from "react";
import { Table, TableBody, TableColumn, TableHeader } from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { useDisclosure } from "@heroui/modal";
import BasicModal from "@/app/_components/BasicModal";
import TableEmpty from "@/app/_components/TableEmpty";
import TableLoading from "@/app/_components/TableLoading";
import EventTableToolbar from "@/app/admin/events/_components/EventTableToolbar";
import EventTableRow from "@/app/admin/events/_components/EventTableRow";
import { useEventTableFilters } from "@/app/admin/events/_components/hooks/useEventTableFilters";
import { useEventTableData } from "@/app/admin/events/_components/hooks/useEventTableData";
import { TableEventManagementColumns } from "@/app/_lib/constants";
import { formatDateTime } from "@/app/_lib/utils";

const TableEventManagement: FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const {
    filters,
    hasActiveFilters,
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    handlePageChange,
    clearFilters,
  } = useEventTableFilters();

  const {
    events,
    categories,
    totalPages,
    totalCount,
    loading,
    handleDeleteEvent,
  } = useEventTableData(filters);

  const onDeleteClick = (event: any) => {
    setSelectedEvent(event);
    onOpen();
  };

  const onConfirmDelete = async () => {
    if (!selectedEvent) return;
    const success = await handleDeleteEvent(selectedEvent.id);
    if (success) {
      onOpenChange();
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <EventTableToolbar
          searchText=""
          category=""
          statusFilter="all"
          categories={[]}
          hasActiveFilters={false}
          disabled={true}
          onSearchChange={() => {}}
          onCategoryChange={() => {}}
          onStatusChange={() => {}}
          onClearFilters={() => {}}
        />
        <TableLoading columns={TableEventManagementColumns} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EventTableToolbar
        searchText={filters.searchText}
        category={filters.category}
        statusFilter={filters.statusFilter}
        categories={categories}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onClearFilters={clearFilters}
      />

      <div className="flex justify-between items-center">
        <p className="text-default-400 text-sm">
          {totalCount} {totalCount === 1 ? "event" : "events"} found
          {hasActiveFilters && " (filtered)"}
        </p>
      </div>

      {events.length === 0 ? (
        <TableEmpty
          columns={TableEventManagementColumns}
          message={
            hasActiveFilters
              ? "No events found matching your filters"
              : "No events have been created yet"
          }
        />
      ) : (
        <Table
          aria-label="Table for Managing Events"
          classNames={{ wrapper: "min-h-[400px]" }}
        >
          <TableHeader>
            {TableEventManagementColumns.map((column) => (
              <TableColumn key={column}>{column}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <EventTableRow
                key={event.id}
                event={event}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            total={totalPages}
            page={filters.page}
            onChange={handlePageChange}
            showControls
            color="primary"
            variant="flat"
          />
        </div>
      )}

      <BasicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        header={<h1>Confirm deletion for this event</h1>}
        primaryAction={onConfirmDelete}
        primaryActionLabel="Delete"
      >
        {selectedEvent && (
          <div>
            <p className="mb-5">Are you sure you want to delete this event?</p>
            <p>
              <b>Event:</b> {selectedEvent.title}
            </p>
            <p>
              <b>Category:</b> {selectedEvent.category.name}
            </p>
            <p>
              <b>Date:</b>{" "}
              {formatDateTime(selectedEvent.startDateTime).dateTime}
            </p>
          </div>
        )}
      </BasicModal>
    </div>
  );
};

export default TableEventManagement;
