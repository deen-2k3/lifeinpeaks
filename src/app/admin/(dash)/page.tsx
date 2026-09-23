import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader, btn } from "@/components/admin/form";
import { formatShortDate } from "@/lib/utils";

export default async function AdminHome() {
  const [trips, photos, stories, memories, messages, recent] = await Promise.all([
    prisma.trip.count(),
    prisma.photo.count(),
    prisma.story.count(),
    prisma.memory.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const cards = [
    { label: "Trips", value: trips, href: "/admin/trips" },
    { label: "Photos", value: photos, href: "/admin/photos" },
    { label: "Stories", value: stories, href: "/admin/stories" },
    { label: "Memories", value: memories, href: "/admin/memories" },
    { label: "Unread messages", value: messages, href: "/admin/messages" },
  ];
  return (
    <>
      <AdminHeader title="Overview">
        <Link href="/admin/photos" className={btn.primary}>Upload photos</Link>
        <Link href="/admin/trips/new" className={btn.ghost}>New trip</Link>
        <Link href="/admin/stories/new" className={btn.ghost}>New story</Link>
      </AdminHeader>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-md border border-line/5 bg-coal p-5 transition hover:border-line/15">
            <p className="font-display text-5xl">{c.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone">{c.label}</p>
          </Link>
        ))}
      </div>
      <h2 className="mb-4 mt-12 font-display text-2xl">Latest messages</h2>
      {recent.length ? (
        <ul className="divide-y divide-line/5 rounded-md border border-line/5">
          {recent.map((m) => (
            <li key={m.id} className="flex gap-4 p-4 text-sm">
              <span className="w-24 shrink-0 text-stone">{formatShortDate(m.createdAt)}</span>
              <span className="w-40 shrink-0 truncate">{m.name}</span>
              <span className="truncate text-fog">{m.message}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-stone">No messages yet.</p>
      )}
    </>
  );
}
