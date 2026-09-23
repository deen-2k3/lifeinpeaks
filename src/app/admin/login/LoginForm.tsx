"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, {});
  const input = "mt-2 w-full rounded-sm border border-line/10 bg-coal px-4 py-3 text-mist focus:border-sand focus:outline-none";
  return (
    <form action={action} className="mt-10 space-y-5">
      <input type="hidden" name="next" value={next} />
      <label className="block text-sm text-fog">
        Email
        <input name="email" type="email" required autoComplete="username" className={input} />
      </label>
      <label className="block text-sm text-fog">
        Password
        <input name="password" type="password" required autoComplete="current-password" className={input} />
      </label>
      {state.error && <p className="text-sm text-ember" role="alert">{state.error}</p>}
      <button disabled={pending} className="min-h-12 w-full rounded-full bg-cta text-sm font-medium uppercase tracking-[0.16em] text-cta-fg transition hover:bg-cta-hover disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
