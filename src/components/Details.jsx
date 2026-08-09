import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStateContext } from "../hooks/useStateContext";
import { usePagination } from "../hooks/usePagination";
import { fetchDetails, fetchSimilar, getImageUrl } from "../service/tmdbApi";
import Star from "../assets/rating-star.svg";

import "../styles/Details.css";

const ITEMS_PER_VIEW = 4;
const VALID_TYPES = ["movie", "tv", "person"];

// TMDB only exposes /similar for movies and TV shows.
const supportsSimilar = (type) => type === "movie" || type === "tv";

function DetailsId() {
  // The URL is the source of truth here, so a direct visit or a reload works
  // without depending on state left behind by a previous click.
  const { type, ID } = useParams();
  const navigate = useNavigate();
  const { setSearchType, setId } = useStateContext();

  const [information, setInformation] = useState(null);
  // Recommendations carry the request they belong to, so a stale list is
  // simply not rendered instead of being cleared from inside an effect.
  const [similar, setSimilar] = useState({ source: null, results: [] });
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

  const isValidType = VALID_TYPES.includes(type);

  // Mirror the URL into the shared state so the search bar stays in sync.
  useEffect(() => {
    if (!isValidType) return;

    setSearchType(type);
    setId(ID);
    reset();
  }, [type, ID, isValidType, reset, setId, setSearchType]);

  useEffect(() => {
    if (!isValidType || !ID) return;

    let cancelled = false;

    const loadDetails = async () => {
      try {
        const data = await fetchDetails(type, ID);
        if (!cancelled) setInformation(data);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [type, ID, isValidType]);

  useEffect(() => {
    if (!isValidType || !ID || !supportsSimilar(type)) return;

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
  }, [type, ID, page, isValidType, syncPage]);

  if (!isValidType) {
    return (
      <div className="details">
        <p>No encontramos ese contenido.</p>
      </div>
    );
  }

  const visibleRecommendations =
    similar.source === `${type}/${ID}/${page}`
      ? similar.results.slice(index, index + ITEMS_PER_VIEW)
      : [];

  return (
    <div className="details">
      {information && (
        <div className="details-container">
          <div className="image-container">
            <img
              src={
                getImageUrl(information.poster_path, "w400") ||
                getImageUrl(information.profile_path, "w400")
              }
              alt={information.id}
            />
          </div>
          <div className="info-container">
            <h1>{information.title || information.name}</h1>
            <div className="genres">
              {type !== "person" && <h3>Géneros:</h3>}
              {information.genres &&
                information.genres.map((genre) => (
                  <p key={genre.id}>{genre.name}</p>
                ))}
            </div>
            <div className="rating">
              {[...Array(Math.round(information.vote_average || 0)).keys()].map(
                (i) => (
                  <img key={i} src={Star} alt="Star of movie rating" />
                )
              )}
              <p>{information.vote_average || "N/A"}</p>
            </div>
            <div className="description">
              <p>{information.overview}</p>
            </div>
            {type === "person" && (
              <div>
                <h3>Detalles:</h3>
                {information.biography && (
                  <p>
                    <strong>Biografía:</strong> {information.biography}
                  </p>
                )}
                {information.birthday && (
                  <p>
                    <strong>Fecha de nacimiento:</strong> {information.birthday}
                  </p>
                )}
                {information.deathday && (
                  <p>
                    <strong>Fecha de muerte:</strong> {information.deathday}
                  </p>
                )}
                {information.also_known_as && (
                  <div>
                    <h3>Ver más Personas</h3>
                    {information.also_known_as.map((element) => (
                      <p key={element}>{element}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {supportsSimilar(type) && (
        <>
          <div className="card-container">
            <h3>Recomendaciones</h3>
            <div className="card-movie-list">
              {visibleRecommendations.map((recommendation) => (
                <div key={recommendation.id} className="movie-container">
                  <img
                    className="movie-img"
                    src={getImageUrl(recommendation.backdrop_path)}
                    alt={recommendation.title}
                    onClick={() => navigate(`/${type}/${recommendation.id}`)}
                  />
                  <p>{recommendation.title || recommendation.name}</p>
                  <p>{recommendation.vote_average}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card-buttons">
            <button
              className="previous-page trending-preview"
              onClick={previousPage}
              disabled={!hasPrevious}
            >
              previous
            </button>
            <button
              className="next-page trending-preview"
              onClick={nextPage}
              disabled={!hasNext}
            >
              next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default DetailsId;
