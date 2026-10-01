import { getItemsByOwner, getUserById, searchItems } from "@/lib/store";
import type { Item, User } from "@/lib/types";

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "this",
  "that",
  "have",
  "want",
  "looking",
  "need",
  "good",
  "condition",
  "used",
  "item",
  "any",
  "some",
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  );
}

export function scoreMatch(a: Item, b: Item): number {
  let score = 0;
  if (a.category === b.category) score += 50;

  const wordsA = tokenize(`${a.title} ${a.description}`);
  const wordsB = tokenize(`${b.title} ${b.description}`);
  let overlap = 0;
  for (const w of wordsA) if (wordsB.has(w)) overlap++;
  const denom = Math.max(1, Math.min(wordsA.size, wordsB.size));
  score += Math.round((overlap / denom) * 30);

  if (a.city === b.city) score += 20;

  return Math.min(100, score);
}

export type MatchCandidate = {
  myItem: Item;
  theirItem: Item;
  score: number;
};

export type PerfectMatch = {
  otherUser: User;
  myItemToOffer: Item;
  theirItemIWant: Item;
  score: number;
};

export async function getMatchesForUser(userId: string) {
  const myHaves = getItemsByOwner(userId, "HAVE").filter((i) => i.status === "ACTIVE");
  const myWants = getItemsByOwner(userId, "WANT").filter((i) => i.status === "ACTIVE");
  const otherHaves = searchItems({ type: "HAVE", excludeOwnerId: userId });
  const otherWants = searchItems({ type: "WANT", excludeOwnerId: userId });

  const MIN_SCORE = 25;

  const peopleWantWhatIHave: MatchCandidate[] = [];
  for (const have of myHaves) {
    for (const want of otherWants) {
      const score = scoreMatch(have, want);
      if (score >= MIN_SCORE) {
        peopleWantWhatIHave.push({ myItem: have, theirItem: want, score });
      }
    }
  }
  peopleWantWhatIHave.sort((x, y) => y.score - x.score);

  const iWantWhatTheyHave: MatchCandidate[] = [];
  for (const want of myWants) {
    for (const have of otherHaves) {
      const score = scoreMatch(want, have);
      if (score >= MIN_SCORE) {
        iWantWhatTheyHave.push({ myItem: want, theirItem: have, score });
      }
    }
  }
  iWantWhatTheyHave.sort((x, y) => y.score - x.score);

  // Perfect matches: same other user appears in both directions —
  // they want something I have AND I want something they have.
  const perfectMatches: PerfectMatch[] = [];
  const seenPairs = new Set<string>();
  for (const wantSide of peopleWantWhatIHave) {
    for (const haveSide of iWantWhatTheyHave) {
      if (wantSide.theirItem.ownerId !== haveSide.theirItem.ownerId) continue;
      const key = `${wantSide.myItem.id}-${haveSide.theirItem.id}`;
      if (seenPairs.has(key)) continue;
      seenPairs.add(key);
      const otherUser = getUserById(wantSide.theirItem.ownerId);
      if (!otherUser) continue;
      perfectMatches.push({
        otherUser,
        myItemToOffer: wantSide.myItem,
        theirItemIWant: haveSide.theirItem,
        score: Math.round((wantSide.score + haveSide.score) / 2),
      });
    }
  }
  perfectMatches.sort((x, y) => y.score - x.score);

  return {
    peopleWantWhatIHave: peopleWantWhatIHave.slice(0, 20),
    iWantWhatTheyHave: iWantWhatTheyHave.slice(0, 20),
    perfectMatches: perfectMatches.slice(0, 10),
    hasNoListings: myHaves.length === 0 && myWants.length === 0,
  };
}
