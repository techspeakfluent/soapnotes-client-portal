import { Stack, useBreakpointValue } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { CustomTable } from "./CustomTable";
import { PaginationControls } from "./PaginationControls";
import type { CustomTableProps } from "./types";

interface ResponsiveTableProps<T> extends CustomTableProps<T> {
  renderCard: (row: T) => ReactNode;
  cardSkeleton: ReactNode;
  getKey: (row: T) => string;
  tableFrom?: "md" | "lg" | "xl";
}

// Only one of the two is mounted, so row menus and dialogs never exist twice.
export function ResponsiveTable<T>({
  renderCard,
  cardSkeleton,
  getKey,
  tableFrom = "md",
  ...tableProps
}: ResponsiveTableProps<T>) {
  const isWide = useBreakpointValue(
    { base: false, [tableFrom]: true },
    { ssr: false },
  );

  if (isWide) return <CustomTable {...tableProps} />;

  const { data, loading, emptyState, pagination, caption } = tableProps;
  return (
    <Stack gap="0">
      <Stack
        as="ul"
        aria-label={caption}
        gap="0.75rem"
        listStyleType="none"
        m="0"
        p="0"
      >
        {loading
          ? Array.from({ length: 3 }, (_, i) => <li key={i}>{cardSkeleton}</li>)
          : data.map((row) => <li key={getKey(row)}>{renderCard(row)}</li>)}
      </Stack>
      {!loading && data.length === 0 && emptyState}
      {pagination && !loading && <PaginationControls {...pagination} />}
    </Stack>
  );
}
