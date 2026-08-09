import { Routes, Route } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import DetailsId from "./components/Details";
import Home from "./components/Home";
import Filter from "./pages/Filter";
import { StateProvider } from "./context/StateProvider";

function App() {
  return (
    <StateProvider>
      <div className="scrollbar-brand min-h-[100dvh] bg-canvas">
        <SearchBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search/:type/:search" element={<Filter />} />
          <Route path="/:type/:ID" element={<DetailsId />} />
        </Routes>
      </div>
    </StateProvider>
  );
}

export default App;
