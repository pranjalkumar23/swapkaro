import { requireUser } from "@/lib/auth";
import { updateProfileAction } from "./actions";
import { CATEGORIES, CATEGORY_EMOJI } from "@/lib/constants";
import { StarRating } from "@/components/StarRating";

const AVATAR_OPTIONS = ["🙂", "👩🏻", "👩🏽", "👩🏾", "🧑🏻", "🧑🏽", "🧑🏾", "👨🏻", "👨🏽", "👨🏾"];

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const user = await requireUser();
  const { error, saved } = await searchParams;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Your profile</h1>
        <p className="text-[var(--color-ink-muted)] mt-1">
          Update your location and what you&apos;re generally interested in — this powers your matches and
          the distance shown to other users.
        </p>
      </div>

      <div className="card p-5 flex items-center justify-between">
        <div>
          <p className="font-semibold">{user.email}</p>
          <p className="text-xs text-[var(--color-ink-muted)] mt-1">
            Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </p>
        </div>
        <StarRating rating={user.rating} count={user.ratingCount} size="md" />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">{error}</div>
      )}
      {saved && (
        <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2">
          Profile updated.
        </div>
      )}

      <form action={updateProfileAction} className="card p-6 space-y-4">
        <div>
          <label className="label" htmlFor="name">
            Full name
          </label>
          <input className="input" id="name" name="name" type="text" defaultValue={user.name} required />
        </div>

        <div>
          <label className="label">Avatar</label>
          <div className="flex flex-wrap gap-2">
            {AVATAR_OPTIONS.map((emoji) => (
              <label key={emoji} className="cursor-pointer">
                <input
                  type="radio"
                  name="avatarEmoji"
                  value={emoji}
                  defaultChecked={user.avatarEmoji === emoji}
                  className="peer hidden"
                />
                <span className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-border)] text-xl peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary-light)]">
                  {emoji}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="city">
              City
            </label>
            <input className="input" id="city" name="city" type="text" defaultValue={user.city} required />
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
              defaultValue={user.pincode}
              required
            />
          </div>
        </div>

        <div>
          <label className="label">Looking for (helps SwapKaro match you)</label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {CATEGORIES.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="preferredCategories"
                  value={c}
                  defaultChecked={user.preferredCategories.includes(c)}
                />
                {CATEGORY_EMOJI[c]} {c}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Save changes
        </button>
      </form>
    </div>
  );
}
