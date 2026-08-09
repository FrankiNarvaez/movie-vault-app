import { useNavigate } from "react-router-dom";
import { useStateContext } from "../hooks/useStateContext";
import { useTrending } from "../hooks/useTrending";
import Card from "./Card";

const ITEMS_PER_VIEW = 4;

const TrendingTVPreview = () => {
  const navigate = useNavigate();
  const { setSearchType } = useStateContext();
  const { items, nextPage, previousPage, hasNext, hasPrevious } = useTrending(
    "tv",
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
      type="tv"
      message="Trending TV Shows"
    />
  );
};

export default TrendingTVPreview;
