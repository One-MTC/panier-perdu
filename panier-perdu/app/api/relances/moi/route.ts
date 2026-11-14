import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { admin } from "@/lib/supabase/admin";
import { envoyerRelancesDues } from "@/lib/relances";

export const dynamic = "force-dynamic";

// Bouton de test : envoie maintenant les relances arrivées à échéance pour l'abonné connecté.
export async function POST(request: Request) {
  const retour = (q: string) => NextResponse.redirect(new URL(`/compte?${q}`, request.url), { status: 303 });
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/connexion", request.url), { status: 303 });

  const db = admin();
  const { data: abonne } = await db.from("abonnes").select("statut").eq("id", user.id).maybeSingle();
  if (abonne?.statut !== "actif") return retour("erreur=inactif");

  try {
    const r = await envoyerRelancesDues(db, user.id);
    return retour(`relances=ok&envoyees=${r.envoyees}&ignorees=${r.ignorees}&echecs=${r.echecs}&annulees=${r.annulees}`);
  } catch (e) {
    console.error("Envoi des relances :", e instanceof Error ? e.message : "erreur inconnue");
    return retour(`erreur=envoi&detail=${encodeURIComponent(e instanceof Error ? e.message.slice(0, 120) : "inconnue")}`);
  }
}
