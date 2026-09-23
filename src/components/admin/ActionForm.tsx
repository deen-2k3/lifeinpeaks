"use client";

import { useActionState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { btn } from "./form";

export type ActionState = { ok?: boolean; message?: string };
type Action = (prev: ActionState, form: FormData) => Promise<ActionState>;

/** Wraps a server action with pending state and a success/error message. */
export function ActionForm({ action, children, submitLabel = "Save", className }: { action: Action; children: React.ReactNode; submitLabel?: string; className?: string }) {
  const [state, formAction, pending] = useActionState(action, {});
  const msg = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (state.message) msg.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [state]);

  return (
    <form action={formAction} className={cn("space-y-6", className)}>
      {children}
      <div className="sticky bottom-0 -mx-4 flex items-center gap-4 border-t border-line/5 bg-ink/90 px-4 py-4 backdrop-blur">
        <button className={btn.primary} disabled={pending}>{pending ? "Saving…" : submitLabel}</button>
        {state.message && (
          <p ref={msg} role="status" className={cn("text-sm", state.ok ? "text-pine" : "text-ember")}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

/** Small inline button form with a confirmation prompt (for deletes). */
export function ConfirmButton({ action, label, confirmText, className }: { action: () => Promise<void>; label: string; confirmText: string; className?: string }) {
  return (
    <form action={action} onSubmit={(e) => !confirm(confirmText) && e.preventDefault()}>
      <button className={className ?? btn.danger}>{label}</button>
    </form>
  );
}
