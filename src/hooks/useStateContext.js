import { useContext } from "react";
import { StateContext } from "../context/stateContext";

export const useStateContext = () => useContext(StateContext);
