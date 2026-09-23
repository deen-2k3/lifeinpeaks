import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader, btn } from "@/components/admin/form";
import { formatShortDate } from "@/lib/utils";

export default async function AdminStories() {
  const stories = await prisma.story.findMany({ orderBy: { publishedAt: "desc" }, include: { trip: { select: { title: true } } } });
  return (
    <>
      <AdminHeader title="Stories">
        <Link href="/admin/stories/new" className={btn.primary}>+ New story</Link>
      </AdminHeader>
      <ul className="divide-y divide-line/5 rounded-md border border-line/5">
        {stories.map((s) => (
          <li key={s.id}>
            <Link href={`/admin/stories/${s.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-4 hover:bg-line/[.02]">
              <span className="flex-1 font-display text-2xl">{s.title}</span>
              <span className="text-xs text-stone">{s.trip?.title ?? "—"}</span>
              <span className="w-28 text-xs text-stone">{formatShortDate(s.publishedAt)}</span>
              {!s.published && <span className="text-xs uppercase text-ember">Draft</span>}
            </Link>
          </li>
        ))}
      </ul>
      {!stories.length && <p className="text-stone">No stories yet.</p>}
    </>
  );
}
