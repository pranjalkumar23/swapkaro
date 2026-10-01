import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getItemById, getMessagesForProposal, getProposalById, getUserById } from "@/lib/store";
import { sendMessageAction } from "../actions";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "badge-want",
  ACCEPTED: "badge-have",
  DECLINED: "bg-red-50 text-red-600",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default async function ProposalChatPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;

  const proposal = getProposalById(id);
  if (!proposal || (proposal.proposerId !== user.id && proposal.recipientId !== user.id)) notFound();

  const fromItem = getItemById(proposal.fromItemId);
  const toItem = getItemById(proposal.toItemId);
  const otherUserId = proposal.proposerId === user.id ? proposal.recipientId : proposal.proposerId;
  const otherUser = getUserById(otherUserId);
  const messages = getMessagesForProposal(proposal.id);

  if (!fromItem || !toItem || !otherUser) notFound();

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <Link href="/proposals" className="text-sm text-[var(--color-ink-muted)]">
        &larr; Back to proposals
      </Link>

      <div className="card p-5">
        <span className={`badge ${STATUS_STYLE[proposal.status]}`}>{proposal.status}</span>
        <p className="text-sm mt-3">
          <strong>{fromItem.emoji} {fromItem.title}</strong> ⇄ <strong>{toItem.emoji} {toItem.title}</strong>
        </p>
        <p className="text-xs text-[var(--color-ink-muted)] mt-1">
          Conversation with {otherUser.avatarEmoji} {otherUser.name} ({otherUser.city})
        </p>
      </div>

      <div className="card p-4 flex flex-col gap-3 min-h-[320px]">
        {messages.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-muted)] m-auto">
            No messages yet — say hello and sort out where to meet up.
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === user.id;
            return (
              <div key={m.id} className={`max-w-[80%] ${mine ? "self-end text-right" : "self-start"}`}>
                <div
                  className={`rounded-2xl px-4 py-2 text-sm inline-block ${
                    mine ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-secondary-light)] text-[var(--color-ink)]"
                  }`}
                >
                  {m.content}
                </div>
                <p className="text-[10px] text-[var(--color-ink-muted)] mt-1">
                  {new Date(m.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                </p>
              </div>
            );
          })
        )}
      </div>

      <form action={sendMessageAction} className="flex gap-2">
        <input type="hidden" name="proposalId" value={proposal.id} />
        <input
          className="input flex-1"
          name="content"
          type="text"
          placeholder="Message about meetup logistics…"
          autoComplete="off"
          required
        />
        <button type="submit" className="btn btn-primary px-4">
          Send
        </button>
      </form>
    </div>
  );
}
