import { useState } from "react";
import type { ReactNode } from "react";
import { StateContext } from "./stateContext";
import type { MediaType } from "../types/tmdb";

interface StateProviderProps {
  children: ReactNode;
}

export const StateProvider = ({ children }: StateProviderProps) => {
  const [searchType, setSearchType] = useState<MediaType>("movie");
  const [query, setQuery] = useState("");

  return (
    <StateContext.Provider
      value={{ searchType, query, setSearchType, setQuery }}
    >
      {children}
    </StateContext.Provider>
  );
};
