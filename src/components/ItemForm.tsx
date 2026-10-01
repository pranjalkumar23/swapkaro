"use client";

import { useState } from "react";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";
import { ImageUploader } from "@/components/ImageUploader";

type ItemFormValues = {
  title: string;
  description: string;
  category: string;
  condition: string;
  city: string;
  estValue: number;
  desiredExchange: string;
  images: string[];
  cashTopupOk: boolean;
  cashTopupMax: number;
};

export function ItemForm({
  action,
  type,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  type: "HAVE" | "WANT";
  defaultValues?: Partial<ItemFormValues>;
  submitLabel: string;
}) {
  const [cashTopupOk, setCashTopupOk] = useState(defaultValues?.cashTopupOk ?? false);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="type" value={type} />

      <div>
        <label className="label" htmlFor="title">
          Title
        </label>
        <input
          className="input"
          id="title"
          name="title"
          type="text"
          defaultValue={defaultValues?.title}
          placeholder={type === "HAVE" ? "e.g. Study table, barely used" : "e.g. Looking for a badminton racket"}
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="description">
          Description
        </label>
        <textarea
          className="input"
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description}
          placeholder="Add details that'll help someone match with you"
          required
        />
      </div>

      {type === "HAVE" && <ImageUploader name="images" defaultImages={defaultValues?.images} />}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="category">
            Category
          </label>
          <select
            className="input"
            id="category"
            name="category"
            defaultValue={defaultValues?.category ?? CATEGORIES[0]}
            required
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="condition">
            Condition
          </label>
          <select
            className="input"
            id="condition"
            name="condition"
            defaultValue={defaultValues?.condition ?? "GOOD"}
            required
          >
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="city">
            City
          </label>
          <input
            className="input"
            id="city"
            name="city"
            type="text"
            defaultValue={defaultValues?.city}
            placeholder="e.g. Pune"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="estValue">
            Estimated value (₹)
          </label>
          <input
            className="input"
            id="estValue"
            name="estValue"
            type="number"
            min={0}
            step={50}
            defaultValue={defaultValues?.estValue}
            placeholder="e.g. 2000"
            required
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="desiredExchange">
          {type === "HAVE" ? "What would you like in exchange? (optional)" : "Any other notes? (optional)"}
        </label>
        <input
          className="input"
          id="desiredExchange"
          name="desiredExchange"
          type="text"
          defaultValue={defaultValues?.desiredExchange}
          placeholder="e.g. Looking for an office chair or kitchen appliances"
        />
      </div>

      <div className="card p-4 bg-[var(--color-accent-light)] border-[var(--color-accent)]">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            name="cashTopupOk"
            checked={cashTopupOk}
            onChange={(e) => setCashTopupOk(e.target.checked)}
          />
          {type === "HAVE"
            ? "I'm open to a cash top-up if the swap isn't quite even"
            : "I'm willing to add cash on top of a swap for this"}
        </label>
        {cashTopupOk && (
          <div className="mt-3">
            <label className="label" htmlFor="cashTopupMax">
              Max top-up amount (₹)
            </label>
            <input
              className="input max-w-[160px]"
              id="cashTopupMax"
              name="cashTopupMax"
              type="number"
              min={0}
              step={50}
              defaultValue={defaultValues?.cashTopupMax ?? 500}
            />
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary w-full">
        {submitLabel}
      </button>
    </form>
  );
}
