import { Box, Flex, Skeleton, Table } from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { SortAscIcon, SortDefaultIcon, SortDescIcon } from "@/components/icons";
import { ActionMenu } from "./ActionMenu";
import { PaginationControls } from "./PaginationControls";
import type { CustomTableProps } from "./types";

export type { CustomTableProps, TableAction, TablePagination } from "./types";

const SKELETON_ROWS = 5;

export function CustomTable<T>({
  data,
  columns: baseColumns,
  getRowId,
  sorting,
  setSorting,
  pagination,
  actions = [],
  getRowLabel,
  loading = false,
  emptyState,
  onRowClick,
  caption,
}: CustomTableProps<T>) {
  const columns = useMemo<ColumnDef<T, any>[]>(() => {
    const cols = baseColumns.map((col) => ({ enableSorting: false, ...col }));
    if (actions.length > 0) {
      cols.push({
        id: "actions",
        header: () => <Box srOnly>Actions</Box>,
        cell: ({ row }) => (
          <ActionMenu
            row={row.original}
            actions={actions}
            label={getRowLabel?.(row.original) ?? "row"}
          />
        ),
        enableSorting: false,
        meta: { disableRowClick: true },
      });
    }
    return cols;
  }, [baseColumns, actions, getRowLabel]);

  const table = useReactTable<T>({
    data,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    enableSorting: !!setSorting,
    state: { sorting: sorting ?? [] },
    onSortingChange: (updater) => {
      if (!setSorting) return;
      const next: SortingState =
        typeof updater === "function" ? updater(sorting ?? []) : updater;
      setSorting(next);
    },
  });

  const cellPadding = { px: "1rem", py: "0.75rem" };

  return (
    <Box w="100%">
      <Table.ScrollArea
        borderWidth="1px"
        borderColor="gray.50"
        borderRadius="0.75rem"
      >
        <Table.Root
          size="md"
          bg="white"
          css={{ "& td, & th": { borderColor: "gray.50" } }}
        >
          <Table.Caption srOnly>{caption}</Table.Caption>
          <Table.Header>
            {table.getHeaderGroups().map((group) => (
              <Table.Row key={group.id} bg="gray.25">
                {group.headers.map((header) => {
                  const numeric = header.column.columnDef.meta?.numeric;
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const label = flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  );
                  return (
                    <Table.ColumnHeader
                      key={header.id}
                      {...cellPadding}
                      textStyle="tiny-semibold"
                      color="gray.300"
                      textTransform="uppercase"
                      letterSpacing="0.04em"
                      textAlign={numeric ? "end" : "start"}
                      whiteSpace="nowrap"
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : undefined
                      }
                    >
                      {canSort ? (
                        <Flex
                          as="button"
                          align="center"
                          gap="0.375rem"
                          ml={numeric ? "auto" : undefined}
                          cursor="pointer"
                          textTransform="inherit"
                          _hover={{ color: "gray.500" }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {label}
                          {sorted === "asc" ? (
                            <SortAscIcon boxSize="0.875rem" />
                          ) : sorted === "desc" ? (
                            <SortDescIcon boxSize="0.875rem" />
                          ) : (
                            <SortDefaultIcon
                              boxSize="0.875rem"
                              color="gray.100"
                            />
                          )}
                        </Flex>
                      ) : (
                        label
                      )}
                    </Table.ColumnHeader>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Header>

          <Table.Body>
            {loading ? (
              Array.from({ length: SKELETON_ROWS }, (_, i) => (
                <Table.Row key={i}>
                  {columns.map((col, j) => (
                    <Table.Cell key={j} {...cellPadding}>
                      <Skeleton
                        h="1rem"
                        w={col.meta?.numeric ? "4.5rem" : "70%"}
                        ml={col.meta?.numeric ? "auto" : 0}
                      />
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            ) : data.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={columns.length}>{emptyState}</Table.Cell>
              </Table.Row>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Table.Row
                  key={row.id}
                  cursor={onRowClick ? "pointer" : undefined}
                  _hover={onRowClick ? { bg: "gray.25" } : undefined}
                  transition="background-color 0.15s"
                  onClick={(e) => onRowClick?.(row, e)}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta;
                    return (
                      <Table.Cell
                        key={cell.id}
                        {...cellPadding}
                        py={
                          cell.column.id === "actions"
                            ? "0.25rem"
                            : cellPadding.py
                        }
                        textStyle="small-regular"
                        color="gray.500"
                        textAlign={meta?.numeric ? "end" : "start"}
                        fontVariantNumeric={
                          meta?.numeric ? "tabular-nums" : undefined
                        }
                        whiteSpace={meta?.numeric ? "nowrap" : undefined}
                        w={cell.column.id === "actions" ? "3.5rem" : undefined}
                        onClick={(e) => {
                          if (meta?.disableRowClick) e.stopPropagation();
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {pagination && !loading && <PaginationControls {...pagination} />}
    </Box>
  );
}
