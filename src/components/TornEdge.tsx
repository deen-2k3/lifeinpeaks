import { tornStripPath } from "@/lib/torn";
import { cn } from "@/lib/utils";

/**
 * A torn-paper strip drawn in `currentColor`. Place it at the top or bottom of a section
 * (absolute) and colour it like the neighbouring section, e.g. `text-coal`.
 */
export function TornEdge({ position = "bottom", seed = 7, className }: { position?: "top" | "bottom"; seed?: number; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 40"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute inset-x-0 z-10 h-4 w-full fill-current sm:h-6",
        position === "bottom" ? "-bottom-px" : "-top-px rotate-180",
        className,
      )}
    >
      <path d={tornStripPath(seed)} />
    </svg>
  );
}
