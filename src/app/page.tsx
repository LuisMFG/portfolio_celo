// src/app/page.tsx
import { redirect } from "next/navigation";
import { routing } from "@/src/i18n/routing";

export default function Page() {
  redirect(`/${routing.defaultLocale}`);
}
