import Link from "next/link";
import { signupAction } from "../actions";
import { CITIES } from "@/lib/constants";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-2xl font-extrabold text-[var(--color-primary)]">
          SwapKaro
        </Link>
        <h1 className="font-display text-2xl font-bold mt-6">Create your account</h1>
        <p className="text-[var(--color-ink-muted)] mt-1 mb-6">
          Free forever. List, discover, swap.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}

        <form action={signupAction} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">
              Full name
            </label>
            <input className="input" id="name" name="name" type="text" placeholder="Priya Sharma" required />
          </div>
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
            <label className="label" htmlFor="city">
              City
            </label>
            <input
              className="input"
              id="city"
              name="city"
              type="text"
              placeholder="e.g. Pune"
              list="city-suggestions"
              required
            />
            <datalist id="city-suggestions">
              {CITIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="label" htmlFor="pincode">
              Pincode
            </label>
            <input
              className="input"
              id="pincode"
              name="pincode"
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              placeholder="e.g. 411045"
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
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
            <p className="text-xs text-[var(--color-ink-muted)] mt-1">
              This is a mock demo — your password isn&apos;t stored or checked.
            </p>
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Create free account
          </button>
        </form>

        <p className="text-sm text-[var(--color-ink-muted)] mt-6">
          Already swapping?{" "}
          <Link href="/login" className="text-[var(--color-primary)] font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
