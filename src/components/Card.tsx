import type { Dispatch, SetStateAction } from "react";
import type { NavigateFunction } from "react-router-dom";
import Star from "../assets/rating-star.svg";
import { getImageUrl } from "../service/tmdbApi";
import type { MediaSummary, MediaType } from "../types/tmdb";
import "../styles/Cards.css";

interface CardProps {
  cards: MediaSummary[];
  nextPage: () => void;
  previousPage: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  setSearchType: Dispatch<SetStateAction<MediaType>>;
  navigate: NavigateFunction;
  type: MediaType;
  message: string;
}

export default function Card({
  cards,
  nextPage,
  previousPage,
  hasNext,
  hasPrevious,
  setSearchType,
  navigate,
  type,
  message,
}: CardProps) {
  const handleCardClick = (card: MediaSummary) => {
    setSearchType(type);
    navigate(`/${type}/${card.id}`);
  };

  return (
    <div className="main-card-container">
      <div className="card-container">
        <h2>{message}</h2>
        <div className="card-movie-list">
          {cards.map((card) => (
            <div key={card.id} className="movie-container">
              <img
                className="movie-img"
                src={getImageUrl(card.poster_path)}
                alt={card.title ?? card.name}
                onClick={() => handleCardClick(card)}
              />
              <div className="rating">
                <img src={Star} alt="Star of movie rating" />
                <p>{card.vote_average}</p>
              </div>
              <p>{card.title || card.name}</p>
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
    </div>
  );
}
