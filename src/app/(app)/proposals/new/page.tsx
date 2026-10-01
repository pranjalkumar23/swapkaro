import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getItemById, getItemsByOwner, getUserById } from "@/lib/store";
import { proposeSwapAction } from "../actions";
import { ItemCard } from "@/components/ItemCard";
import { CashFields } from "@/components/CashFields";

export default async function NewProposalPage({
  searchParams,
}: {
  searchParams: Promise<{ toItemId?: string; myItemId?: string; context?: string; error?: string }>;
}) {
  const user = await requireUser();
  const { toItemId, myItemId, context, error } = await searchParams;

  if (!toItemId) notFound();

  const toItem = getItemById(toItemId);
  const myHaves = getItemsByOwner(user.id, "HAVE").filter((i) => i.status === "ACTIVE");

  if (!toItem || toItem.ownerId === user.id) notFound();
  const toItemOwner = getUserById(toItem.ownerId);
  if (!toItemOwner) notFound();

  const defaultFromItemId = myHaves.some((i) => i.id === myItemId) ? myItemId : undefined;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link href="/explore" className="text-sm text-[var(--color-ink-muted)]">
        &larr; Back
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold">Propose a swap</h1>
        <p className="text-[var(--color-ink-muted)] mt-1">
          You&apos;re proposing a trade with {toItemOwner.name} ({toItemOwner.city}).
        </p>
        {context && <p className="text-sm text-[var(--color-primary-dark)] mt-1">{context}</p>}
      </div>

      <ItemCard item={toItem} ownerName={toItemOwner.name} linkToDetail={false} />

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">{error}</div>
      )}

      {myHaves.length === 0 ? (
        <div className="card p-6 text-center text-[var(--color-ink-muted)]">
          You don&apos;t have anything listed yet.{" "}
          <Link href="/dashboard/new?type=HAVE" className="text-[var(--color-primary)] font-semibold">
            List an item
          </Link>{" "}
          before proposing a swap.
        </div>
      ) : (
        <form action={proposeSwapAction} className="space-y-4">
          <input type="hidden" name="toItemId" value={toItem.id} />

          <div>
            <label className="label" htmlFor="fromItemId">
              Offer one of your items
            </label>
            <select className="input" id="fromItemId" name="fromItemId" defaultValue={defaultFromItemId} required>
              <option value="" disabled>
                Choose an item
              </option>
              {myHaves.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.emoji} {item.title}
                </option>
              ))}
            </select>
          </div>

          <CashFields />

          <div>
            <label className="label" htmlFor="message">
              Message (optional)
            </label>
            <textarea
              className="input"
              id="message"
              name="message"
              rows={3}
              placeholder="Say a bit about why this swap works for you"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Send swap proposal
          </button>
        </form>
      )}
    </div>
  );
}
