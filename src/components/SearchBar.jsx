import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchSearchResults, getImageUrl } from "../service/tmdbApi";
import { useStateContext } from "../hooks/useStateContext";
import logo from "../assets/imdb.png";

import "../styles/SearchBar.css";

const DEBOUNCE_MS = 300;
const MAX_DROPDOWN_RESULTS = 5;

const SearchComponent = () => {
  const navigate = useNavigate();
  const { type, search } = useParams();

  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { searchType, setSearchType, query, setQuery, setId } =
    useStateContext();

  useEffect(() => {
    if (type) {
      setSearchType(type);
    }
  }, [type, setSearchType]);

  useEffect(() => {
    setQuery(search ?? "");
  }, [search, setQuery]);

  useEffect(() => {
    if (!query) return;

    const timeoutId = setTimeout(async () => {
      try {
        const data = await fetchSearchResults(searchType, query);
        setResults(data.results.slice(0, MAX_DROPDOWN_RESULTS));
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [query, searchType]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (query.trim() === "") return;

    setShowDropdown(false);
    navigate(`/search/${searchType}/${query}`);
  };

  const handleResultClick = (result) => {
    setQuery(result.title || result.name);
    setShowDropdown(false);
    setId(result.id);
    navigate(`/${searchType}/${result.id}`);
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    setShowDropdown(true);
  };

  // An empty query has nothing to suggest, so the dropdown list is derived
  // here instead of being cleared from inside the debounce effect.
  const visibleResults = query ? results : [];

  const getResultSuffix = (result) => {
    if (searchType === "person") {
      return result.known_for_department
        ? ` - ${result.known_for_department}`
        : "";
    }

    const date = result.release_date || result.first_air_date;
    return date ? ` (${date.split("-")[0]})` : "";
  };

  return (
    <div className="search-container">
      <Link to="/">
        <img className="logo" src={logo} alt="IMDb" />
      </Link>
      <form onSubmit={handleSearch}>
        <div>
          <select
            className="select-button"
            value={searchType}
            onChange={(event) => setSearchType(event.target.value)}
          >
            <option value="movie">Películas</option>
            <option value="tv">TV Shows</option>
            <option value="person">Personas</option>
          </select>
        </div>
        <div className="input-button-container">
          <input
            className="input-search"
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Buscar..."
          />
          <button className="submit-button" type="submit">
            Buscar
          </button>
        </div>
      </form>

      {showDropdown && visibleResults.length > 0 && (
        <ul className="search-dropdown">
          {visibleResults.map((result) => (
            <li key={result.id} onClick={() => handleResultClick(result)}>
              <img
                className="a"
                src={
                  getImageUrl(result.poster_path, "w200") ||
                  getImageUrl(result.profile_path, "w200")
                }
                alt={result.title}
              />{" "}
              {result.title || result.name}
              {getResultSuffix(result)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchComponent;
