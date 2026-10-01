import Link from "next/link";
import { loginAction, quickLoginAction } from "../actions";
import { listDemoUsers } from "@/lib/store";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const demoUsers = listDemoUsers();

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-2xl font-extrabold text-[var(--color-primary)]">
          SwapKaro
        </Link>
        <h1 className="font-display text-2xl font-bold mt-6">Welcome back</h1>
        <p className="text-[var(--color-ink-muted)] mt-1 mb-6">
          Log in to see your matches and swap requests.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              className="input"
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              className="input"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
            <p className="text-xs text-[var(--color-ink-muted)] mt-1">
              This is a mock demo — any password works for an existing account.
            </p>
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Log in
          </button>
        </form>

        <div className="mt-8">
          <p className="text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wide mb-2">
            Or jump in as a demo user
          </p>
          <div className="grid grid-cols-2 gap-2">
            {demoUsers.map((u) => (
              <form key={u.id} action={quickLoginAction}>
                <input type="hidden" name="userId" value={u.id} />
                <button type="submit" className="btn btn-outline text-sm w-full justify-start px-3 py-2">
                  {u.avatarEmoji} {u.name.split(" ")[0]}
                </button>
              </form>
            ))}
          </div>
        </div>

        <p className="text-sm text-[var(--color-ink-muted)] mt-6">
          New to SwapKaro?{" "}
          <Link href="/signup" className="text-[var(--color-primary)] font-semibold">
            Create a free account
          </Link>
        </p>
      </div>
    </main>
  );
}
