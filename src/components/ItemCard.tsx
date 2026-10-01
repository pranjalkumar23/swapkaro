import Link from "next/link";
import type { Item } from "@/lib/types";
import { CONDITIONS } from "@/lib/constants";

const CONDITION_LABEL = Object.fromEntries(CONDITIONS.map((c) => [c.value, c.label]));

const PLACEHOLDER_BG = ["#fef3c7", "#dbeafe", "#f3e8ff", "#dcfce7", "#fee2e2", "#e0f2fe"];

function placeholderColor(category: string) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) hash = (hash * 31 + category.charCodeAt(i)) % PLACEHOLDER_BG.length;
  return PLACEHOLDER_BG[Math.abs(hash)];
}

export function ItemCard({
  item,
  ownerName,
  distanceLabel,
  linkToDetail = true,
  footer,
}: {
  item: Item;
  ownerName?: string;
  distanceLabel?: string;
  linkToDetail?: boolean;
  footer?: React.ReactNode;
}) {
  const image = (
    <div className="relative aspect-square" style={{ background: item.images[0] ? undefined : placeholderColor(item.category) }}>
      {item.images[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-5xl">{item.emoji}</span>
      )}
      <span className="badge badge-tag absolute top-2 left-2">{item.category}</span>
      <span className={`badge absolute top-2 right-2 ${item.type === "HAVE" ? "badge-have" : "badge-want"}`}>
        {item.type === "HAVE" ? "Have" : "Want"}
      </span>
      {item.status !== "ACTIVE" && (
        <span className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
          <span className="badge bg-white text-[var(--color-ink)] border border-[var(--color-border)]">
            {item.status === "TRADED" ? "Traded" : "Pending trade"}
          </span>
        </span>
      )}
    </div>
  );

  return (
    <div className="card flex flex-col overflow-hidden">
      {linkToDetail ? <Link href={`/items/${item.id}`}>{image}</Link> : image}

      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-display font-bold leading-tight">
          {linkToDetail ? (
            <Link href={`/items/${item.id}`} className="hover:underline">
              {item.title}
            </Link>
          ) : (
            item.title
          )}
        </h3>

        <p className="text-sm text-[var(--color-ink-muted)] line-clamp-2">{item.description}</p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-ink-muted)]">
          <span>📍 {distanceLabel ?? item.city}</span>
          <span>· {CONDITION_LABEL[item.condition] ?? item.condition}</span>
          {ownerName && <span>· by {ownerName}</span>}
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="font-display font-bold text-lg">₹{item.estValue.toLocaleString("en-IN")}</span>
          <span className="text-xs text-[var(--color-ink-muted)]">estimated value</span>
        </div>

        {item.desiredExchange && (
          <p className="text-xs text-[var(--color-ink-muted)]">
            🔁 Looking for: <span className="text-[var(--color-ink)]">{item.desiredExchange}</span>
          </p>
        )}

        {item.cashTopupOk && item.cashTopupMax > 0 && (
          <span className="badge badge-perfect self-start">⚖️ Open to ₹{item.cashTopupMax} top-up</span>
        )}

        {footer}
      </div>
    </div>
  );
}
