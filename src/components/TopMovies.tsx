import { useNavigate } from "react-router-dom";
import { useStateContext } from "../hooks/useStateContext";
import { useTrending } from "../hooks/useTrending";
import Card from "./Card";

const ITEMS_PER_VIEW = 4;

const TrendingMoviesPreview = () => {
  const navigate = useNavigate();
  const { setSearchType } = useStateContext();
  const { items, nextPage, previousPage, hasNext, hasPrevious } = useTrending(
    "movie",
    ITEMS_PER_VIEW
  );

  return (
    <Card
      cards={items}
      nextPage={nextPage}
      previousPage={previousPage}
      hasNext={hasNext}
      hasPrevious={hasPrevious}
      setSearchType={setSearchType}
      navigate={navigate}
      type="movie"
      message="Trending Movies"
    />
  );
};

export default TrendingMoviesPreview;
