import { useTrending } from "../hooks/useTrending";
import { getImageUrl } from "../service/tmdbApi";
import type { MediaSummary, MediaType } from "../types/tmdb";
import { PosterCard } from "./ui/PosterCard";
import type { PosterShape } from "./ui/PosterCard";
import { Pager } from "./ui/Pager";
import { PosterSkeletonGrid } from "./ui/Skeleton";
import { RetryButton, StatusBlock } from "./ui/StatusBlock";

const ITEMS_PER_VIEW = 4;

interface TrendingSectionProps {
  type: MediaType;
  title: string;
  shape?: PosterShape;
}

const getMeta = (item: MediaSummary, type: MediaType) => {
  if (type === "person") return item.known_for_department;

  const date = item.release_date || item.first_air_date;
  return date ? date.split("-")[0] : undefined;
};

export function TrendingSection({
  type,
  title,
  shape = "poster",
}: TrendingSectionProps) {
  const { items, status, retry, nextPage, previousPage, hasNext, hasPrevious } =
    useTrending(type, ITEMS_PER_VIEW);

  return (
    <section className="py-10 md:py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
          <span className="mr-3 inline-block h-4 w-1 translate-y-0.5 rounded-full bg-accent align-middle" />
          {title}
        </h2>
        {status === "ready" && (
          <Pager
            label={title}
            onPrevious={previousPage}
            onNext={nextPage}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
          />
        )}
      </div>

      {status === "error" ? (
        <StatusBlock
          tone="error"
          title="No pudimos cargar esta sección"
          description="La consulta a TMDB falló. Puede ser la conexión o un problema del servicio."
          action={<RetryButton onClick={retry} />}
        />
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          {status === "loading" ? (
            <PosterSkeletonGrid count={ITEMS_PER_VIEW} />
          ) : (
            items.map((item, position) => (
              <PosterCard
                key={item.id}
                to={`/${type}/${item.id}`}
                title={item.title || item.name || "Sin título"}
                imageUrl={getImageUrl(
                  shape === "portrait" ? item.profile_path : item.poster_path
                )}
                meta={getMeta(item, type)}
                rating={type === "person" ? undefined : item.vote_average}
                shape={shape}
                enterIndex={position}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
}
