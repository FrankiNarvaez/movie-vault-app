import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import { fetchSearchResults, getImageUrl } from "../service/tmdbApi";
import { useStateContext } from "../hooks/useStateContext";
import { isMediaType } from "../types/tmdb";
import type { MediaSummary } from "../types/tmdb";
import logo from "../assets/imdb.png";

const DEBOUNCE_MS = 300;
const MAX_DROPDOWN_RESULTS = 6;

const SearchComponent = () => {
  const navigate = useNavigate();
  // This component renders outside <Routes>, so useParams would always return
  // an empty object. useMatch reads the location directly and does work here.
  const searchMatch = useMatch("/search/:type/:search");
  const urlType = searchMatch?.params.type;
  const urlQuery = searchMatch?.params.search;

  const [results, setResults] = useState<MediaSummary[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { searchType, setSearchType, query, setQuery } = useStateContext();

  useEffect(() => {
    if (isMediaType(urlType)) {
      setSearchType(urlType);
    }
  }, [urlType, setSearchType]);

  useEffect(() => {
    if (urlQuery !== undefined) {
      setQuery(urlQuery);
    }
  }, [urlQuery, setQuery]);

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

  // A dropdown that only closes on submit traps the user. Escape and an
  // outside click both dismiss it.
  useEffect(() => {
    if (!showDropdown) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowDropdown(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!formRef.current?.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [showDropdown]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim() === "") return;

    setShowDropdown(false);
    navigate(`/search/${searchType}/${query}`);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setShowDropdown(true);
  };

  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (isMediaType(event.target.value)) {
      setSearchType(event.target.value);
    }
  };

  // An empty query has nothing to suggest, so the dropdown list is derived
  // here instead of being cleared from inside the debounce effect.
  const visibleResults = query ? results : [];

  const getResultMeta = (result: MediaSummary) => {
    if (searchType === "person") return result.known_for_department ?? "";

    const date = result.release_date || result.first_air_date;
    return date ? date.split("-")[0] : "";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-3 md:h-16 md:flex-nowrap md:gap-6 md:px-8 md:py-0">
        <Link to="/" className="shrink-0" aria-label="Ir al inicio">
          <img src={logo} alt="IMDb" className="h-7 w-auto md:h-8" />
        </Link>

        <form
          ref={formRef}
          onSubmit={handleSearch}
          className="relative ml-auto flex w-full items-center gap-2 md:w-auto md:max-w-xl md:flex-1"
        >
          <div className="relative shrink-0">
            <select
              value={searchType}
              onChange={handleTypeChange}
              aria-label="Tipo de búsqueda"
              className="appearance-none rounded-full border border-line bg-surface py-2 pl-4 pr-9 text-sm font-medium text-ink transition-colors duration-200 hover:border-line-strong"
            >
              <option value="movie">Películas</option>
              <option value="tv">Series</option>
              <option value="person">Personas</option>
            </select>
            <CaretDown
              size={14}
              weight="bold"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint"
            />
          </div>

          <div className="relative flex-1">
            <MagnifyingGlass
              size={16}
              weight="bold"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setShowDropdown(true)}
              placeholder="Buscar títulos o personas"
              className="w-full rounded-full border border-line bg-surface py-2 pl-10 pr-4 text-sm text-ink transition-colors duration-200 placeholder:text-ink-faint hover:border-line-strong"
            />
          </div>

          <button
            type="submit"
            className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition duration-200 ease-soft hover:bg-accent-hover active:scale-95"
          >
            Buscar
          </button>

          {showDropdown && visibleResults.length > 0 && (
            <ul className="scrollbar-brand absolute left-0 right-0 top-[calc(100%+0.5rem)] max-h-96 overflow-y-auto rounded-card border border-line bg-surface p-1.5 shadow-2xl shadow-black/50">
              {visibleResults.map((result) => (
                <li key={result.id}>
                  <Link
                    to={`/${searchType}/${result.id}`}
                    onClick={() => {
                      setQuery(result.title || result.name || "");
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-3 rounded-inset p-2 transition-colors duration-150 hover:bg-surface-hover"
                  >
                    <img
                      src={getImageUrl(
                        result.poster_path || result.profile_path,
                        "w200"
                      )}
                      alt=""
                      loading="lazy"
                      className="h-14 w-10 shrink-0 rounded-inset bg-canvas object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-ink">
                        {result.title || result.name}
                      </span>
                      <span className="block text-xs text-ink-faint">
                        {getResultMeta(result)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
    </header>
  );
};

export default SearchComponent;
