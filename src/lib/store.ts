import { randomUUID } from "node:crypto";
import { items as seedItems, messages as seedMessages, proposals as seedProposals, users as seedUsers } from "./mock-data";
import { coordsForCity } from "./geo";
import type { CashFrom, Condition, Item, ItemType, Message, ProposalStatus, SwapProposal, User } from "./types";

// In-memory mock "database". Resets whenever the server process restarts —
// there is no real backend or persistence layer here by design.
const globalStore = globalThis as unknown as {
  __swapkaroStore?: {
    users: User[];
    items: Item[];
    proposals: SwapProposal[];
    messages: Message[];
  };
};

const store =
  globalStore.__swapkaroStore ??
  (globalStore.__swapkaroStore = {
    users: seedUsers.map((u) => ({ ...u })),
    items: seedItems.map((i) => ({ ...i, images: [...i.images] })),
    proposals: seedProposals.map((p) => ({ ...p })),
    messages: seedMessages.map((m) => ({ ...m })),
  });

// --- Users ---

export function getUserById(id: string): User | null {
  return store.users.find((u) => u.id === id) ?? null;
}

export function getUserByEmail(email: string): User | null {
  const lower = email.trim().toLowerCase();
  return store.users.find((u) => u.email.toLowerCase() === lower) ?? null;
}

export function listDemoUsers(): User[] {
  return store.users.slice(0, 4);
}

export function createUser(data: { name: string; email: string; city: string; pincode: string }): User {
  const { lat, lng } = coordsForCity(data.city);
  const user: User = {
    id: randomUUID(),
    name: data.name,
    email: data.email.trim().toLowerCase(),
    phone: `9${Math.floor(100000000 + Math.random() * 899999999)}`,
    city: data.city,
    pincode: data.pincode,
    lat,
    lng,
    rating: 0,
    ratingCount: 0,
    preferredCategories: [],
    avatarEmoji: "🙂",
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  return user;
}

export function updateUser(id: string, patch: Partial<Pick<User, "name" | "city" | "pincode" | "preferredCategories" | "avatarEmoji">>): User | null {
  const user = getUserById(id);
  if (!user) return null;
  if (patch.city && patch.city !== user.city) {
    const { lat, lng } = coordsForCity(patch.city);
    user.lat = lat;
    user.lng = lng;
  }
  Object.assign(user, patch);
  return user;
}

// --- Items ---

export function getItemById(id: string): Item | null {
  return store.items.find((i) => i.id === id) ?? null;
}

export function getItemsByOwner(ownerId: string, type?: ItemType): Item[] {
  return store.items
    .filter((i) => i.ownerId === ownerId && (!type || i.type === type))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function searchItems(opts: {
  type: ItemType;
  excludeOwnerId?: string;
  category?: string;
  city?: string;
  q?: string;
}): Item[] {
  const q = opts.q?.trim().toLowerCase();
  const city = opts.city?.trim().toLowerCase();
  return store.items
    .filter((i) => i.type === opts.type)
    .filter((i) => i.status === "ACTIVE")
    .filter((i) => !opts.excludeOwnerId || i.ownerId !== opts.excludeOwnerId)
    .filter((i) => !opts.category || i.category === opts.category)
    .filter((i) => !city || i.city.toLowerCase().includes(city))
    .filter((i) => !q || i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function createItem(data: {
  ownerId: string;
  type: ItemType;
  title: string;
  description: string;
  category: string;
  condition: Condition;
  city: string;
  pincode: string;
  emoji: string;
  images: string[];
  estValue: number;
  desiredExchange: string;
  cashTopupOk: boolean;
  cashTopupMax: number;
}): Item {
  const { lat, lng } = coordsForCity(data.city);
  const item: Item = {
    id: randomUUID(),
    ...data,
    lat,
    lng,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  };
  store.items.push(item);
  return item;
}

export function updateItem(
  id: string,
  ownerId: string,
  patch: Partial<Omit<Item, "id" | "ownerId" | "createdAt">>
): Item | null {
  const item = store.items.find((i) => i.id === id && i.ownerId === ownerId);
  if (!item) return null;
  if (patch.city && patch.city !== item.city) {
    const { lat, lng } = coordsForCity(patch.city);
    item.lat = lat;
    item.lng = lng;
  }
  Object.assign(item, patch);
  return item;
}

export function deleteItem(id: string, ownerId: string): boolean {
  const idx = store.items.findIndex((i) => i.id === id && i.ownerId === ownerId);
  if (idx === -1) return false;
  store.items.splice(idx, 1);
  return true;
}

// --- Swap proposals ---

export function getProposalById(id: string): SwapProposal | null {
  return store.proposals.find((p) => p.id === id) ?? null;
}

export function getIncomingProposals(userId: string): SwapProposal[] {
  return store.proposals
    .filter((p) => p.recipientId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getOutgoingProposals(userId: string): SwapProposal[] {
  return store.proposals
    .filter((p) => p.proposerId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function createProposal(data: {
  fromItemId: string;
  toItemId: string;
  proposerId: string;
  recipientId: string;
  message: string;
  cashFrom: CashFrom;
  cashAmount: number;
}): SwapProposal {
  const proposal: SwapProposal = {
    id: randomUUID(),
    ...data,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  store.proposals.push(proposal);
  return proposal;
}

export function updateProposalStatus(id: string, userId: string, role: "recipient" | "proposer", status: ProposalStatus): SwapProposal | null {
  const proposal = store.proposals.find((p) => p.id === id);
  if (!proposal) return null;
  if (role === "recipient" && proposal.recipientId !== userId) return null;
  if (role === "proposer" && proposal.proposerId !== userId) return null;
  if (proposal.status !== "PENDING") return proposal;

  proposal.status = status;

  if (status === "ACCEPTED") {
    const fromItem = getItemById(proposal.fromItemId);
    const toItem = getItemById(proposal.toItemId);
    if (fromItem) fromItem.status = "TRADED";
    if (toItem) toItem.status = "TRADED";

    // Any other pending proposals touching either item are no longer possible.
    for (const other of store.proposals) {
      if (other.id === proposal.id || other.status !== "PENDING") continue;
      if ([other.fromItemId, other.toItemId].some((id) => id === proposal.fromItemId || id === proposal.toItemId)) {
        other.status = "CANCELLED";
      }
    }

    for (const uid of [proposal.proposerId, proposal.recipientId]) {
      const user = getUserById(uid);
      if (user) {
        user.rating = Math.round(((user.rating * user.ratingCount + 5) / (user.ratingCount + 1)) * 10) / 10;
        user.ratingCount += 1;
      }
    }
  }

  return proposal;
}

// --- Messages ---

export function getMessagesForProposal(proposalId: string): Message[] {
  return store.messages
    .filter((m) => m.proposalId === proposalId)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
}

export function addMessage(proposalId: string, senderId: string, content: string): Message {
  const message: Message = {
    id: randomUUID(),
    proposalId,
    senderId,
    content,
    createdAt: new Date().toISOString(),
  };
  store.messages.push(message);
  return message;
}
