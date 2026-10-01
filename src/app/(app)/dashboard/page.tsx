import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getItemsByOwner } from "@/lib/store";
import type { Item, ItemType } from "@/lib/types";
import { deleteItemAction } from "./actions";
import { ItemCard } from "@/components/ItemCard";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const { error } = await searchParams;

  const haves = getItemsByOwner(user.id, "HAVE");
  const wants = getItemsByOwner(user.id, "WANT");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold">Namaste, {user.name.split(" ")[0]} 👋</h1>
        <p className="text-[var(--color-ink-muted)] mt-1">
          Manage what you have and what you&apos;re looking for. SwapKaro matches them for you on the{" "}
          <Link href="/matches" className="text-[var(--color-primary)] font-semibold">
            Matches page
          </Link>
          .
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <ItemSection title="Things I have" emptyHint="List an item to start getting matched." type="HAVE" items={haves} />
      <ItemSection title="Things I want" emptyHint="Tell SwapKaro what you're hunting for." type="WANT" items={wants} />
    </div>
  );
}

function ItemSection({
  title,
  emptyHint,
  type,
  items,
}: {
  title: string;
  emptyHint: string;
  type: ItemType;
  items: Item[];
}) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        <Link href={`/dashboard/new?type=${type}`} className="btn btn-primary text-sm px-4 py-2">
          + Add
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="card p-8 text-center text-[var(--color-ink-muted)] mt-4">{emptyHint}</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              footer={
                <div className="mt-1">
                  {item.status !== "ACTIVE" && (
                    <span className="badge bg-gray-100 text-gray-500 mb-2">
                      {item.status === "TRADED" ? "Traded" : "Pending trade"}
                    </span>
                  )}
                  <div className="flex gap-2">
                    <Link href={`/dashboard/${item.id}/edit`} className="btn btn-outline text-sm px-3 py-1.5 flex-1">
                      Edit
                    </Link>
                    <form action={deleteItemAction} className="flex-1">
                      <input type="hidden" name="itemId" value={item.id} />
                      <button type="submit" className="btn btn-ghost text-sm px-3 py-1.5 w-full text-[var(--color-danger)]">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
