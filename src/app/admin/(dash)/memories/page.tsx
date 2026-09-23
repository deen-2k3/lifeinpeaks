import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { imageUrl } from "@/lib/images";
import { imageSelect } from "@/lib/queries";
import { AdminHeader, btn } from "@/components/admin/form";
import { formatShortDate } from "@/lib/utils";

export default async function AdminMemories() {
  const memories = await prisma.memory.findMany({ orderBy: [{ date: "desc" }, { createdAt: "desc" }], include: { image: { select: imageSelect } } });
  return (
    <>
      <AdminHeader title="Little Moments">
        <Link href="/admin/memories/new" className={btn.primary}>+ Add memory</Link>
      </AdminHeader>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {memories.map((m) => (
          <li key={m.id}>
            <Link href={`/admin/memories/${m.id}`} className="block rounded-sm border border-line/5 bg-coal p-2 transition hover:border-line/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl(m.image, 480)} alt="" className="aspect-[4/3] w-full rounded-sm object-cover" loading="lazy" />
              <p className="mt-2 line-clamp-2 text-sm">{m.caption}</p>
              <p className="text-xs text-stone">{m.location} {m.date && `· ${formatShortDate(m.date)}`} {!m.published && "· draft"}</p>
            </Link>
          </li>
        ))}
      </ul>
      {!memories.length && <p className="text-stone">No memories yet.</p>}
    </>
  );
}
