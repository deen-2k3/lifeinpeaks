"use client";

import { useActionState } from "react";
import { subscribe, type NewsletterState } from "@/app/newsletter-actions";
import { cn } from "@/lib/utils";
import { ArrowRight } from "./icons";

export function NewsletterForm() {
  const [state, action, pending] = useActionState<NewsletterState, FormData>(subscribe, {});
  return (
    <form action={action} className="mt-4">
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex max-w-sm overflow-hidden rounded-md bg-snow">
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Your email address"
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/50 focus:outline-none"
        />
        <button disabled={pending} className="grid w-12 place-items-center bg-olive text-snow transition hover:bg-mountaingreen disabled:opacity-60" aria-label="Subscribe">
          <ArrowRight width={18} />
        </button>
      </div>
      {state.message && <p className={cn("mt-2 text-xs", state.ok ? "text-pine" : "text-ember")} role="status">{state.message}</p>}
    </form>
  );
}
