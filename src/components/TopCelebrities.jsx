import { useNavigate } from "react-router-dom";
import { useStateContext } from "../hooks/useStateContext";
import { useTrending } from "../hooks/useTrending";
import { getImageUrl } from "../service/tmdbApi";

import "../styles/Celebrities.css";

const ITEMS_PER_VIEW = 4;

const TrendingPeoplePreview = () => {
  const navigate = useNavigate();
  const { setSearchType, setId } = useStateContext();
  const { items, nextPage, previousPage, hasNext, hasPrevious } = useTrending(
    "person",
    ITEMS_PER_VIEW
  );

  const handlePersonClick = (person) => {
    setId(person.id);
    setSearchType("person");
    navigate(`/person/${person.id}`);
  };

  return (
    <div className="main-card-container">
      <div className="card-container">
        <h2>Trending People Today</h2>
        <div className="card-celebrity-list">
          {items.map((person) => (
            <div key={person.id} className="celebrity-container">
              <img
                className="persson-img"
                src={getImageUrl(person.profile_path)}
                alt={person.name}
                onClick={() => handlePersonClick(person)}
              />
              <h3>{person.name}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="card-buttons">
        <button
          className="previousPage trending-preview"
          onClick={previousPage}
          disabled={!hasPrevious}
        >
          previous
        </button>
        <button
          className="nextPage trending-preview"
          onClick={nextPage}
          disabled={!hasNext}
        >
          next
        </button>
      </div>
    </div>
  );
};

export default TrendingPeoplePreview;
