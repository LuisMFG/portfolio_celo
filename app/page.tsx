// app/page.tsx
import { redirect } from "next/navigation";

export default function IndexPage() {
  // muda para o idioma padrão (pt)
  redirect("/pt");
}
