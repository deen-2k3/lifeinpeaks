import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/form";
import { ConfirmButton } from "@/components/admin/ActionForm";
import { deleteMessage, deleteSubscriber, toggleMessageRead } from "@/app/admin/actions";
import { cn, formatDate } from "@/lib/utils";

export default async function AdminMessages() {
  const [messages, subscribers] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return (
    <>
      <AdminHeader title="Messages" />
      {!messages.length && <p className="text-stone">No messages yet. They'll appear here when someone uses the contact form.</p>}
      <ul className="space-y-3">
        {messages.map((m) => (
          <li key={m.id} className={cn("rounded-md border bg-coal p-5", m.read ? "border-line/5 opacity-70" : "border-sand/30")}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p>
                <span className="font-medium">{m.name}</span>{" "}
                <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`} className="text-sm text-sand hover:underline">{m.email}</a>
              </p>
              <span className="text-xs text-stone">{formatDate(m.createdAt)}</span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-fog">{m.message}</p>
            <div className="mt-4 flex gap-3 text-xs">
              <form action={toggleMessageRead.bind(null, m.id)}>
                <button className="text-stone hover:text-mist">Mark as {m.read ? "unread" : "read"}</button>
              </form>
              <ConfirmButton action={deleteMessage.bind(null, m.id)} label="Delete" confirmText="Delete this message?" className="text-stone hover:text-ember" />
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-14">
        <h2 className="mb-2 font-display text-3xl">Newsletter subscribers ({subscribers.length})</h2>
        {subscribers.length > 0 ? (
          <>
            <p className="mb-4 text-xs text-stone">Copy these into your email tool:</p>
            <textarea readOnly rows={Math.min(8, subscribers.length + 1)} value={subscribers.map((s) => s.email).join(", ")} className="mb-4 w-full max-w-2xl rounded-sm border border-line/10 bg-coal p-3 font-mono text-xs" />
            <ul className="max-w-2xl divide-y divide-line/5 rounded-md border border-line/5">
              {subscribers.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-4 px-4 py-2 text-sm">
                  <span>{s.email}</span>
                  <span className="flex items-center gap-4 text-xs text-stone">
                    {formatDate(s.createdAt)}
                    <ConfirmButton action={deleteSubscriber.bind(null, s.id)} label="Remove" confirmText={`Remove ${s.email}?`} className="hover:text-ember" />
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-stone">No subscribers yet.</p>
        )}
      </section>
    </>
  );
}
