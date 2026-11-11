import crypto from "crypto";
import { admin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vérifie la signature Stripe : seul Stripe peut produire un appel valide.
function signatureValide(corps: string, entete: string | null, secret: string): boolean {
  if (!entete) return false;
  let horodatage = "";
  const signatures: string[] = [];
  for (const morceau of entete.split(",")) {
    const [cle, valeur] = morceau.split("=");
    if (cle === "t") horodatage = valeur;
    if (cle === "v1" && valeur) signatures.push(valeur);
  }
  if (!horodatage || signatures.length === 0) return false;
  const ecart = Math.abs(Math.floor(Date.now() / 1000) - Number(horodatage));
  if (!Number.isFinite(ecart) || ecart > 300) return false; // refuse un appel trop ancien
  const attendue = crypto.createHmac("sha256", secret).update(`${horodatage}.${corps}`).digest("hex");
  const attendueBuf = Buffer.from(attendue, "hex");
  return signatures.some((s) => {
    const buf = Buffer.from(s, "hex");
    return buf.length === attendueBuf.length && crypto.timingSafeEqual(buf, attendueBuf);
  });
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("Configuration manquante", { status: 500 });

  const corps = await request.text();
  if (!signatureValide(corps, request.headers.get("stripe-signature"), secret)) {
    return new Response("Signature invalide", { status: 400 });
  }

  let evenement: { type: string; data: { object: Record<string, any> } };
  try {
    evenement = JSON.parse(corps);
  } catch {
    return new Response("Corps invalide", { status: 400 });
  }

  const base = admin();
  const objet = evenement.data.object;

  try {
    if (evenement.type === "checkout.session.completed") {
      const paye = objet.payment_status === "paid" || objet.payment_status === "no_payment_required";
      const email = String(objet.customer_details?.email ?? objet.customer_email ?? "").trim().toLowerCase();
      if (objet.mode === "subscription" && paye && email) {
        // Crée le compte s'il n'existe pas encore (le déclencheur crée la ligne « abonnes »).
        const { error: erreurCreation } = await base.auth.admin.createUser({ email, email_confirm: true });
        if (erreurCreation && !/already|exists|registered/i.test(erreurCreation.message)) throw erreurCreation;
        const { error } = await base
          .from("abonnes")
          .update({ statut: "actif", stripe_customer_id: objet.customer ?? null, stripe_subscription_id: objet.subscription ?? null })
          .eq("email", email);
        if (error) throw error;
      }
    } else if (evenement.type === "invoice.paid" && objet.customer) {
      const { error } = await base.from("abonnes").update({ statut: "actif" }).eq("stripe_customer_id", objet.customer);
      if (error) throw error;
    } else if (evenement.type === "invoice.payment_failed" && objet.customer) {
      const { error } = await base.from("abonnes").update({ statut: "impaye" }).eq("stripe_customer_id", objet.customer);
      if (error) throw error;
    } else if (evenement.type === "customer.subscription.deleted" && objet.id) {
      const { error } = await base.from("abonnes").update({ statut: "resilie" }).eq("stripe_subscription_id", objet.id);
      if (error) throw error;
    }
  } catch {
    // Stripe réessaiera automatiquement.
    return new Response("Erreur de traitement", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
