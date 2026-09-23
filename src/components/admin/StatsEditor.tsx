"use client";

import { useState } from "react";

type Stat = { label: string; value: string };

/** Editable list of About-page statistics, serialised to a hidden JSON input. */
export function StatsEditor({ name, initial }: { name: string; initial: Stat[] }) {
  const [rows, setRows] = useState<Stat[]>(initial.length ? initial : [{ label: "", value: "" }]);
  const set = (i: number, patch: Partial<Stat>) => setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const input = "w-full rounded-sm border border-line/10 bg-coal px-3 py-2 text-sm focus:border-sand focus:outline-none";

  return (
    <div>
      <span className="text-sm text-fog">Statistics</span>
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      <div className="mt-2 space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <input value={r.value} onChange={(e) => set(i, { value: e.target.value })} placeholder="20+" className={input} aria-label="Value" />
            <input value={r.label} onChange={(e) => set(i, { label: e.target.value })} placeholder="Trips" className={input} aria-label="Label" />
            <button type="button" onClick={() => setRows((x) => x.filter((_, j) => j !== i))} className="px-2 text-stone hover:text-ember" aria-label="Remove">✕</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setRows((r) => [...r, { label: "", value: "" }])} className="mt-2 text-xs text-sand hover:underline">+ Add statistic</button>
    </div>
  );
}
