"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { addMessage, createProposal, getItemById, getProposalById, updateProposalStatus } from "@/lib/store";

const proposeSchema = z.object({
  toItemId: z.string().min(1),
  fromItemId: z.string().min(1, "Choose one of your items to offer"),
  message: z.string().trim().max(500).optional().default(""),
  cashFrom: z.enum(["NONE", "PROPOSER", "RECIPIENT"]),
  cashAmount: z.coerce.number().int().min(0).max(1000000),
});

export async function proposeSwapAction(formData: FormData) {
  const user = await requireUser();

  const parsed = proposeSchema.safeParse({
    toItemId: formData.get("toItemId"),
    fromItemId: formData.get("fromItemId"),
    message: formData.get("message"),
    cashFrom: formData.get("cashFrom"),
    cashAmount: formData.get("cashAmount") || 0,
  });

  if (!parsed.success) {
    const toItemId = String(formData.get("toItemId") ?? "");
    redirect(`/proposals/new?toItemId=${toItemId}&error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const data = parsed.data;

  const toItem = getItemById(data.toItemId);
  const fromItem = getItemById(data.fromItemId);

  if (!toItem || toItem.ownerId === user.id) {
    redirect("/explore?error=That listing is no longer available");
  }
  if (!fromItem || fromItem.ownerId !== user.id || fromItem.type !== "HAVE") {
    redirect(`/proposals/new?toItemId=${data.toItemId}&error=${encodeURIComponent("Pick a valid item of yours to offer")}`);
  }

  createProposal({
    fromItemId: fromItem!.id,
    toItemId: toItem!.id,
    proposerId: user.id,
    recipientId: toItem!.ownerId,
    message: data.message,
    cashFrom: data.cashAmount > 0 ? data.cashFrom : "NONE",
    cashAmount: data.cashAmount > 0 ? data.cashAmount : 0,
  });

  revalidatePath("/proposals");
  redirect("/proposals");
}

export async function respondProposalAction(formData: FormData) {
  const user = await requireUser();
  const proposalId = String(formData.get("proposalId") ?? "");
  const decision = String(formData.get("decision") ?? "");

  if (decision !== "ACCEPTED" && decision !== "DECLINED") {
    redirect("/proposals?error=Invalid decision");
  }

  updateProposalStatus(proposalId, user.id, "recipient", decision as "ACCEPTED" | "DECLINED");

  revalidatePath("/proposals");
  redirect("/proposals");
}

export async function cancelProposalAction(formData: FormData) {
  const user = await requireUser();
  const proposalId = String(formData.get("proposalId") ?? "");

  updateProposalStatus(proposalId, user.id, "proposer", "CANCELLED");

  revalidatePath("/proposals");
  redirect("/proposals");
}

export async function sendMessageAction(formData: FormData) {
  const user = await requireUser();
  const proposalId = String(formData.get("proposalId") ?? "");
  const content = String(formData.get("content") ?? "").trim();

  const proposal = getProposalById(proposalId);
  if (!proposal || (proposal.proposerId !== user.id && proposal.recipientId !== user.id)) {
    redirect("/proposals?error=Conversation not found");
  }
  if (content) {
    addMessage(proposalId, user.id, content.slice(0, 1000));
  }

  revalidatePath(`/proposals/${proposalId}`);
  redirect(`/proposals/${proposalId}`);
}
