import { cn } from "@/lib/utils";

// Plain, server-renderable form controls for the admin dashboard.

const control = "mt-1.5 w-full rounded-sm border border-line/10 bg-coal px-3 py-2.5 text-[0.95rem] text-mist placeholder:text-stone/50 focus:border-sand focus:outline-none";

type Base = { label: string; name: string; hint?: string; required?: boolean; className?: string };

export function Field({ label, name, hint, required, className, ...rest }: Base & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm text-fog">{label}{required && " *"}</span>
      <input name={name} required={required} className={control} {...rest} />
      {hint && <span className="mt-1 block text-xs text-stone">{hint}</span>}
    </label>
  );
}

export function TextArea({ label, name, hint, required, className, ...rest }: Base & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name">) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm text-fog">{label}{required && " *"}</span>
      <textarea name={name} required={required} className={cn(control, "font-mono text-sm leading-relaxed")} {...rest} />
      {hint && <span className="mt-1 block text-xs text-stone">{hint}</span>}
    </label>
  );
}

export function Select({ label, name, options, defaultValue, hint, className, empty = "— None —" }: Base & { options: { value: string; label: string }[]; defaultValue?: string | null; empty?: string | false }) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm text-fog">{label}</span>
      <select name={name} defaultValue={defaultValue ?? ""} className={control}>
        {empty !== false && <option value="">{empty}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint && <span className="mt-1 block text-xs text-stone">{hint}</span>}
    </label>
  );
}

export function Checkbox({ label, name, defaultChecked, value }: { label: string; name: string; defaultChecked?: boolean; value?: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-fog">
      <input type="checkbox" name={name} value={value ?? "on"} defaultChecked={defaultChecked} className="size-4 accent-[#4a6b52]" />
      {label}
    </label>
  );
}

export function Fieldset({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <fieldset className={cn("rounded-md border border-line/5 bg-line/[.015] p-5 sm:p-6", className)}>
      <legend className="px-2 text-xs uppercase tracking-[0.2em] text-stone">{title}</legend>
      <div className="grid gap-5">{children}</div>
    </fieldset>
  );
}

export function AdminHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <h1 className="font-display text-4xl text-mist">{title}</h1>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export const btn = {
  primary: "inline-flex min-h-10 items-center justify-center rounded-full bg-cta px-5 text-sm font-medium text-cta-fg transition hover:bg-cta-hover disabled:opacity-60",
  ghost: "inline-flex min-h-10 items-center justify-center rounded-full border border-line/15 px-5 text-sm text-fog transition hover:border-sand hover:text-mist",
  danger: "inline-flex min-h-10 items-center justify-center rounded-full border border-ember/40 px-5 text-sm text-ember transition hover:bg-ember hover:text-ink",
};
