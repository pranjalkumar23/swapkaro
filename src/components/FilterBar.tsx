import { CATEGORIES } from "@/lib/constants";

export function FilterBar({
  action,
  category,
  city,
  q,
  distance,
  matches,
  showDistance = false,
  showMatches = false,
}: {
  action: string;
  category?: string;
  city?: string;
  q?: string;
  distance?: string;
  matches?: string;
  showDistance?: boolean;
  showMatches?: boolean;
}) {
  const hasFilters = category || city || q || distance || matches;

  function pillHref(nextCategory?: string) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    if (distance) params.set("distance", distance);
    if (matches) params.set("matches", matches);
    if (nextCategory) params.set("category", nextCategory);
    const qs = params.toString();
    return qs ? `${action}?${qs}` : action;
  }

  return (
    <div className="space-y-3">
      <nav className="flex items-center gap-2 overflow-x-auto pb-1">
        <a href={pillHref()} className={`pill-filter ${!category ? "pill-filter-active" : ""}`}>
          All
        </a>
        {CATEGORIES.map((c) => (
          <a key={c} href={pillHref(c)} className={`pill-filter ${category === c ? "pill-filter-active" : ""}`}>
            {c}
          </a>
        ))}
      </nav>

      <form action={action} method="get" className="card p-4 flex flex-wrap gap-3 items-end">
        {category && <input type="hidden" name="category" value={category} />}
        <div className="flex-1 min-w-[160px]">
          <label className="label" htmlFor="q">
            Search
          </label>
          <input
            className="input"
            id="q"
            name="q"
            type="text"
            defaultValue={q}
            placeholder="Search title or description"
          />
        </div>
        <div className="min-w-[140px]">
          <label className="label" htmlFor="city">
            City
          </label>
          <input className="input" id="city" name="city" type="text" defaultValue={city} placeholder="Any city" />
        </div>
        {showDistance && (
          <div className="min-w-[140px]">
            <label className="label" htmlFor="distance">
              Distance
            </label>
            <select className="input" id="distance" name="distance" defaultValue={distance ?? ""}>
              <option value="">Any distance</option>
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
            </select>
          </div>
        )}
        {showMatches && (
          <label className="flex items-center gap-2 text-sm font-medium pb-2">
            <input type="checkbox" name="matches" value="1" defaultChecked={matches === "1"} />
            Matches my needs
          </label>
        )}
        <button type="submit" className="btn btn-primary">
          Filter
        </button>
        {hasFilters && (
          <a href={action} className="btn btn-ghost">
            Clear
          </a>
        )}
      </form>
    </div>
  );
}
