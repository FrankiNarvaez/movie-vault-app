import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { FilmSlate, Star, User } from "@phosphor-icons/react";

export type PosterShape = "poster" | "portrait";

interface PosterCardProps {
  to: string;
  title: string;
  imageUrl: string;
  meta?: string;
  rating?: number;
  shape?: PosterShape;
  /** Position in the grid, used to stagger the entry animation. */
  enterIndex?: number;
}

/**
 * The single tile used by every grid in the app. It is a real anchor, so it is
 * focusable and keyboard operable; the previous version put onClick on a bare
 * <img>, which keyboard users could not reach at all.
 */
export function PosterCard({
  to,
  title,
  imageUrl,
  meta,
  rating,
  shape = "poster",
  enterIndex = 0,
}: PosterCardProps) {
  const FallbackIcon = shape === "portrait" ? User : FilmSlate;

  return (
    <Link
      to={to}
      className="animate-enter group block"
      style={{ "--enter-index": enterIndex } as CSSProperties}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-card bg-surface ring-1 ring-line transition duration-300 ease-soft group-hover:-translate-y-1 group-hover:ring-line-strong">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 ease-soft group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-faint">
            <FallbackIcon size={32} weight="bold" />
          </div>
        )}

        {typeof rating === "number" && rating > 0 && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-canvas/85 px-2 py-1 text-xs font-medium text-ink backdrop-blur-sm">
            <Star size={12} weight="fill" className="text-accent" />
            {rating.toFixed(1)}
          </span>
        )}
      </div>

      <h3 className="mt-3 line-clamp-2 text-sm font-medium text-ink transition-colors duration-200 group-hover:text-accent">
        {title}
      </h3>
      {meta && <p className="mt-1 text-xs text-ink-faint">{meta}</p>}
    </Link>
  );
}
