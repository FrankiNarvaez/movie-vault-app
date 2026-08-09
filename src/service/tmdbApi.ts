import axios from "axios";
import type {
  MediaDetails,
  MediaSummary,
  MediaType,
  PaginatedResponse,
} from "../types/tmdb";

// TMDB v4 auth: the API Read Access Token travels in the Authorization header,
// not as an `api_key` query parameter (that one is the v3 32-char API key).
const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const BASE_URL = import.meta.env.VITE_BASE_URL;

if (!API_TOKEN || !BASE_URL) {
  throw new Error(
    "Missing TMDB configuration. Define VITE_API_TOKEN and VITE_BASE_URL in your .env file."
  );
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const DEFAULT_LANGUAGE = "es-ES";

export type ImageSize = "w200" | "w300" | "w400";

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
  params: {
    language: DEFAULT_LANGUAGE,
  },
});

export const getImageUrl = (
  path: string | null | undefined,
  size: ImageSize = "w300"
): string => (path ? `${IMAGE_BASE_URL}/${size}${path}` : "");

export const fetchSearchResults = async (
  type: MediaType,
  query: string,
  page = 1
): Promise<PaginatedResponse<MediaSummary>> => {
  const response = await tmdbApi.get<PaginatedResponse<MediaSummary>>(
    `/search/${type}`,
    { params: { query, page, include_adult: false } }
  );
  return response.data;
};

export const fetchTrending = async (
  type: MediaType,
  page = 1,
  timeWindow: "day" | "week" = "day"
): Promise<PaginatedResponse<MediaSummary>> => {
  const response = await tmdbApi.get<PaginatedResponse<MediaSummary>>(
    `/trending/${type}/${timeWindow}`,
    { params: { page } }
  );
  return response.data;
};

export const fetchDetails = async (
  type: MediaType,
  id: string
): Promise<MediaDetails> => {
  const response = await tmdbApi.get<MediaDetails>(`/${type}/${id}`);
  return response.data;
};

export const fetchSimilar = async (
  type: MediaType,
  id: string,
  page = 1
): Promise<PaginatedResponse<MediaSummary>> => {
  const response = await tmdbApi.get<PaginatedResponse<MediaSummary>>(
    `/${type}/${id}/similar`,
    { params: { page } }
  );
  return response.data;
};

export const discoverByGenres = async (
  type: MediaType,
  genres: string,
  page = 1
): Promise<PaginatedResponse<MediaSummary>> => {
  const response = await tmdbApi.get<PaginatedResponse<MediaSummary>>(
    `/discover/${type}`,
    { params: { with_genres: genres, page } }
  );
  return response.data;
};

export default tmdbApi;
