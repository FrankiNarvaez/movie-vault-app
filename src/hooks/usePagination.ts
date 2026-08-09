import { useCallback, useState } from "react";
import type { PaginatedResponse } from "../types/tmdb";

// A TMDB list endpoint returns up to 20 results per page.
const TMDB_PAGE_SIZE = 20;

export interface Pagination {
  index: number;
  page: number;
  nextPage: () => void;
  previousPage: () => void;
  syncPage: (response: PaginatedResponse<unknown>) => void;
  reset: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Walks a TMDB list endpoint in slices of `step` items.
 *
 * Each API page is consumed slice by slice before requesting the next one, so
 * no result is skipped. Callers fetch on `page` only, keep the full result
 * array, and slice it with `index`. Changing slices never refetches.
 *
 * After every fetch the caller must report the response through `syncPage` so
 * the hook knows how many items the current page holds and where the list ends.
 */
export function usePagination(step: number): Pagination {
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(TMDB_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(1);

  // Stable so callers can list it as an effect dependency without re-fetching.
  const syncPage = useCallback((response: PaginatedResponse<unknown>) => {
    setPageSize(response.results.length);
    setTotalPages(response.total_pages ?? 1);
  }, []);

  const hasNext = index + step < pageSize || page < totalPages;
  const hasPrevious = index > 0 || page > 1;

  const nextPage = () => {
    if (!hasNext) return;

    if (index + step < pageSize) {
      setIndex(index + step);
      return;
    }
    setPage((current) => current + 1);
    setIndex(0);
  };

  const previousPage = () => {
    if (!hasPrevious) return;

    if (index >= step) {
      setIndex(index - step);
      return;
    }
    setPage((current) => current - 1);
    // Any page we can go back to was already traversed in full, so it holds
    // TMDB_PAGE_SIZE items and its last slice starts at a known offset.
    setIndex(Math.floor((TMDB_PAGE_SIZE - 1) / step) * step);
  };

  const reset = useCallback(() => {
    setIndex(0);
    setPage(1);
  }, []);

  return {
    index,
    page,
    nextPage,
    previousPage,
    syncPage,
    reset,
    hasNext,
    hasPrevious,
  };
}
