import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { admin } from "@/lib/supabase/admin";
import { chiffrer, empreinte } from "@/lib/crypto";
import { jetonShopify, lirePaniers } from "@/lib/shopify";

export const dynamic = "force-dynamic";

// Lit les paniers abandonnés des boutiques de l'abonné connecté et les enregistre (emails chiffrés).
export async function POST(request: Request) {
  const retour = (q: string) => NextResponse.redirect(new URL(`/compte?${q}`, request.url), { status: 303 });

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/connexion", request.url), { status: 303 });

  const db = admin();
  const { data: abonne } = await db.from("abonnes").select("statut").eq("id", user.id).maybeSingle();
  if (abonne?.statut !== "actif") return retour("erreur=inactif");

  const { data: boutiques } = await db.from("boutiques").select("id, domaine_shopify").eq("abonne_id", user.id);
  if (!boutiques || boutiques.length === 0) return retour("erreur=aucune");

  // Pour l'instant : une seule application Shopify (la nôtre, boutique de test).
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return retour("erreur=config");

  let lus = 0, enregistres = 0, sansEmail = 0, termines = 0;
  try {
    for (const b of boutiques) {
      const jeton = await jetonShopify(b.domaine_shopify, clientId, clientSecret);
      const paniers = await lirePaniers(b.domaine_shopify, jeton);
      lus += paniers.length;
      const lignes = [];
      for (const p of paniers) {
        if (p.termine) { termines++; continue; }
        if (!p.email) { sansEmail++; continue; }
        lignes.push({
          boutique_id: b.id,
          shopify_checkout_id: p.id,
          email_chiffre: chiffrer(p.email),
          email_empreinte: empreinte(p.email),
          prenom_chiffre: p.prenom ? chiffrer(p.prenom) : null,
          articles: p.articles,
          montant: p.montant,
          devise: p.devise,
          lien_recuperation: p.lien,
          accepte_marketing: p.accepteMarketing,
          abandonne_le: p.maj,
        });
      }
      if (lignes.length > 0) {
        const { error } = await db.from("paniers").upsert(lignes, { onConflict: "boutique_id,shopify_checkout_id" });
        if (error) throw new Error("Enregistrement impossible");
        enregistres += lignes.length;
      }
    }
  } catch (e) {
    console.error("Synchronisation Shopify :", e instanceof Error ? e.message : "erreur inconnue");
    return retour(`erreur=shopify&detail=${encodeURIComponent(e instanceof Error ? e.message.slice(0, 120) : "inconnue")}`);
  }
  return retour(`sync=ok&lus=${lus}&enregistres=${enregistres}&sansemail=${sansEmail}&termines=${termines}`);
}
