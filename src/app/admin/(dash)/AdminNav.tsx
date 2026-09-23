"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/trips", label: "Trips" },
  { href: "/admin/photos", label: "Photos" },
  { href: "/admin/stories", label: "Stories" },
  { href: "/admin/memories", label: "Memories" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/settings", label: "Site & About" },
  { href: "/admin/messages", label: "Messages" },
];

export function AdminNav({ unread }: { unread: number }) {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 no-scrollbar md:flex-col md:overflow-visible">
      {items.map((i) => {
        const on = i.href === "/admin" ? path === "/admin" : path.startsWith(i.href);
        return (
          <Link key={i.href} href={i.href} className={cn("flex shrink-0 items-center justify-between rounded-md px-3 py-2 text-sm transition", on ? "bg-line/[.07] text-mist" : "text-fog hover:bg-line/[.03] hover:text-mist")}>
            {i.label}
            {i.href === "/admin/messages" && unread > 0 && <span className="ml-2 rounded-full bg-ember px-1.5 text-[0.65rem] font-semibold text-ink">{unread}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
