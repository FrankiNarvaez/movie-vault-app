import { createContext, useContext, useState } from "react";

export const Context = createContext();

export const StateContext = ({ children }) => {
  const [searchType, setSearchType] = useState("movie");
  const [query, setQuery] = useState("");
  const [id, setId] = useState("");

  return (
    <Context.Provider
      value={{ searchType, query, id, setSearchType, setQuery, setId }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
