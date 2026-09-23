import { Stack } from "@chakra-ui/react";
import { ErrorState, PageHeader, SectionCard } from "@/components/ui";
import { BookingsTable } from "../components/BookingsTable";
import { useBookingList } from "../hooks/useBookingList";

export function BookingsTemplate() {
  const list = useBookingList();

  return (
    <Stack gap={{ base: "1rem", md: "1.5rem" }}>
      <PageHeader
        title="Bookings"
        description="Your sessions with the practice."
      />
      {list.error && !list.isPending ? (
        <SectionCard>
          <ErrorState
            error={list.error}
            title="We couldn't load your bookings"
            onRetry={list.retry}
            isRetrying={list.isRetrying}
          />
        </SectionCard>
      ) : (
        <BookingsTable list={list} />
      )}
    </Stack>
  );
}
