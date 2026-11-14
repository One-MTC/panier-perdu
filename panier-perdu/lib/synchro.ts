// Lit les paniers d'une boutique, les enregistre, et planifie les deux relances.
import type { SupabaseClient } from "@supabase/supabase-js";
import { chiffrer, empreinte } from "./crypto";
import { jetonShopify, lirePaniers } from "./shopify";

const FENETRE_MS = 72 * 3600 * 1000; // on ne relance pas un panier abandonné depuis plus de 3 jours

export type Boutique = {
  id: string;
  domaine_shopify: string;
  delai_relance1_minutes: number;
  delai_relance2_heures: number;
};

export async function synchroniserBoutique(db: SupabaseClient, b: Boutique, clientId: string, clientSecret: string) {
  const jeton = await jetonShopify(b.domaine_shopify, clientId, clientSecret);
  const paniers = await lirePaniers(b.domaine_shopify, jeton);

  // Désinscriptions déjà enregistrées pour cette boutique (elles valent pour les paniers futurs).
  const { data: desinscrits } = await db.from("paniers").select("email_empreinte").eq("boutique_id", b.id).eq("desinscrit", true);
  const sortis = new Set((desinscrits ?? []).map((d: any) => d.email_empreinte));

  let sansEmail = 0, termines = 0, enregistres = 0, planifiees = 0;
  const lignes: any[] = [];
  const idsTermines: string[] = [];

  for (const p of paniers) {
    if (p.termine) { termines++; idsTermines.push(p.id); continue; }
    if (!p.email) { sansEmail++; continue; }
    const emp = empreinte(p.email);
    const ligne: any = {
      boutique_id: b.id,
      shopify_checkout_id: p.id,
      email_chiffre: chiffrer(p.email),
      email_empreinte: emp,
      prenom_chiffre: p.prenom ? chiffrer(p.prenom) : null,
      articles: p.articles,
      montant: p.montant,
      devise: p.devise,
      lien_recuperation: p.lien,
      accepte_marketing: p.accepteMarketing,
      abandonne_le: p.maj,
    };
    if (sortis.has(emp)) ligne.desinscrit = true;
    lignes.push(ligne);
  }

  if (lignes.length > 0) {
    const { data, error } = await db
      .from("paniers")
      .upsert(lignes, { onConflict: "boutique_id,shopify_checkout_id" })
      .select("id, accepte_marketing, desinscrit, abandonne_le");
    if (error) throw new Error("Enregistrement des paniers impossible");
    enregistres = data?.length ?? 0;

    const maintenant = Date.now();
    const relances: any[] = [];
    for (const p of data ?? []) {
      if (!p.accepte_marketing || p.desinscrit || !p.abandonne_le) continue;
      const debut = new Date(p.abandonne_le).getTime();
      if (maintenant - debut > FENETRE_MS) continue;
      relances.push({ panier_id: p.id, numero: 1, planifie_le: new Date(debut + b.delai_relance1_minutes * 60000).toISOString() });
      relances.push({ panier_id: p.id, numero: 2, planifie_le: new Date(debut + b.delai_relance2_heures * 3600000).toISOString() });
    }
    if (relances.length > 0) {
      // Les relances déjà planifiées ou envoyées ne sont pas touchées.
      const { error: e2 } = await db.from("relances").upsert(relances, { onConflict: "panier_id,numero", ignoreDuplicates: true });
      if (e2) throw new Error("Planification des relances impossible");
      planifiees = relances.length;
    }
  }

  // Un panier finalisé ne doit plus recevoir de relance.
  if (idsTermines.length > 0) {
    const { data: lies } = await db.from("paniers").select("id").eq("boutique_id", b.id).in("shopify_checkout_id", idsTermines);
    const ids = (lies ?? []).map((x: any) => x.id);
    if (ids.length > 0) await db.from("relances").update({ statut: "annulee" }).in("panier_id", ids).eq("statut", "planifiee");
  }

  return { lus: paniers.length, enregistres, sansEmail, termines, planifiees };
}
