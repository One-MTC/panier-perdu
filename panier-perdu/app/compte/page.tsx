import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { admin } from "@/lib/supabase/admin";
import { DATE_LIVRAISON, EMAIL_CONTACT, LIEN_PAIEMENT } from "../config";

export const dynamic = "force-dynamic";

const ERREURS: Record<string, string> = {
  inactif: "Ton abonnement doit être actif pour utiliser cette fonction.",
  aucune: "Aucune boutique n’est encore rattachée à ton compte.",
  config: "La connexion à Shopify n’est pas encore configurée.",
  lecture: "La lecture des paniers n’a pas abouti.",
  envoi: "L’envoi des relances n’a pas abouti.",
};

export default async function Compte({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const base = admin();
  const { data: abonne } = await base.from("abonnes").select("statut").eq("id", user.id).maybeSingle();
  const { data: boutiques } = await base.from("boutiques").select("id, domaine_shopify, actif").eq("abonne_id", user.id);

  const comptes: Record<string, number> = {};
  for (const b of boutiques ?? []) {
    const { count } = await base.from("paniers").select("id", { count: "exact", head: true }).eq("boutique_id", b.id);
    comptes[b.id] = count ?? 0;
  }

  const actif = abonne?.statut === "actif";
  const erreur = searchParams.erreur ? ERREURS[searchParams.erreur] ?? "Une erreur est survenue." : null;

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
        {searchParams.sync === "ok" && (
          <p className="mt-2 border-l-4 border-moutarde pl-3 text-sm">
            Lecture terminée : {searchParams.lus} panier(s) trouvé(s), {searchParams.enregistres} enregistré(s), {searchParams.sansemail} sans email, {searchParams.termines} finalisé(s), {searchParams.planifiees} relance(s) planifiée(s).
          </p>
        )}
        {searchParams.relances === "ok" && (
          <p className="mt-2 border-l-4 border-moutarde pl-3 text-sm">
            Envoi terminé : {searchParams.envoyees} envoyée(s), {searchParams.ignorees} en attente, {searchParams.annulees} annulée(s), {searchParams.echecs} en échec.
          </p>
        )}
        {erreur && (
          <p role="alert" className="mt-2 text-sm text-red-700">
            {erreur}{searchParams.detail ? ` (${searchParams.detail})` : ""}
          </p>
        )}
        {boutiques && boutiques.length > 0 ? (
          <>
            <ul className="mt-2 space-y-1">
              {boutiques.map((b) => (
                <li key={b.id}>{b.domaine_shopify} : {comptes[b.id]} panier(s) abandonné(s) lu(s)</li>
              ))}
            </ul>
            <form action="/api/shopify/sync" method="post" className="mt-4">
              <button type="submit" className="block w-full border-2 border-marine font-titre font-semibold px-6 py-3 min-h-[48px]">Actualiser mes paniers</button>
            </form>
            <form action="/api/relances/moi" method="post" className="mt-3">
              <button type="submit" className="block w-full border-2 border-marine font-titre font-semibold px-6 py-3 min-h-[48px]">Envoyer les relances dues (test)</button>
            </form>
            <p className="mt-2 text-xs text-gris">Les relances partiront seulement vers les clients qui ont accepté de recevoir des emails, avec un lien de désinscription.</p>
          </>
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
