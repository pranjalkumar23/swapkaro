import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getItemById, getUserById } from "@/lib/store";
import { formatDistance, haversineKm } from "@/lib/geo";
import { CONDITIONS } from "@/lib/constants";
import { StarRating } from "@/components/StarRating";

const CONDITION_LABEL = Object.fromEntries(CONDITIONS.map((c) => [c.value, c.label]));

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getItemById(id);
  if (!item) notFound();

  const owner = getUserById(item.ownerId);
  const user = await getCurrentUser();
  const isOwner = user?.id === item.ownerId;
  const distanceLabel = user && owner ? formatDistance(haversineKm(user.lat, user.lng, item.lat, item.lng)) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href={item.type === "HAVE" ? "/explore" : "/wanted"} className="text-sm text-[var(--color-ink-muted)]">
        &larr; Back
      </Link>

      <div className="card overflow-hidden">
        {item.images.length > 0 ? (
          <div className="aspect-video bg-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-[3/1] flex items-center justify-center text-6xl bg-[var(--color-secondary-light)]">
            {item.emoji}
          </div>
        )}

        {item.images.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto">
            {item.images.slice(1).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" className="w-20 h-20 object-cover rounded-lg" />
            ))}
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className={`badge ${item.type === "HAVE" ? "badge-have" : "badge-want"} mb-2`}>
                {item.type === "HAVE" ? "Have" : "Want"}
              </span>
              <h1 className="font-display text-2xl font-bold">{item.title}</h1>
              <p className="text-sm text-[var(--color-ink-muted)] mt-1">{item.category}</p>
            </div>
            {item.status !== "ACTIVE" && (
              <span className="badge bg-gray-100 text-gray-500">
                {item.status === "TRADED" ? "Traded" : "Pending trade"}
              </span>
            )}
          </div>

          <p className="text-[var(--color-ink)]">{item.description}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--color-ink-muted)]">
            <span>📍 {distanceLabel ?? item.city}</span>
            <span>· {CONDITION_LABEL[item.condition] ?? item.condition}</span>
            <span className="font-display font-bold text-[var(--color-secondary)]">
              ₹{item.estValue.toLocaleString("en-IN")} est. value
            </span>
          </div>

          {item.desiredExchange && (
            <p className="text-sm">
              🔁 Looking for: <span className="font-medium">{item.desiredExchange}</span>
            </p>
          )}

          {item.cashTopupOk && item.cashTopupMax > 0 && (
            <span className="badge badge-perfect self-start">⚖️ Open to ₹{item.cashTopupMax} top-up</span>
          )}

          {owner && (
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--color-border)]">
              <div>
                <p className="text-sm font-semibold">
                  {owner.avatarEmoji} {owner.name}
                </p>
                <StarRating rating={owner.rating} count={owner.ratingCount} />
              </div>

              {isOwner ? (
                <Link href={`/dashboard/${item.id}/edit`} className="btn btn-outline text-sm px-4 py-2">
                  Edit listing
                </Link>
              ) : user ? (
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/91${owner.phone}?text=${encodeURIComponent(`Hi ${owner.name}, I saw your "${item.title}" on SwapKaro!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline text-sm px-4 py-2"
                  >
                    💬 WhatsApp
                  </a>
                  <Link href={`/proposals/new?toItemId=${item.id}`} className="btn btn-primary text-sm px-4 py-2">
                    {item.type === "HAVE" ? "Propose a swap" : "I have this!"}
                  </Link>
                </div>
              ) : (
                <Link href="/login" className="btn btn-primary text-sm px-4 py-2">
                  Log in to contact &amp; propose
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
