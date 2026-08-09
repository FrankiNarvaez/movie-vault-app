import type { ReactNode } from "react";
import { MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";

interface StatusBlockProps {
  tone: "empty" | "error";
  title: string;
  description: string;
  action?: ReactNode;
}

/**
 * Composed empty and error states. The app previously rendered nothing at all
 * in both situations, which read as a broken page.
 */
export function StatusBlock({
  tone,
  title,
  description,
  action,
}: StatusBlockProps) {
  const Icon = tone === "error" ? WarningCircle : MagnifyingGlass;

  return (
    <div className="flex flex-col items-center rounded-card border border-line bg-surface/40 px-6 py-14 text-center">
      <Icon
        size={28}
        weight="bold"
        className={tone === "error" ? "text-accent" : "text-ink-faint"}
      />
      <p className="mt-4 text-base font-medium text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-ink-dim">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

interface RetryButtonProps {
  onClick: () => void;
}

export function RetryButton({ onClick }: RetryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-on-accent transition duration-200 ease-soft hover:bg-accent-hover active:scale-95"
    >
      Reintentar
    </button>
  );
}
