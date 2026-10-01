import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getMatchesForUser } from "@/lib/matching";
import { getUserById } from "@/lib/store";

function proposeUrl(toItemId: string, myItemId?: string, context?: string) {
  const params = new URLSearchParams({ toItemId });
  if (myItemId) params.set("myItemId", myItemId);
  if (context) params.set("context", context);
  return `/proposals/new?${params.toString()}`;
}

export default async function MatchesPage() {
  const user = await requireUser();
  const { perfectMatches, peopleWantWhatIHave, iWantWhatTheyHave, hasNoListings } =
    await getMatchesForUser(user.id);

  if (hasNoListings) {
    return (
      <div className="card p-10 text-center">
        <div className="text-4xl">🎯</div>
        <h1 className="font-display text-2xl font-bold mt-3">No listings yet</h1>
        <p className="text-[var(--color-ink-muted)] mt-2 max-w-md mx-auto">
          Add at least one thing you have or want, and SwapKaro will start
          matching you with real people.
        </p>
        <Link href="/dashboard" className="btn btn-primary mt-5 inline-flex">
          Go to my listings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-2xl font-bold">Your matches</h1>
        <p className="text-[var(--color-ink-muted)] mt-1">
          Ranked by category fit, keyword overlap, and how close the other person is to you.
        </p>
      </div>

      <section>
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          ⭐ Perfect matches
        </h2>
        <p className="text-sm text-[var(--color-ink-muted)] mt-1">
          You want something they have, and they want something you have — a true two-way swap.
        </p>
        {perfectMatches.length === 0 ? (
          <div className="card p-6 text-center text-[var(--color-ink-muted)] mt-4">
            No perfect matches yet. Add more listings to increase your odds.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {perfectMatches.map((m, i) => (
              <div key={i} className="card p-5 border-[var(--color-accent)]">
                <span className="badge badge-perfect">🎯 {m.score}% match</span>
                <p className="text-sm mt-3">
                  Offer your <strong>{m.myItemToOffer.emoji} {m.myItemToOffer.title}</strong> for{" "}
                  <strong>
                    {m.theirItemIWant.emoji} {m.theirItemIWant.title}
                  </strong>{" "}
                  from {m.otherUser.name} ({m.otherUser.city})
                </p>
                <Link
                  href={proposeUrl(m.theirItemIWant.id, m.myItemToOffer.id)}
                  className="btn btn-primary text-sm px-4 py-2 mt-4 inline-flex"
                >
                  Propose this swap
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl font-bold">🙋 People want what you have</h2>
        {peopleWantWhatIHave.length === 0 ? (
          <div className="card p-6 text-center text-[var(--color-ink-muted)] mt-4">
            Nobody&apos;s wanted board matches your listings yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {peopleWantWhatIHave.map((m) => (
              <div key={`${m.myItem.id}-${m.theirItem.id}`} className="card p-5">
                <span className="badge badge-have">{m.score}% match</span>
                <p className="text-sm mt-3">
                  Your <strong>{m.myItem.emoji} {m.myItem.title}</strong> matches{" "}
                  {getUserById(m.theirItem.ownerId)?.name}&apos;s want for{" "}
                  <strong>{m.theirItem.emoji} {m.theirItem.title}</strong>
                </p>
                <Link
                  href={proposeUrl(m.theirItem.id, m.myItem.id)}
                  className="btn btn-outline text-sm px-4 py-2 mt-4 inline-flex"
                >
                  Propose a swap
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl font-bold">🔍 You want what they have</h2>
        {iWantWhatTheyHave.length === 0 ? (
          <div className="card p-6 text-center text-[var(--color-ink-muted)] mt-4">
            Nothing on the Explore board matches your wants yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {iWantWhatTheyHave.map((m) => (
              <div key={`${m.myItem.id}-${m.theirItem.id}`} className="card p-5">
                <span className="badge badge-want">{m.score}% match</span>
                <p className="text-sm mt-3">
                  {getUserById(m.theirItem.ownerId)?.name} has{" "}
                  <strong>{m.theirItem.emoji} {m.theirItem.title}</strong> — matches your want for{" "}
                  <strong>{m.myItem.emoji} {m.myItem.title}</strong>
                </p>
                <Link
                  href={proposeUrl(m.theirItem.id, undefined, `Matches your want: ${m.myItem.title}`)}
                  className="btn btn-outline text-sm px-4 py-2 mt-4 inline-flex"
                >
                  Offer something for this
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
