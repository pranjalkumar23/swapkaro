"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { updateUser } from "@/lib/store";
import { CATEGORIES } from "@/lib/constants";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(60),
  city: z.string().trim().min(2, "City is required").max(60),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  avatarEmoji: z.string().trim().min(1).max(4),
  preferredCategories: z.array(z.enum(CATEGORIES)).default([]),
});

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    city: formData.get("city"),
    pincode: formData.get("pincode"),
    avatarEmoji: formData.get("avatarEmoji"),
    preferredCategories: formData.getAll("preferredCategories").map(String),
  });

  if (!parsed.success) {
    redirect(`/profile?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  updateUser(user.id, parsed.data);
  redirect("/profile?saved=1");
}
