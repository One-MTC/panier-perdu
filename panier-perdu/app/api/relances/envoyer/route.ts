import crypto from "crypto";
import { admin } from "@/lib/supabase/admin";
import { synchroniserBoutique } from "@/lib/synchro";
import { envoyerRelancesDues } from "@/lib/relances";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function autorise(request: Request): boolean {
  const attendu = process.env.CRON_SECRET;
  if (!attendu) return false;
  const recu = request.headers.get("authorization") ?? "";
  const a = Buffer.from(recu);
  const b = Buffer.from(`Bearer ${attendu}`);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Appelé régulièrement par un planificateur externe : lit les paniers de toutes les boutiques actives, puis envoie les relances dues.
async function traiter(request: Request) {
  if (!autorise(request)) return new Response("Non autorisé", { status: 401 });
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return new Response("Configuration manquante", { status: 500 });

  const db = admin();
  const { data: boutiques } = await db
    .from("boutiques")
    .select("id, domaine_shopify, delai_relance1_minutes, delai_relance2_heures, abonnes!inner(statut)")
    .eq("actif", true)
    .eq("abonnes.statut", "actif");

  let boutiquesLues = 0, erreursLecture = 0;
  for (const b of boutiques ?? []) {
    try {
      await synchroniserBoutique(db, b as any, clientId, clientSecret);
      boutiquesLues++;
    } catch (e) {
      erreursLecture++;
      console.error("Lecture boutique :", e instanceof Error ? e.message : "erreur inconnue");
    }
  }
  try {
    const r = await envoyerRelancesDues(db);
    return Response.json({ boutiquesLues, erreursLecture, ...r });
  } catch (e) {
    console.error("Envoi :", e instanceof Error ? e.message : "erreur inconnue");
    return new Response("Erreur d'envoi", { status: 500 });
  }
}

export async function GET(request: Request) { return traiter(request); }
export async function POST(request: Request) { return traiter(request); }
