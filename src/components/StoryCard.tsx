import Link from "next/link";
import type { StoryCardData } from "@/lib/queries";
import { cn, formatDate, readingTime } from "@/lib/utils";
import { Picture } from "./Picture";
import { Reveal } from "./Reveal";

export function StoryCard({ story, index = 0, layout = "stack" }: { story: StoryCardData; index?: number; layout?: "stack" | "row" }) {
  return (
    <Reveal delay={(index % 3) * 0.08}>
      <Link href={`/stories/${story.slug}`} className={cn("group block", layout === "row" && "grid items-center gap-6 sm:grid-cols-[1.1fr_1fr] sm:gap-10")}>
        <div className="relative aspect-[3/2] overflow-hidden rounded-sm bg-ash">
          {story.coverImage && (
            <Picture
              image={story.coverImage}
              alt={story.title}
              fill
              sizes={layout === "row" ? "(min-width: 640px) 55vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
              imgClassName="transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
            />
          )}
        </div>
        <div className={cn(layout === "stack" && "mt-5")}>
          <p className="flex flex-wrap items-center gap-x-3 text-[0.68rem] uppercase tracking-[0.22em] text-stone">
            <span>{formatDate(story.publishedAt)}</span>
            {story.location && <><span className="h-px w-4 bg-line/20" /><span>{story.location}</span></>}
            <span className="h-px w-4 bg-line/20" />
            <span>{readingTime(story.content)} min read</span>
          </p>
          <h3 className={cn("mt-3 font-display font-medium leading-tight text-mist transition-colors group-hover:text-sand", layout === "row" ? "text-4xl sm:text-5xl" : "text-3xl")}>
            {story.title}
          </h3>
          {story.excerpt && <p className="mt-3 line-clamp-3 leading-relaxed text-fog">{story.excerpt}</p>}
        </div>
      </Link>
    </Reveal>
  );
}
