import type { ColumnDef, Row, SortingState } from "@tanstack/react-table";
import type { MouseEvent, ReactNode } from "react";

export interface TableAction<T = any> {
  label: string;
  icon?: ReactNode;
  value: string;
  onClick: (row: T, event?: MouseEvent) => void | Promise<void>;
  disabled?: (row: T) => boolean;
  show?: (row: T) => boolean;
  variant?: "default" | "destructive";
}

export interface TablePagination {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setPageIndex: (pageIndex: number) => void;
}

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    /** Right-aligns the column with tabular figures — for money. */
    numeric?: boolean;
    /** Clicks in this cell don't count as a row click. */
    disableRowClick?: boolean;
  }
}

export interface CustomTableProps<T = any> {
  data: T[];
  columns: ColumnDef<T, any>[];
  getRowId?: (row: T, index: number) => string;

  sorting?: SortingState;
  setSorting?: (sorting: SortingState) => void;

  pagination?: TablePagination;

  actions?: TableAction<T>[];
  getRowLabel?: (row: T) => string;

  loading?: boolean;
  emptyState?: ReactNode;

  onRowClick?: (row: Row<T>, event: MouseEvent) => void;
  caption: string;
}
