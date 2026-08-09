import axios from "axios";

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

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
  params: {
    language: DEFAULT_LANGUAGE,
  },
});

export const getImageUrl = (path, size = "w300") =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : "";

export const fetchSearchResults = async (type, query, page = 1) => {
  const response = await tmdbApi.get(`/search/${type}`, {
    params: { query, page, include_adult: false },
  });
  return response.data;
};

export const fetchTrending = async (type, page = 1, timeWindow = "day") => {
  const response = await tmdbApi.get(`/trending/${type}/${timeWindow}`, {
    params: { page },
  });
  return response.data;
};

export const fetchDetails = async (type, id) => {
  const response = await tmdbApi.get(`/${type}/${id}`);
  return response.data;
};

export const fetchSimilar = async (type, id, page = 1) => {
  const response = await tmdbApi.get(`/${type}/${id}/similar`, {
    params: { page },
  });
  return response.data;
};

export const discoverByGenres = async (type, genres, page = 1) => {
  const response = await tmdbApi.get(`/discover/${type}`, {
    params: { with_genres: genres, page },
  });
  return response.data;
};

export default tmdbApi;
