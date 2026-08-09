export const MEDIA_TYPES = ["movie", "tv", "person"] as const;

export type MediaType = (typeof MEDIA_TYPES)[number];

/**
 * Narrows the loose strings coming from the URL or a <select> into the three
 * media types TMDB actually understands.
 */
export const isMediaType = (value: unknown): value is MediaType =>
  typeof value === "string" &&
  (MEDIA_TYPES as readonly string[]).includes(value);

export interface Genre {
  id: number;
  name: string;
}

/**
 * The fields TMDB returns for list entries. Movies carry `title`, TV shows and
 * people carry `name`, and each kind brings its own image field, so everything
 * beyond the id is optional.
 */
export interface MediaSummary {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  profile_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  known_for_department?: string;
}

export interface MediaDetails extends MediaSummary {
  genres?: Genre[];
  biography?: string;
  birthday?: string | null;
  deathday?: string | null;
  also_known_as?: string[];
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
