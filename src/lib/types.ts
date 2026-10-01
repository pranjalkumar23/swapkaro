export type ItemType = "HAVE" | "WANT";
export type Condition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR";
export type ItemStatus = "ACTIVE" | "PENDING_TRADE" | "TRADED";
export type ProposalStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED";
export type CashFrom = "NONE" | "PROPOSER" | "RECIPIENT";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  rating: number;
  ratingCount: number;
  preferredCategories: string[];
  avatarEmoji: string;
  createdAt: string;
};

export type Item = {
  id: string;
  ownerId: string;
  type: ItemType;
  title: string;
  description: string;
  category: string;
  condition: Condition;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  emoji: string;
  images: string[];
  estValue: number;
  desiredExchange: string;
  cashTopupOk: boolean;
  cashTopupMax: number;
  status: ItemStatus;
  createdAt: string;
};

export type SwapProposal = {
  id: string;
  fromItemId: string;
  toItemId: string;
  proposerId: string;
  recipientId: string;
  message: string;
  cashFrom: CashFrom;
  cashAmount: number;
  status: ProposalStatus;
  createdAt: string;
};

export type Message = {
  id: string;
  proposalId: string;
  senderId: string;
  content: string;
  createdAt: string;
};
