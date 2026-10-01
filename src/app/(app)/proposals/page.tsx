import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getIncomingProposals, getItemById, getOutgoingProposals, getUserById } from "@/lib/store";
import { respondProposalAction, cancelProposalAction } from "./actions";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "badge-want",
  ACCEPTED: "badge-have",
  DECLINED: "bg-red-50 text-red-600",
  CANCELLED: "bg-gray-100 text-gray-500",
};

function CashNote({ cashFrom, cashAmount, proposerName, recipientName }: { cashFrom: string; cashAmount: number; proposerName: string; recipientName: string }) {
  if (cashFrom === "NONE" || cashAmount <= 0) return null;
  const payer = cashFrom === "PROPOSER" ? proposerName : recipientName;
  return (
    <p className="text-xs text-[var(--color-ink-muted)] mt-1">
      ⚖️ {payer} adds ₹{cashAmount} on top of the swap
    </p>
  );
}

export default async function ProposalsPage() {
  const user = await requireUser();

  const incoming = getIncomingProposals(user.id);
  const outgoing = getOutgoingProposals(user.id);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-2xl font-bold">Swap proposals</h1>
        <p className="text-[var(--color-ink-muted)] mt-1">Track offers you&apos;ve sent and received.</p>
      </div>

      <section>
        <h2 className="font-display text-xl font-bold">Incoming</h2>
        {incoming.length === 0 ? (
          <div className="card p-6 text-center text-[var(--color-ink-muted)] mt-4">
            Nobody has proposed a swap yet. List more items to attract offers.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {incoming.map((p) => {
              const fromItem = getItemById(p.fromItemId);
              const toItem = getItemById(p.toItemId);
              const proposer = getUserById(p.proposerId);
              const recipient = getUserById(p.recipientId);
              if (!fromItem || !toItem || !proposer || !recipient) return null;
              return (
                <div key={p.id} className="card p-5">
                  <span className={`badge ${STATUS_STYLE[p.status]}`}>{p.status}</span>
                  <p className="text-sm mt-3">
                    <strong>{proposer.name}</strong> offers{" "}
                    <strong>{fromItem.emoji} {fromItem.title}</strong> for your{" "}
                    <strong>{toItem.emoji} {toItem.title}</strong>
                  </p>
                  {p.message && <p className="text-sm text-[var(--color-ink-muted)] mt-2 italic">&ldquo;{p.message}&rdquo;</p>}
                  <CashNote cashFrom={p.cashFrom} cashAmount={p.cashAmount} proposerName={proposer.name} recipientName={recipient.name} />
                  <div className="flex gap-2 mt-4">
                    {p.status === "PENDING" && (
                      <>
                        <form action={respondProposalAction} className="flex-1">
                          <input type="hidden" name="proposalId" value={p.id} />
                          <input type="hidden" name="decision" value="ACCEPTED" />
                          <button type="submit" className="btn btn-secondary text-sm px-3 py-1.5 w-full">
                            Accept
                          </button>
                        </form>
                        <form action={respondProposalAction} className="flex-1">
                          <input type="hidden" name="proposalId" value={p.id} />
                          <input type="hidden" name="decision" value="DECLINED" />
                          <button type="submit" className="btn btn-outline text-sm px-3 py-1.5 w-full">
                            Decline
                          </button>
                        </form>
                      </>
                    )}
                    <Link href={`/proposals/${p.id}`} className="btn btn-ghost text-sm px-3 py-1.5">
                      💬 Chat
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl font-bold">Outgoing</h2>
        {outgoing.length === 0 ? (
          <div className="card p-6 text-center text-[var(--color-ink-muted)] mt-4">
            You haven&apos;t proposed any swaps yet — browse{" "}
            <a href="/explore" className="text-[var(--color-primary)] font-semibold">
              Explore
            </a>{" "}
            to get started.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {outgoing.map((p) => {
              const fromItem = getItemById(p.fromItemId);
              const toItem = getItemById(p.toItemId);
              const proposer = getUserById(p.proposerId);
              const recipient = getUserById(p.recipientId);
              if (!fromItem || !toItem || !proposer || !recipient) return null;
              return (
                <div key={p.id} className="card p-5">
                  <span className={`badge ${STATUS_STYLE[p.status]}`}>{p.status}</span>
                  <p className="text-sm mt-3">
                    You offered <strong>{fromItem.emoji} {fromItem.title}</strong> for{" "}
                    <strong>{recipient.name}</strong>&apos;s{" "}
                    <strong>{toItem.emoji} {toItem.title}</strong>
                  </p>
                  {p.message && <p className="text-sm text-[var(--color-ink-muted)] mt-2 italic">&ldquo;{p.message}&rdquo;</p>}
                  <CashNote cashFrom={p.cashFrom} cashAmount={p.cashAmount} proposerName={proposer.name} recipientName={recipient.name} />
                  <div className="flex gap-2 mt-4">
                    {p.status === "PENDING" && (
                      <form action={cancelProposalAction}>
                        <input type="hidden" name="proposalId" value={p.id} />
                        <button type="submit" className="btn btn-ghost text-sm px-3 py-1.5">
                          Cancel proposal
                        </button>
                      </form>
                    )}
                    <Link href={`/proposals/${p.id}`} className="btn btn-ghost text-sm px-3 py-1.5">
                      💬 Chat
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
