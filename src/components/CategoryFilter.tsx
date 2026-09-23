import Link from "next/link";
import { cn } from "@/lib/utils";

export function CategoryFilter({ basePath, categories, active }: { basePath: string; categories: { slug: string; name: string }[]; active?: string }) {
  const items = [{ slug: "", name: "All" }, ...categories];
  return (
    <nav aria-label="Filter by category" className="sticky top-[var(--header-h)] z-30 -mx-4 mb-8 border-b border-line/5 bg-ink/80 px-4 backdrop-blur-lg sm:mx-0 sm:px-0">
      <ul className="flex gap-1 overflow-x-auto py-3 no-scrollbar">
        {items.map((c) => {
          const on = (active ?? "") === c.slug;
          return (
            <li key={c.slug || "all"} className="shrink-0">
              <Link
                href={c.slug ? `${basePath}?category=${c.slug}` : basePath}
                scroll={false}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center rounded-full px-4 text-[0.78rem] tracking-[0.08em] transition",
                  on ? "bg-cta text-cta-fg" : "text-fog hover:bg-line/5 hover:text-mist",
                )}
              >
                {c.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
