import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../hooks/useStateContext";
import { usePagination } from "../hooks/usePagination";
import {
  discoverByGenres,
  fetchSearchResults,
  getImageUrl,
} from "../service/tmdbApi";
import type { Genre, MediaSummary } from "../types/tmdb";

import "../styles/ResultsPage.css";

const GENRES: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const ITEMS_PER_VIEW = 9;

function ResultsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<MediaSummary[]>([]);
  const [genre, setGenre] = useState("");
  const {
    index,
    page,
    nextPage,
    previousPage,
    syncPage,
    reset,
    hasNext,
    hasPrevious,
  } = usePagination(ITEMS_PER_VIEW);

  const { searchType, query } = useStateContext();

  // A new search means a new result list, so pagination starts over.
  useEffect(() => {
    reset();
  }, [searchType, query, reset]);

  useEffect(() => {
    let cancelled = false;

    const loadResults = async () => {
      try {
        const response = genre
          ? await discoverByGenres(searchType, genre, page)
          : await fetchSearchResults(searchType, query, page);

        if (cancelled) return;

        setData(response.results);
        syncPage(response);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    loadResults();

    return () => {
      cancelled = true;
    };
  }, [page, searchType, query, genre, syncPage]);

  // Genres are kept as a trailing-comma string because that is the format
  // TMDB expects for the `with_genres` parameter. The handler is on click
  // rather than change so clicking an already selected genre removes it.
  const handleSelect = (event: MouseEvent<HTMLSelectElement>) => {
    const selected = `${event.currentTarget.value},`;

    setGenre((current) =>
      current.includes(selected)
        ? current.replace(selected, "")
        : current + selected
    );
    reset();
  };

  const selectedGenres = genre.split(",").filter(Boolean);
  const visibleData = data.slice(index, index + ITEMS_PER_VIEW);

  const handleResultClick = (element: MediaSummary) => {
    navigate(`/${searchType}/${element.id}`);
  };

  return (
    <div>
      <div className="select-genre">
        <h4>Seleccione el genero:</h4>
        <select onClick={handleSelect}>
          {GENRES.map((element) => (
            <option key={element.id} value={element.id}>
              {element.name}
            </option>
          ))}
        </select>
      </div>
      <div className="selected-genres">
        <span>Generos seleccionados: </span>
        <div className="selected">
          {selectedGenres.map((genreId) => (
            <p key={genreId}>
              {GENRES.find((item) => item.id === Number(genreId))?.name}
            </p>
          ))}
        </div>
      </div>
      <div className="main-container-result-page">
        <div className="movie-result-page">
          {visibleData.map((element) => (
            <div key={element.id} className="movie">
              <img
                className="movie-images"
                src={
                  getImageUrl(element.poster_path) ||
                  getImageUrl(element.profile_path)
                }
                alt={element.title ?? element.name}
                onClick={() => handleResultClick(element)}
              />
              <div className="info-container">
                <h3>{element.title || element.name}</h3>
                <p>{element.release_date}</p>
              </div>
              <p className="title">{element.title || element.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="button-change-page">
        <button
          className="previousPage button"
          onClick={previousPage}
          disabled={!hasPrevious}
        >
          previous
        </button>
        <button
          className="nextPage button"
          onClick={nextPage}
          disabled={!hasNext}
        >
          next
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;
