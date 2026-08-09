import { useContext } from "react";
import { StateContext } from "../context/stateContext";
import type { StateContextValue } from "../context/stateContext";

export const useStateContext = (): StateContextValue => {
  const context = useContext(StateContext);

  if (!context) {
    throw new Error("useStateContext must be used inside a StateProvider");
  }

  return context;
};
