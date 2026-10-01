"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createItem, deleteItem, updateItem } from "@/lib/store";
import { CATEGORIES, CATEGORY_EMOJI } from "@/lib/constants";

const itemSchema = z.object({
  type: z.enum(["HAVE", "WANT"]),
  title: z.string().trim().min(2, "Title is too short").max(80),
  description: z.string().trim().min(5, "Add a little more detail").max(500),
  category: z.enum(CATEGORIES),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR"]),
  city: z.string().trim().min(2, "City is required").max(60),
  estValue: z.coerce.number().int().min(0).max(10000000),
  desiredExchange: z.string().trim().max(200).optional().default(""),
  images: z.array(z.string()).max(5).optional().default([]),
  cashTopupOk: z.boolean(),
  cashTopupMax: z.coerce.number().int().min(0).max(1000000),
});

function parseItemForm(formData: FormData) {
  return itemSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    condition: formData.get("condition"),
    city: formData.get("city"),
    estValue: formData.get("estValue") || 0,
    desiredExchange: formData.get("desiredExchange") ?? "",
    images: formData.getAll("images").map(String),
    cashTopupOk: formData.get("cashTopupOk") === "on",
    cashTopupMax: formData.get("cashTopupMax") || 0,
  });
}

export async function createItemAction(formData: FormData) {
  const user = await requireUser();
  const parsed = parseItemForm(formData);

  if (!parsed.success) {
    redirect(`/dashboard?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const data = parsed.data;
  createItem({
    ownerId: user.id,
    type: data.type,
    title: data.title,
    description: data.description,
    category: data.category,
    condition: data.condition,
    city: data.city,
    pincode: user.pincode,
    emoji: CATEGORY_EMOJI[data.category] ?? "📦",
    images: data.images,
    estValue: data.estValue,
    desiredExchange: data.desiredExchange,
    cashTopupOk: data.cashTopupOk,
    cashTopupMax: data.cashTopupOk ? data.cashTopupMax : 0,
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateItemAction(itemId: string, formData: FormData) {
  const user = await requireUser();
  const parsed = parseItemForm(formData);
  if (!parsed.success) {
    redirect(`/dashboard/${itemId}/edit?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const data = parsed.data;
  const updated = updateItem(itemId, user.id, {
    title: data.title,
    description: data.description,
    category: data.category,
    condition: data.condition,
    city: data.city,
    emoji: CATEGORY_EMOJI[data.category] ?? "📦",
    images: data.images,
    estValue: data.estValue,
    desiredExchange: data.desiredExchange,
    cashTopupOk: data.cashTopupOk,
    cashTopupMax: data.cashTopupOk ? data.cashTopupMax : 0,
  });
  if (!updated) redirect("/dashboard?error=Listing not found");

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteItemAction(formData: FormData) {
  const user = await requireUser();
  const itemId = String(formData.get("itemId") ?? "");
  deleteItem(itemId, user.id);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
