import { cn } from "@/lib/utils";

// Brand artwork lives in /public/brand (generated from brand/logo-source.webp by scripts/make-logo.mjs).
const SIZES = {
  wordmark: { w: 1138, h: 648 },
  full: { w: 1138, h: 824 },
  mark: { w: 883, h: 293 },
};

type Props = {
  variant?: keyof typeof SIZES;
  /** parchment = for dark (forest) backgrounds, forest = for light (parchment) backgrounds */
  tone?: "parchment" | "forest";
  alt: string;
  className?: string;
  priority?: boolean;
};

export function Logo({ variant = "wordmark", tone = "parchment", alt, className, priority }: Props) {
  const { w, h } = SIZES[variant];
  const base = `/brand/logo-${variant}-${tone}`;
  return (
    <picture>
      <source srcSet={`${base}.webp`} type="image/webp" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${base}.png`}
        alt={alt}
        width={w}
        height={h}
        className={cn("select-none", !/(^|\s)h-/.test(className ?? "") && "h-auto", className)}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        draggable={false}
      />
    </picture>
  );
}
