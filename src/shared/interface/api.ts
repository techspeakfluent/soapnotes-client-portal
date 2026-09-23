export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  metadata: IMeta;
  status: string;
  status_code: number;
  timestamp: string;
}
export interface IMeta {
  limit: number;
  page: number;
  count: number;
  exceedCount: boolean;
  exceedTotalPages: boolean;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
  total_count: number;
  current_page: number;
  prev_page: boolean | null;
  next_page: boolean | null;
  total_pages: number;
  out_of_range: boolean;
}
