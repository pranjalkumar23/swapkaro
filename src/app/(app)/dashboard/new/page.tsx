import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createItemAction } from "../actions";
import { ItemForm } from "@/components/ItemForm";

export default async function NewItemPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; error?: string }>;
}) {
  const user = await requireUser();
  const { type, error } = await searchParams;

  if (type !== "HAVE" && type !== "WANT") notFound();

  return (
    <div className="max-w-lg mx-auto">
      <Link href="/dashboard" className="text-sm text-[var(--color-ink-muted)]">
        &larr; Back to my listings
      </Link>
      <h1 className="font-display text-2xl font-bold mt-3">
        {type === "HAVE" ? "List something you have" : "List something you want"}
      </h1>
      <p className="text-[var(--color-ink-muted)] mt-1 mb-6">
        {type === "HAVE"
          ? "Give it a clear title and a couple of details — this is what other people will see."
          : "Describe what you're hoping to find. SwapKaro will match it against everyone's listings."}
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <div className="card p-6">
        <ItemForm
          action={createItemAction}
          type={type}
          defaultValues={{ city: user.city, estValue: 0 }}
          submitLabel={type === "HAVE" ? "List this item" : "Add to wanted board"}
        />
      </div>
    </div>
  );
}
