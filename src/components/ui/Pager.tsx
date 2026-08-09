import { CaretLeft, CaretRight } from "@phosphor-icons/react";

interface PagerProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  label: string;
}

/**
 * Paired previous/next control. Disabled states are real, so the user never
 * navigates into an empty page.
 */
export function Pager({
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  label,
}: PagerProps) {
  const buttonClass =
    "flex size-9 items-center justify-center rounded-full border border-line text-ink transition duration-200 ease-soft enabled:hover:border-accent enabled:hover:text-accent enabled:active:scale-95 disabled:opacity-30";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!hasPrevious}
        aria-label={`${label}: anteriores`}
        className={buttonClass}
      >
        <CaretLeft size={16} weight="bold" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        aria-label={`${label}: siguientes`}
        className={buttonClass}
      >
        <CaretRight size={16} weight="bold" />
      </button>
    </div>
  );
}
