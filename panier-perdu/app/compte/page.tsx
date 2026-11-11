import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { admin } from "@/lib/supabase/admin";
import { DATE_LIVRAISON, EMAIL_CONTACT, LIEN_PAIEMENT } from "../config";

export const dynamic = "force-dynamic";

export default async function Compte() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const base = admin();
  const { data: abonne } = await base.from("abonnes").select("statut").eq("id", user.id).maybeSingle();
  const { data: boutiques } = await base.from("boutiques").select("id, domaine_shopify, actif").eq("abonne_id", user.id);

  const actif = abonne?.statut === "actif";

  return (
    <main className="mx-auto max-w-xl px-5 pt-10 pb-16">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-titre font-semibold text-lg">Panier Perdu</Link>
        <form action="/deconnexion" method="post">
          <button type="submit" className="underline text-sm text-gris min-h-[44px] px-2">Se déconnecter</button>
        </form>
      </div>

      <h1 className="font-titre font-extrabold text-3xl leading-tight mt-8">Ton compte</h1>
      <p className="mt-1 text-gris">{user.email}</p>

      <section className="mt-8 border-2 border-marine p-5">
        <p className="font-titre font-semibold text-lg">Abonnement</p>
        {actif ? (
          <p className="mt-1">Actif : 29 € par mois, sans engagement. Merci d’être là dès le début.</p>
        ) : (
          <>
            <p className="mt-1">Nous n’avons pas encore reçu ton paiement pour cette adresse email.</p>
            <p className="mt-2 text-sm text-gris">Si tu viens de payer, patiente quelques minutes. Sinon, écris à {EMAIL_CONTACT}.</p>
            {LIEN_PAIEMENT.startsWith("https://") && (
              <a href={LIEN_PAIEMENT} className="mt-4 block text-center bg-moutarde text-marine font-titre font-extrabold px-6 py-4 min-h-[56px]">Réserver mon accès</a>
            )}
          </>
        )}
      </section>

      <section className="mt-6 border-2 border-marine p-5">
        <p className="font-titre font-semibold text-lg">Ta boutique</p>
        {boutiques && boutiques.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {boutiques.map((b) => (
              <li key={b.id}>{b.domaine_shopify} : {b.actif ? "relances actives" : "en attente d’activation"}</li>
            ))}
          </ul>
        ) : (
          <>
            <p className="mt-1">Aucune boutique connectée pour l’instant.</p>
            <p className="mt-2 text-sm text-gris leading-relaxed">La connexion à ta boutique arrive. Je t’écris dès qu’elle est prête, au plus tard le {DATE_LIVRAISON}. Rien d’autre à faire pour le moment.</p>
          </>
        )}
      </section>
    </main>
  );
}
