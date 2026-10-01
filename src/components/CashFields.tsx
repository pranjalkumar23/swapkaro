"use client";

import { useState } from "react";

export function CashFields({ defaultAmount = 0 }: { defaultAmount?: number }) {
  const [cashFrom, setCashFrom] = useState<"NONE" | "PROPOSER" | "RECIPIENT">("NONE");

  return (
    <div className="card p-4 bg-[var(--color-accent-light)] border-[var(--color-accent)] space-y-3">
      <p className="text-sm font-semibold">Balance the trade with a cash top-up (optional)</p>
      <div className="flex flex-col gap-2 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="cashFrom"
            value="NONE"
            checked={cashFrom === "NONE"}
            onChange={() => setCashFrom("NONE")}
          />
          No cash — straight swap
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="cashFrom"
            value="PROPOSER"
            checked={cashFrom === "PROPOSER"}
            onChange={() => setCashFrom("PROPOSER")}
          />
          I&apos;ll add cash on top of my item
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="cashFrom"
            value="RECIPIENT"
            checked={cashFrom === "RECIPIENT"}
            onChange={() => setCashFrom("RECIPIENT")}
          />
          I&apos;m asking them to add cash
        </label>
      </div>
      {cashFrom !== "NONE" && (
        <div>
          <label className="label" htmlFor="cashAmount">
            Amount (₹)
          </label>
          <input
            className="input max-w-[160px]"
            id="cashAmount"
            name="cashAmount"
            type="number"
            min={0}
            step={50}
            defaultValue={defaultAmount || 500}
          />
        </div>
      )}
      {cashFrom === "NONE" && <input type="hidden" name="cashAmount" value={0} />}
    </div>
  );
}
