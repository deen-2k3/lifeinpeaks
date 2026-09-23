"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "./actions";
import { cn } from "@/lib/utils";

const initial: ContactState = { ok: false, message: "" };

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, initial);

  if (state.ok) {
    return (
      <div className="rounded-sm border border-forest/40 bg-moss/20 p-8" role="status">
        <p className="font-display text-3xl">Message sent.</p>
        <p className="mt-2 text-fog">{state.message}</p>
      </div>
    );
  }

  const field = "mt-2 w-full border-b border-line/15 bg-transparent py-3 text-lg text-mist placeholder:text-stone/50 focus:border-sand focus:outline-none";
  return (
    <form action={action} className="space-y-8" noValidate>
      <div className="hidden" aria-hidden>
        <label>Website <input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {(["name", "email"] as const).map((n) => (
        <div key={n}>
          <label htmlFor={n} className="eyebrow">{n === "name" ? "Your name" : "Email"}</label>
          <input id={n} name={n} type={n === "email" ? "email" : "text"} required autoComplete={n} className={cn(field, state.errors?.[n] && "border-ember")} aria-invalid={!!state.errors?.[n]} />
          {state.errors?.[n] && <p className="mt-2 text-sm text-ember">{state.errors[n]}</p>}
        </div>
      ))}
      <div>
        <label htmlFor="message" className="eyebrow">Message</label>
        <textarea id="message" name="message" rows={5} required placeholder="Where should I go next?" className={cn(field, "resize-y", state.errors?.message && "border-ember")} aria-invalid={!!state.errors?.message} />
        {state.errors?.message && <p className="mt-2 text-sm text-ember">{state.errors.message}</p>}
      </div>
      {state.message && !state.ok && <p className="text-sm text-ember" role="alert">{state.message}</p>}
      <button disabled={pending} className="inline-flex min-h-12 items-center rounded-full bg-cta px-8 text-[0.8rem] font-medium uppercase tracking-[0.16em] text-cta-fg transition hover:bg-cta-hover disabled:opacity-60">
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
