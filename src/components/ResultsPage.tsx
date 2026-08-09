import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePagination } from "../hooks/usePagination";
import {
  discoverByGenres,
  fetchSearchResults,
  getImageUrl,
} from "../service/tmdbApi";
import { isMediaType } from "../types/tmdb";
import type { Genre, MediaSummary, RequestStatus } from "../types/tmdb";
import { PosterCard } from "./ui/PosterCard";
import { Pager } from "./ui/Pager";
import { PosterSkeletonGrid } from "./ui/Skeleton";
import { RetryButton, StatusBlock } from "./ui/StatusBlock";

const GENRES: Genre[] = [
  { id: 28, name: "Acción" },
  { id: 12, name: "Aventura" },
  { id: 16, name: "Animación" },
  { id: 35, name: "Comedia" },
  { id: 80, name: "Crimen" },
  { id: 99, name: "Documental" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Familia" },
  { id: 14, name: "Fantasía" },
  { id: 36, name: "Historia" },
  { id: 27, name: "Terror" },
  { id: 10402, name: "Música" },
  { id: 9648, name: "Misterio" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Ciencia ficción" },
  { id: 10770, name: "Película de TV" },
  { id: 53, name: "Suspenso" },
  { id: 10752, name: "Bélica" },
  { id: 37, name: "Western" },
];

// Twelve fills a 4-column desktop grid in exactly three rows. Nine left the
// posters oversized because the grid capped out at three columns.
const ITEMS_PER_VIEW = 12;

function ResultsPage() {
  // Reading the URL directly means a reload or a shared link still works. The
  // previous version took the query from shared state, which was empty on a
  // cold load and searched for nothing.
  const { type, search } = useParams();
  const searchType = isMediaType(type) ? type : "movie";
  const query = search ?? "";

  const [data, setData] = useState<MediaSummary[]>([]);
  const [status, setStatus] = useState<RequestStatus>("loading");
  const [genreIds, setGenreIds] = useState<number[]>([]);
  const [attempt, setAttempt] = useState(0);
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

  const genreParam = genreIds.join(",");

  // A new search means a new result list, so pagination starts over.
  useEffect(() => {
    reset();
  }, [searchType, query, reset]);

  useEffect(() => {
    let cancelled = false;

    const loadResults = async () => {
      setStatus("loading");

      try {
        const response = genreParam
          ? await discoverByGenres(searchType, genreParam, page)
          : await fetchSearchResults(searchType, query, page);

        if (cancelled) return;

        setData(response.results);
        syncPage(response);
        setStatus("ready");
      } catch (error) {
        if (cancelled) return;

        console.error("Error fetching results:", error);
        setStatus("error");
      }
    };

    loadResults();

    return () => {
      cancelled = true;
    };
  }, [page, searchType, query, genreParam, attempt, syncPage]);

  const toggleGenre = (id: number) => {
    setGenreIds((current) =>
      current.includes(id)
        ? current.filter((genreId) => genreId !== id)
        : [...current, id]
    );
    reset();
  };

  const visibleData = data.slice(index, index + ITEMS_PER_VIEW);
  const heading = genreParam ? "Filtrado por género" : `Resultados para "${query}"`;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10 md:px-8 md:pt-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
          {heading}
        </h1>
        {status === "ready" && visibleData.length > 0 && (
          <Pager
            label="Resultados"
            onPrevious={previousPage}
            onNext={nextPage}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
          />
        )}
      </div>

      {/* Toggle chips replace the old <select onClick>, which looked like a
          single-choice control while behaving like a multi-select. */}
      <div className="mt-6 flex flex-wrap gap-2">
        {GENRES.map((genre) => {
          const isActive = genreIds.includes(genre.id);

          return (
            <button
              key={genre.id}
              type="button"
              onClick={() => toggleGenre(genre.id)}
              aria-pressed={isActive}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition duration-200 ease-soft active:scale-95 ${
                isActive
                  ? "border-accent bg-accent text-on-accent"
                  : "border-line text-ink-dim hover:border-line-strong hover:text-ink"
              }`}
            >
              {genre.name}
            </button>
          );
        })}
      </div>

      <div className="mt-10">
        {status === "error" ? (
          <StatusBlock
            tone="error"
            title="No pudimos cargar los resultados"
            description="La consulta a TMDB falló. Revisá la conexión y volvé a intentar."
            action={<RetryButton onClick={() => setAttempt((n) => n + 1)} />}
          />
        ) : status === "ready" && visibleData.length === 0 ? (
          <StatusBlock
            tone="empty"
            title="Sin resultados"
            description={
              genreParam
                ? "Ningún título coincide con esa combinación de géneros. Probá quitando alguno."
                : "No encontramos nada con ese término. Probá con otras palabras o cambiá el tipo de búsqueda."
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {status === "loading" ? (
              <PosterSkeletonGrid count={ITEMS_PER_VIEW} />
            ) : (
              visibleData.map((element, position) => (
                <PosterCard
                  key={element.id}
                  to={`/${searchType}/${element.id}`}
                  title={element.title || element.name || "Sin título"}
                  imageUrl={getImageUrl(
                    element.poster_path || element.profile_path
                  )}
                  meta={
                    element.release_date
                      ? element.release_date.split("-")[0]
                      : undefined
                  }
                  rating={element.vote_average}
                  shape={searchType === "person" ? "portrait" : "poster"}
                  enterIndex={position}
                />
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default ResultsPage;
