import { TrendingSection } from "./TrendingSection";

function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 md:px-8">
      <TrendingSection type="movie" title="Películas en tendencia" />
      <div className="h-px bg-line" />
      <TrendingSection type="tv" title="Series en tendencia" />
      <div className="h-px bg-line" />
      <TrendingSection type="person" title="Personas del momento" shape="portrait" />
    </main>
  );
}

export default Home;
