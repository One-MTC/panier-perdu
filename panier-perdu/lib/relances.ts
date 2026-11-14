// Envoie les relances arrivées à échéance (via Resend).
import type { SupabaseClient } from "@supabase/supabase-js";
import { dechiffrer } from "./crypto";
import { construireEmail } from "./email";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://panier-perdu-mtc-1725.vercel.app";

export async function envoyerRelancesDues(db: SupabaseClient, abonneId?: string) {
  const cleResend = process.env.RESEND_API_KEY;
  if (!cleResend) throw new Error("RESEND_API_KEY manquante");
  const unique = process.env.RELANCES_DESTINATAIRE_UNIQUE?.trim().toLowerCase();
  const expediteur = process.env.EMAIL_EXPEDITEUR ?? "onboarding@resend.dev";

  const { data, error } = await db
    .from("relances")
    .select(
      "id, numero, paniers!inner(id, boutique_id, email_chiffre, email_empreinte, prenom_chiffre, articles, lien_recuperation, accepte_marketing, desinscrit, boutiques!inner(nom_boutique, code_reduction, actif, abonne_id, abonnes!inner(statut)))"
    )
    .eq("statut", "planifiee")
    .lte("planifie_le", new Date().toISOString())
    .order("planifie_le")
    .limit(100);
  if (error) throw new Error("Lecture des relances impossible");

  let envoyees = 0, ignorees = 0, echecs = 0, annulees = 0;
  for (const r of (data ?? []) as any[]) {
    const p = r.paniers;
    const b = p.boutiques;
    if (abonneId && b.abonne_id !== abonneId) continue;
    if (!b.actif || b.abonnes.statut !== "actif") { ignorees++; continue; }
    if (p.desinscrit || !p.accepte_marketing) {
      await db.from("relances").update({ statut: "annulee" }).eq("id", r.id);
      annulees++;
      continue;
    }

    let email: string;
    let prenom: string | null = null;
    try {
      email = dechiffrer(p.email_chiffre);
      prenom = p.prenom_chiffre ? dechiffrer(p.prenom_chiffre) : null;
    } catch {
      await db.from("relances").update({ statut: "echec", erreur: "Données illisibles" }).eq("id", r.id);
      echecs++;
      continue;
    }

    // Garde-fou de test : tant que cette variable existe, on n'écrit à personne d'autre.
    if (unique && email.toLowerCase() !== unique) { ignorees++; continue; }

    const nom = (b.nom_boutique ?? "Ta boutique").replace(/[<>"]/g, "");
    const contenu = construireEmail({
      numero: r.numero === 2 ? 2 : 1,
      prenom,
      boutique: nom,
      articles: p.articles ?? [],
      lien: p.lien_recuperation ?? "",
      code: r.numero === 2 ? b.code_reduction : null,
      desinscription: `${SITE}/desinscription?b=${p.boutique_id}&h=${p.email_empreinte}`,
    });

    const rep = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cleResend}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${nom} <${expediteur}>`,
        to: [email],
        subject: contenu.sujet,
        html: contenu.html,
        text: contenu.texte,
        headers: { "List-Unsubscribe": `<${SITE}/desinscription?b=${p.boutique_id}&h=${p.email_empreinte}>` },
      }),
    });

    if (rep.ok) {
      await db.from("relances").update({ statut: "envoyee", envoye_le: new Date().toISOString() }).eq("id", r.id);
      envoyees++;
    } else {
      await db.from("relances").update({ statut: "echec", erreur: `Resend ${rep.status}` }).eq("id", r.id);
      echecs++;
    }
  }
  return { envoyees, ignorees, echecs, annulees };
}
