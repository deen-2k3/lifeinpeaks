import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logout } from "../login/actions";
import { AdminNav } from "./AdminNav";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const unread = await prisma.contactMessage.count({ where: { read: false } });

  return (
    <div className="surface-dark min-h-dvh bg-ink text-mist md:grid md:grid-cols-[230px_1fr]">
      <aside className="border-b border-line/5 bg-coal md:sticky md:top-0 md:h-dvh md:border-b-0 md:border-r">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-5 py-5">
            <Link href="/admin" className="font-display text-2xl">Dashboard</Link>
            <Link href="/" target="_blank" className="text-xs text-stone hover:text-sand">View site ↗</Link>
          </div>
          <AdminNav unread={unread} />
          <div className="mt-auto hidden border-t border-line/5 p-5 text-xs text-stone md:block">
            <p className="truncate">{user.email}</p>
            <form action={logout}>
              <button className="mt-2 text-fog hover:text-ember">Sign out</button>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-12">{children}</main>
    </div>
  );
}
