import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { CATEGORIES, CATEGORY_EMOJI } from "@/lib/constants";

const STEPS = [
  {
    n: "01",
    title: "List",
    body: "Post what you have to give away, and what you're hoping to find — with photos, category, and your city.",
    emoji: "📝",
  },
  {
    n: "02",
    title: "Get Matched",
    body: "SwapKaro's matching engine compares your listings against everyone else's and surfaces the best trades near you.",
    emoji: "🤝",
  },
  {
    n: "03",
    title: "Propose",
    body: "Send a swap offer. Values not quite equal? Add a small cash top-up to balance the deal.",
    emoji: "💬",
  },
  {
    n: "04",
    title: "Swap",
    body: "Meet locally or ship it. Confirm the swap and build your trust score for next time.",
    emoji: "📦",
  },
];

const BENEFITS = [
  {
    title: "Beat the cost of living",
    body: "Prices keep climbing. Trade what you don't need for what you do — without spending a rupee.",
    emoji: "💸",
  },
  {
    title: "Smart, two-way matching",
    body: "List your haves and wants — SwapKaro finds people whose wants match your haves, and vice versa.",
    emoji: "🎯",
  },
  {
    title: "Hyperlocal by design",
    body: "Matching favours your city and neighbourhood, so meetups are easy and shipping is optional.",
    emoji: "📍",
  },
  {
    title: "No middlemen, no fees",
    body: "Free to list, free to swap. Just two people making a fair deal — with an optional cash top-up if needed.",
    emoji: "🚫",
  },
];

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col flex-1">
      <header className="sticky top-0 z-30 backdrop-blur bg-[var(--color-bg)]/90 border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-extrabold text-[var(--color-primary)]">
            SwapKaro
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--color-ink-muted)]">
            <a href="#how-it-works" className="hover:text-[var(--color-ink)]">
              How it works
            </a>
            <a href="#categories" className="hover:text-[var(--color-ink)]">
              Categories
            </a>
            <a href="#why" className="hover:text-[var(--color-ink)]">
              Why SwapKaro
            </a>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/dashboard" className="btn btn-primary">
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost">
                  Log in
                </Link>
                <Link href="/signup" className="btn btn-primary">
                  Start Swapping Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
          <span className="badge badge-want mx-auto">🇮🇳 India&apos;s community swap marketplace</span>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold mt-6 leading-tight">
            Kuch Purana Do,
            <br />
            <span className="text-[var(--color-primary)]">Kuch Naya Lo.</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg text-[var(--color-ink-muted)] mt-6">
            List what you have. List what you want. SwapKaro matches you with the
            right person — no money required, no middlemen, just a fair trade.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href="/signup" className="btn btn-primary text-base px-6 py-3">
              Start Swapping Free
            </Link>
            <Link href="/explore" className="btn btn-outline text-base px-6 py-3">
              Browse listings as a guest
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mt-10 text-sm text-[var(--color-ink-muted)]">
            <span>✅ 100% free to join</span>
            <span>✅ No listing fees</span>
            <span>✅ Smart have/want matching</span>
            <span>✅ Optional cash top-up</span>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-display text-3xl font-bold text-center">How it works</h2>
          <p className="text-center text-[var(--color-ink-muted)] mt-2">
            Four steps from clutter to a trade you&apos;ll actually use.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {STEPS.map((step) => (
              <div key={step.n} className="card p-6">
                <div className="text-3xl">{step.emoji}</div>
                <div className="text-xs font-bold text-[var(--color-primary)] mt-3">{step.n}</div>
                <h3 className="font-display font-bold text-lg mt-1">{step.title}</h3>
                <p className="text-sm text-[var(--color-ink-muted)] mt-2">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why SwapKaro */}
        <section id="why" className="bg-[var(--color-secondary-light)] py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-3xl font-bold text-center">Why SwapKaro?</h2>
            <p className="text-center text-[var(--color-ink-muted)] mt-2">
              Because the old way of trading actually worked.
            </p>
            <div className="grid sm:grid-cols-2 gap-5 mt-10">
              {BENEFITS.map((b) => (
                <div key={b.title} className="card p-6 flex gap-4">
                  <div className="text-3xl">{b.emoji}</div>
                  <div>
                    <h3 className="font-display font-bold text-lg">{b.title}</h3>
                    <p className="text-sm text-[var(--color-ink-muted)] mt-1">{b.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-display text-3xl font-bold text-center">
            If it has value, you can SwapKaro it
          </h2>
          <p className="text-center text-[var(--color-ink-muted)] mt-2">
            Trade anything — keep the value circulating in your community.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {CATEGORIES.map((c) => (
              <span
                key={c}
                className="badge bg-white border border-[var(--color-border)] text-[var(--color-ink)] px-4 py-2 text-sm"
              >
                {CATEGORY_EMOJI[c]} {c}
              </span>
            ))}
          </div>
        </section>

        {/* Cash top-up */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="card p-8 sm:p-10 text-center bg-[var(--color-accent-light)] border-[var(--color-accent)]">
            <div className="text-4xl">⚖️</div>
            <h2 className="font-display text-2xl font-bold mt-3">
              Not quite an even trade? Top it up.
            </h2>
            <p className="text-[var(--color-ink-muted)] mt-2 max-w-2xl mx-auto">
              If your item is worth a bit more or less, either side can offer a
              small cash top-up right inside the swap proposal — so fair deals
              happen even when items don&apos;t match perfectly in value.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="font-display text-3xl font-bold">Ready to declutter and discover?</h2>
          <p className="text-[var(--color-ink-muted)] mt-2">
            Create a free account and list your first item in under a minute.
          </p>
          <Link href="/signup" className="btn btn-primary text-base px-6 py-3 mt-6 inline-flex">
            Start Swapping Free
          </Link>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border)] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-[var(--color-ink-muted)]">
          <span className="font-display font-bold text-[var(--color-ink)]">SwapKaro</span>
          <span>&copy; {new Date().getFullYear()} SwapKaro. Not using it? SwapKaro it.</span>
        </div>
      </footer>
    </div>
  );
}
