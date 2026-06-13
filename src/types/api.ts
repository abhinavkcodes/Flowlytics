export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type DateRangeFilter = {
  from?: string;
  to?: string;
};

export interface SyncStatusResponse {
  status: "idle" | "syncing" | "completed" | "failed";
  lastSyncedAt: string | null;
  progress?: number;
}