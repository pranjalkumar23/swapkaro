"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createUser, getUserByEmail, getUserById } from "@/lib/store";
import { createSession, destroySession } from "@/lib/session";

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(60),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  city: z.string().trim().min(2, "City is required").max(60),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});

export async function signupAction(formData: FormData) {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    city: formData.get("city"),
    pincode: formData.get("pincode"),
  });

  if (!parsed.success) {
    redirect(`/signup?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const { name, email, city, pincode } = parsed.data;

  const existing = getUserByEmail(email);
  if (existing) {
    redirect(`/signup?error=${encodeURIComponent("An account with this email already exists — try logging in instead")}`);
  }

  const user = createUser({ name, email, city, pincode });
  await createSession(user.id);
  redirect("/dashboard");
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    redirect(`/login?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const { email } = parsed.data;
  const user = getUserByEmail(email);

  if (!user) {
    redirect(`/login?error=${encodeURIComponent("No demo account with that email — try signing up, or use a quick demo login below")}`);
  }

  await createSession(user!.id);
  redirect("/dashboard");
}

export async function quickLoginAction(formData: FormData) {
  const userId = String(formData.get("userId") ?? "");
  const user = getUserById(userId);
  if (!user) redirect("/login?error=Unknown demo account");

  await createSession(user!.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
