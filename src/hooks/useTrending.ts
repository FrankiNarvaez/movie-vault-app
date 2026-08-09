import { useEffect, useState } from "react";
import { usePagination } from "./usePagination";
import type { Pagination } from "./usePagination";
import { fetchTrending } from "../service/tmdbApi";
import type { MediaSummary, MediaType } from "../types/tmdb";

export interface TrendingList extends Pagination {
  items: MediaSummary[];
}

/**
 * Loads a TMDB trending list and exposes the visible slice of `step` items.
 * Fetching is tied to the API page only, so moving between slices of an
 * already loaded page costs no request.
 */
export function useTrending(type: MediaType, step: number): TrendingList {
  const [results, setResults] = useState<MediaSummary[]>([]);
  const pagination = usePagination(step);
  const { page, index, syncPage } = pagination;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchTrending(type, page);
        if (cancelled) return;

        setResults(data.results);
        syncPage(data);
      } catch (error) {
        console.error(`Error fetching trending ${type}:`, error);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [type, page, syncPage]);

  return { ...pagination, items: results.slice(index, index + step) };
}
