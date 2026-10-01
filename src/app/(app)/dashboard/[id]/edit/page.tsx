import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getItemById } from "@/lib/store";
import { updateItemAction } from "../../actions";
import { ItemForm } from "@/components/ItemForm";

export default async function EditItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const { error } = await searchParams;

  const item = getItemById(id);
  if (!item || item.ownerId !== user.id) notFound();

  const boundUpdate = updateItemAction.bind(null, item.id);

  return (
    <div className="max-w-lg mx-auto">
      <Link href="/dashboard" className="text-sm text-[var(--color-ink-muted)]">
        &larr; Back to my listings
      </Link>
      <h1 className="font-display text-2xl font-bold mt-3">Edit listing</h1>

      {error && (
        <div className="mb-4 mt-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <div className="card p-6 mt-6">
        <ItemForm
          action={boundUpdate}
          type={item.type}
          defaultValues={item}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
