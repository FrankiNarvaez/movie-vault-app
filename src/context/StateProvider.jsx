import { useState } from "react";
import { StateContext } from "./stateContext";

export const StateProvider = ({ children }) => {
  const [searchType, setSearchType] = useState("movie");
  const [query, setQuery] = useState("");
  const [id, setId] = useState("");

  return (
    <StateContext.Provider
      value={{ searchType, query, id, setSearchType, setQuery, setId }}
    >
      {children}
    </StateContext.Provider>
  );
};
