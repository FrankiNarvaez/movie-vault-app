import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { MediaType } from "../types/tmdb";

export interface StateContextValue {
  searchType: MediaType;
  query: string;
  setSearchType: Dispatch<SetStateAction<MediaType>>;
  setQuery: Dispatch<SetStateAction<string>>;
}

// Null is the "no provider above me" case, which useStateContext turns into a
// loud error instead of a confusing undefined further down the tree.
export const StateContext = createContext<StateContextValue | null>(null);
