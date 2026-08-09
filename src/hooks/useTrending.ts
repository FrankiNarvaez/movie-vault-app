import { useCallback, useEffect, useState } from "react";
import { usePagination } from "./usePagination";
import type { Pagination } from "./usePagination";
import { fetchTrending } from "../service/tmdbApi";
import type { MediaSummary, MediaType, RequestStatus } from "../types/tmdb";

export interface TrendingList extends Pagination {
  items: MediaSummary[];
  status: RequestStatus;
  retry: () => void;
}

/**
 * Loads a TMDB trending list and exposes the visible slice of `step` items.
 * Fetching is tied to the API page only, so moving between slices of an
 * already loaded page costs no request.
 */
export function useTrending(type: MediaType, step: number): TrendingList {
  const [results, setResults] = useState<MediaSummary[]>([]);
  const [status, setStatus] = useState<RequestStatus>("loading");
  const [attempt, setAttempt] = useState(0);
  const pagination = usePagination(step);
  const { page, index, syncPage } = pagination;

  const retry = useCallback(() => setAttempt((current) => current + 1), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setStatus("loading");

      try {
        const data = await fetchTrending(type, page);
        if (cancelled) return;

        setResults(data.results);
        syncPage(data);
        setStatus("ready");
      } catch (error) {
        if (cancelled) return;

        console.error(`Error fetching trending ${type}:`, error);
        setStatus("error");
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [type, page, attempt, syncPage]);

  return {
    ...pagination,
    items: results.slice(index, index + step),
    status,
    retry,
  };
}
