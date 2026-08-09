import { Routes, Route } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import DetailsId from "./components/Details";
import Home from "./components/Home";
import Filter from "./pages/Filter";
import { StateContext } from "./context/stateContext";

import "./App.css";

function App() {
  return (
    <StateContext>
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:type/:search" element={<Filter />} />
        <Route path="/:type/:ID" element={<DetailsId />} />
      </Routes>
    </StateContext>
  );
}

export default App;
