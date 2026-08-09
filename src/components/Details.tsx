import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "@phosphor-icons/react";
import { useStateContext } from "../hooks/useStateContext";
import { usePagination } from "../hooks/usePagination";
import { fetchDetails, fetchSimilar, getImageUrl } from "../service/tmdbApi";
import { isMediaType } from "../types/tmdb";
import type {
  MediaDetails,
  MediaSummary,
  MediaType,
  RequestStatus,
} from "../types/tmdb";
import { PosterCard } from "./ui/PosterCard";
import { Pager } from "./ui/Pager";
import { PosterSkeletonGrid } from "./ui/Skeleton";
import { RetryButton, StatusBlock } from "./ui/StatusBlock";

const ITEMS_PER_VIEW = 4;

// TMDB only exposes /similar for movies and TV shows.
const supportsSimilar = (type: MediaType) => type === "movie" || type === "tv";

interface SimilarState {
  source: string | null;
  results: MediaSummary[];
}

function DetailsId() {
  // The URL is the source of truth here, so a direct visit or a reload works
  // without depending on state left behind by a previous click.
  const { type, ID } = useParams();
  const { setSearchType } = useStateContext();

  const [information, setInformation] = useState<MediaDetails | null>(null);
  const [status, setStatus] = useState<RequestStatus>("loading");
  const [attempt, setAttempt] = useState(0);
  // Recommendations carry the request they belong to, so a stale list is
  // simply not rendered instead of being cleared from inside an effect.
  const [similar, setSimilar] = useState<SimilarState>({
    source: null,
    results: [],
  });
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

  const retry = useCallback(() => setAttempt((current) => current + 1), []);

  // Mirror the URL into the shared state so the search bar stays in sync.
  useEffect(() => {
    if (!isMediaType(type)) return;

    setSearchType(type);
    reset();
  }, [type, reset, setSearchType]);

  useEffect(() => {
    if (!isMediaType(type) || !ID) return;

    let cancelled = false;

    const loadDetails = async () => {
      setStatus("loading");

      try {
        const data = await fetchDetails(type, ID);
        if (cancelled) return;

        setInformation(data);
        setStatus("ready");
      } catch (error) {
        if (cancelled) return;

        console.error("Error fetching details:", error);
        setStatus("error");
      }
    };

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [type, ID, attempt]);

  useEffect(() => {
    if (!isMediaType(type) || !ID || !supportsSimilar(type)) return;

    let cancelled = false;

    const loadRecommendations = async () => {
      try {
        const data = await fetchSimilar(type, ID, page);
        if (cancelled) return;

        setSimilar({ source: `${type}/${ID}/${page}`, results: data.results });
        syncPage(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, [type, ID, page, syncPage]);

  // Past this guard TypeScript knows `type` is a MediaType and `ID` a string,
  // so the rest of the component never has to re-check them.
  if (!isMediaType(type) || !ID) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-24 md:px-8">
        <StatusBlock
          tone="empty"
          title="No encontramos ese contenido"
          description="La dirección no corresponde a una película, serie o persona."
        />
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-24 md:px-8">
        <StatusBlock
          tone="error"
          title="No pudimos cargar la ficha"
          description="La consulta a TMDB falló. Revisá la conexión y volvé a intentar."
          action={<RetryButton onClick={retry} />}
        />
      </main>
    );
  }

  const visibleRecommendations =
    similar.source === `${type}/${ID}/${page}`
      ? similar.results.slice(index, index + ITEMS_PER_VIEW)
      : [];

  const releaseYear = information?.release_date || information?.first_air_date;
  const backdropUrl = getImageUrl(information?.backdrop_path, "w400");

  return (
    <div className="relative">
      {backdropUrl && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden opacity-20 md:h-96"
        >
          <img
            src={backdropUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-canvas" />
        </div>
      )}

      <main className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-10 md:px-8 md:pt-16">
        {status === "loading" || !information ? (
          <div className="grid gap-8 md:grid-cols-[minmax(0,15rem)_1fr] lg:gap-12">
            <div className="aspect-[2/3] animate-pulse rounded-card bg-surface" />
            <div className="space-y-4">
              <div className="h-9 w-2/3 animate-pulse rounded-full bg-surface" />
              <div className="h-4 w-1/3 animate-pulse rounded-full bg-surface" />
              <div className="h-24 w-full animate-pulse rounded-card bg-surface" />
            </div>
          </div>
        ) : (
          <article className="grid gap-8 md:grid-cols-[minmax(0,15rem)_1fr] lg:gap-12">
            <div className="mx-auto w-full max-w-64 md:mx-0 md:max-w-none">
              <div className="overflow-hidden rounded-card bg-surface ring-1 ring-line md:sticky md:top-24">
                <img
                  src={
                    getImageUrl(information.poster_path, "w400") ||
                    getImageUrl(information.profile_path, "w400")
                  }
                  alt={information.title ?? information.name}
                  className="aspect-[2/3] w-full object-cover"
                />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-ink md:text-4xl">
                {information.title || information.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-dim">
                {releaseYear && <span>{releaseYear.split("-")[0]}</span>}
                {typeof information.vote_average === "number" &&
                  information.vote_average > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Star size={14} weight="fill" className="text-accent" />
                      <span className="font-medium text-ink">
                        {information.vote_average.toFixed(1)}
                      </span>
                      <span className="text-ink-faint">/ 10</span>
                    </span>
                  )}
                {information.birthday && <span>Nació el {information.birthday}</span>}
                {information.deathday && <span>Falleció el {information.deathday}</span>}
              </div>

              {information.genres && information.genres.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {information.genres.map((genre) => (
                    <li
                      key={genre.id}
                      className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-dim"
                    >
                      {genre.name}
                    </li>
                  ))}
                </ul>
              )}

              {information.overview && (
                <p className="mt-6 max-w-[65ch] leading-relaxed text-ink-dim">
                  {information.overview}
                </p>
              )}

              {information.biography && (
                <p className="mt-6 max-w-[65ch] leading-relaxed text-ink-dim">
                  {information.biography}
                </p>
              )}

              {information.also_known_as &&
                information.also_known_as.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-sm font-semibold text-ink">
                      También conocido como
                    </h2>
                    <p className="mt-2 max-w-[65ch] text-sm text-ink-faint">
                      {information.also_known_as.join(", ")}
                    </p>
                  </div>
                )}
            </div>
          </article>
        )}

        {supportsSimilar(type) && (
          <section className="mt-16 border-t border-line pt-10 md:mt-20">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
                <span className="mr-3 inline-block h-4 w-1 translate-y-0.5 rounded-full bg-accent align-middle" />
                Títulos similares
              </h2>
              {visibleRecommendations.length > 0 && (
                <Pager
                  label="Títulos similares"
                  onPrevious={previousPage}
                  onNext={nextPage}
                  hasPrevious={hasPrevious}
                  hasNext={hasNext}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
              {visibleRecommendations.length === 0 ? (
                <PosterSkeletonGrid count={ITEMS_PER_VIEW} />
              ) : (
                visibleRecommendations.map((recommendation, position) => (
                  <PosterCard
                    key={recommendation.id}
                    to={`/${type}/${recommendation.id}`}
                    title={
                      recommendation.title ||
                      recommendation.name ||
                      "Sin título"
                    }
                    imageUrl={getImageUrl(recommendation.poster_path)}
                    rating={recommendation.vote_average}
                    enterIndex={position}
                  />
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default DetailsId;
