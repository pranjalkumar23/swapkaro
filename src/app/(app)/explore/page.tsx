import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getUserById, searchItems } from "@/lib/store";
import { formatDistance, haversineKm } from "@/lib/geo";
import { ItemCard } from "@/components/ItemCard";
import { FilterBar } from "@/components/FilterBar";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; city?: string; q?: string; distance?: string; matches?: string }>;
}) {
  const user = await getCurrentUser();
  const { category, city, q, distance, matches } = await searchParams;

  let results = searchItems({
    type: "HAVE",
    excludeOwnerId: user?.id,
    category,
    city,
    q,
  }).map((item) => ({
    item,
    distanceKm: user ? haversineKm(user.lat, user.lng, item.lat, item.lng) : null,
  }));

  if (user && distance) {
    const max = Number(distance);
    results = results.filter((r) => (r.distanceKm ?? Infinity) <= max);
  }
  if (user && matches === "1") {
    results = results.filter((r) => user.preferredCategories.includes(r.item.category));
  }
  if (user) {
    results.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Explore listings</h1>
        <p className="text-[var(--color-ink-muted)] mt-1">
          Browse what other people have to swap. Found something? Propose a trade.
        </p>
      </div>

      <FilterBar
        action="/explore"
        category={category}
        city={city}
        q={q}
        distance={distance}
        matches={matches}
        showDistance={Boolean(user)}
        showMatches={Boolean(user)}
      />

      {results.length === 0 ? (
        <div className="card p-10 text-center text-[var(--color-ink-muted)]">
          Nothing matches those filters yet — try widening your search.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map(({ item, distanceKm }) => {
            const owner = getUserById(item.ownerId);
            return (
              <ItemCard
                key={item.id}
                item={item}
                ownerName={owner?.name}
                distanceLabel={distanceKm !== null ? formatDistance(distanceKm) : undefined}
                footer={
                  <div className="flex flex-col gap-2 mt-1">
                    {user ? (
                      <>
                        <Link href={`/proposals/new?toItemId=${item.id}`} className="btn btn-primary text-sm px-3 py-1.5">
                          Propose a swap
                        </Link>
                        {owner && (
                          <a
                            href={`https://wa.me/91${owner.phone}?text=${encodeURIComponent(`Hi ${owner.name}, I saw your "${item.title}" on SwapKaro!`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline text-sm px-3 py-1.5"
                          >
                            💬 Contact on WhatsApp
                          </a>
                        )}
                      </>
                    ) : (
                      <Link href="/login" className="btn btn-outline text-sm px-3 py-1.5">
                        Log in to propose a trade
                      </Link>
                    )}
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
