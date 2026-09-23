import { Text } from "@chakra-ui/react";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarBlank } from "@/components/icons";
import {
  ListCard,
  ListCardSkeleton,
  ResponsiveTable,
} from "@/components/table";
import { EmptyState, StatusChip } from "@/components/ui";
import type { IPortalBooking } from "@/shared/interface/portal";
import { formatDateTime } from "@/utils/format-date";
import type { useBookingList } from "../hooks/useBookingList";

const bookingStatus = (booking: IPortalBooking) =>
  String(booking.status).toLowerCase() === "cancelled"
    ? { status: "cancelled", label: "Cancelled" }
    : { status: "scheduled", label: "Created" };

const eventName = (booking: IPortalBooking) =>
  booking.event || booking.service.name;

const columns: ColumnDef<IPortalBooking, any>[] = [
  {
    id: "booking-date",
    header: "Booking date",
    cell: ({ row }) => (
      <Text minW="7rem">{formatDateTime(row.original.created_dt)}</Text>
    ),
  },
  {
    id: "appointment-date",
    header: "Appointment date",
    cell: ({ row }) => (
      <Text minW="7rem">{formatDateTime(row.original.appointment)}</Text>
    ),
  },
  {
    id: "event",
    header: "Event",
    cell: ({ row }) => (
      <Text lineClamp={2} minW="9rem" maxW="16rem">
        {eventName(row.original)}
      </Text>
    ),
  },
  {
    id: "email",
    header: "Email",
    // Long addresses would push Status off-screen; the full one is in the tooltip.
    cell: ({ row }) => (
      <Text truncate maxW="10rem" title={row.original.email ?? undefined}>
        {row.original.email || "—"}
      </Text>
    ),
  },
  {
    id: "assigned-to",
    header: "Assigned to",
    cell: ({ row }) => (
      <Text lineClamp={2} maxW="10rem">
        {row.original.assigned_to || "—"}
      </Text>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <StatusChip {...bookingStatus(row.original)} />,
  },
];

type BookingList = ReturnType<typeof useBookingList>;

export function BookingsTable({ list }: { list: BookingList }) {
  return (
    <ResponsiveTable
      caption="Your bookings"
      tableFrom="xl"
      data={list.bookings}
      columns={columns}
      getRowId={(b) => b.id}
      getKey={(b) => b.id}
      loading={list.isPending}
      pagination={list.pagination}
      emptyState={
        <EmptyState
          icon={CalendarBlank}
          title="No bookings"
          description="Sessions your practice books for you will be listed here."
        />
      }
      cardSkeleton={<ListCardSkeleton />}
      renderCard={(booking) => (
        <ListCard
          row={booking}
          title={eventName(booking)}
          badge={<StatusChip {...bookingStatus(booking)} />}
          fields={[
            {
              label: "Appointment",
              value: formatDateTime(booking.appointment),
            },
            { label: "Booked", value: formatDateTime(booking.created_dt) },
            { label: "Assigned to", value: booking.assigned_to || "—" },
            { label: "Email", value: booking.email || "—" },
          ]}
        />
      )}
    />
  );
}
