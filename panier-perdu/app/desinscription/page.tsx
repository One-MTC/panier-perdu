import type { Metadata } from "next";
import { admin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Désinscription | Panier Perdu", robots: { index: false } };

export default async function Desinscription({ searchParams }: { searchParams: { b?: string; h?: string } }) {
  const { b, h } = searchParams;
  let ok = false;
  if (b && h && /^[0-9a-f-]{36}$/.test(b) && /^[0-9a-f]{64}$/.test(h)) {
    const db = admin();
    const { data } = await db.from("paniers").update({ desinscrit: true }).eq("boutique_id", b).eq("email_empreinte", h).select("id");
    if (data && data.length > 0) {
      await db.from("relances").update({ statut: "annulee" }).in("panier_id", data.map((x) => x.id)).eq("statut", "planifiee");
      ok = true;
    }
  }
  return (
    <main className="mx-auto max-w-md px-5 pt-12 pb-16">
      <h1 className="font-titre font-extrabold text-3xl leading-tight">{ok ? "C’est fait." : "Ce lien n’est plus valable."}</h1>
      <p className="mt-4 leading-relaxed text-gris">
        {ok
          ? "Tu ne recevras plus d’emails de relance de panier pour cette boutique."
          : "Si tu veux arrêter de recevoir ces emails et que ce lien ne fonctionne pas, réponds à l’un d’eux ou écris à la boutique concernée."}
      </p>
    </main>
  );
}
