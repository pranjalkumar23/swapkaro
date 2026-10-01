import { redirect } from "next/navigation";
import { getUserId } from "@/lib/session";
import { getUserById } from "@/lib/store";

export async function getCurrentUser() {
  const userId = await getUserId();
  if (!userId) return null;
  return getUserById(userId);
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
