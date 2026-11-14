import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { admin } from "@/lib/supabase/admin";
import { synchroniserBoutique } from "@/lib/synchro";

export const dynamic = "force-dynamic";

// Lit les paniers abandonnés des boutiques de l'abonné connecté et planifie les relances.
export async function POST(request: Request) {
  const retour = (q: string) => NextResponse.redirect(new URL(`/compte?${q}`, request.url), { status: 303 });

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/connexion", request.url), { status: 303 });

  const db = admin();
  const { data: abonne } = await db.from("abonnes").select("statut").eq("id", user.id).maybeSingle();
  if (abonne?.statut !== "actif") return retour("erreur=inactif");

  const { data: boutiques } = await db
    .from("boutiques")
    .select("id, domaine_shopify, delai_relance1_minutes, delai_relance2_heures")
    .eq("abonne_id", user.id);
  if (!boutiques || boutiques.length === 0) return retour("erreur=aucune");

  // Pour l'instant : une seule application Shopify (la nôtre, boutique de test).
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return retour("erreur=config");

  let lus = 0, enregistres = 0, sansEmail = 0, termines = 0, planifiees = 0;
  try {
    for (const b of boutiques) {
      const s = await synchroniserBoutique(db, b, clientId, clientSecret);
      lus += s.lus; enregistres += s.enregistres; sansEmail += s.sansEmail; termines += s.termines; planifiees += s.planifiees;
    }
  } catch (e) {
    console.error("Synchronisation Shopify :", e instanceof Error ? e.message : "erreur inconnue");
    return retour(`erreur=lecture&detail=${encodeURIComponent(e instanceof Error ? e.message.slice(0, 120) : "inconnue")}`);
  }
  return retour(`sync=ok&lus=${lus}&enregistres=${enregistres}&sansemail=${sansEmail}&termines=${termines}&planifiees=${planifiees}`);
}
