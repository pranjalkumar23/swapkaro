import Link from "next/link";
import { logoutAction } from "@/app/(auth)/actions";
import type { User } from "@/lib/types";

const LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/wanted", label: "Wanted Board" },
];

const USER_LINKS = [
  { href: "/dashboard", label: "My Listings" },
  { href: "/matches", label: "Matches" },
  { href: "/proposals", label: "Proposals" },
];

export function Navbar({ user }: { user: User | null }) {
  const links = user ? [...LINKS, ...USER_LINKS] : LINKS;

  return (
    <header className="sticky top-0 z-30 bg-[var(--color-bg)]/95 backdrop-blur border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center text-base">
            🔁
          </span>
          <span className="font-display text-lg font-bold text-[var(--color-ink)]">SwapKaro</span>
        </Link>

        <form action="/explore" method="get" className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] text-sm">🔍</span>
            <input
              name="q"
              type="text"
              placeholder="Search listings…"
              className="input bg-[var(--color-primary-light)] border-transparent pl-9 py-2"
            />
          </div>
        </form>

        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-[var(--color-ink-muted)] shrink-0">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[var(--color-ink)] whitespace-nowrap">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0 ml-auto">
          {user ? (
            <>
              <Link href="/profile" className="text-sm text-[var(--color-ink-muted)] hidden sm:inline hover:text-[var(--color-ink)]">
                {user.avatarEmoji} {user.name} · {user.city}
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="btn btn-outline text-sm px-4 py-2">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost text-sm px-4 py-2">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary text-sm px-4 py-2">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
      <nav className="lg:hidden flex items-center gap-4 px-4 pb-3 text-sm font-medium text-[var(--color-ink-muted)] overflow-x-auto">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-[var(--color-ink)] whitespace-nowrap">
            {link.label}
          </Link>
        ))}
        {user && (
          <Link href="/profile" className="hover:text-[var(--color-ink)] whitespace-nowrap">
            Profile
          </Link>
        )}
      </nav>
    </header>
  );
}
