import { redirect } from "next/navigation";
import { getSession } from "@/src/lib/session";

export default async function AdminIndex() {
  const session = await getSession();
  redirect(session.userId ? "/admin/dashboard" : "/admin/login");
}
