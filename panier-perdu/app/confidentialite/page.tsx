import type { Metadata } from "next";
export const metadata: Metadata = { title: "Politique de confidentialité | Panier Perdu" };
export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 leading-relaxed [&_h2]:font-titre [&_h2]:font-extrabold [&_h2]:text-xl [&_h2]:mt-8 [&_p]:mt-2">
      <a href="/" className="underline text-sm">← Accueil</a>
      <h1 className="font-titre font-extrabold text-4xl mt-6">Politique de confidentialité</h1>
      <p className="text-sm text-gris">Texte de départ, à relire et compléter. Les passages [À COMPLÉTER] sont à remplir avant tout encaissement.</p>

      <h2>Responsable du traitement</h2>
      <p>[À COMPLÉTER : raison sociale], joignable à panier.perdu.service@gmail.com.</p>
      <h2>Données collectées</h2>
      <p>Lors du paiement, Stripe collecte ton email, ton nom et tes informations de paiement. L’éditeur reçoit ton email et ton nom pour te livrer le service et te contacter.</p>
      <h2>Finalité et durée</h2>
      <p>Ces données servent uniquement à fournir le service et à répondre à tes demandes. Elles sont conservées pendant la durée de l’abonnement, puis [À COMPLÉTER : durée, par exemple 3 ans] pour les obligations légales.</p>
      <h2>Tes droits</h2>
      <p>Tu peux demander l’accès, la rectification ou la suppression de tes données en écrivant à l’adresse ci-dessus. Tu peux aussi saisir la CNIL (cnil.fr).</p>
      <h2>Données des clients de ta boutique</h2>
      <p>Quand tu connectes ta boutique, Panier Perdu lit les paniers abandonnés de tes clients (adresse email, prénom, articles) pour envoyer les relances à ta place. Pour ces données, tu es responsable du traitement et Panier Perdu agit comme sous-traitant : les données sont chiffrées, utilisées uniquement pour envoyer les relances, et supprimées à ta demande ou à la résiliation. Les relances ne sont envoyées qu’aux clients qui ont accepté de recevoir des emails marketing, et chaque email contient un lien de désinscription.</p>
      <p>Prestataires techniques : Vercel (hébergement), Supabase (base de données, Union européenne), Stripe (paiement), Resend (envoi d’emails), Shopify (source des paniers). [À COMPLÉTER : faire relire cette section par un juriste avant les premiers clients.]</p>
      <h2>Cookies</h2>
      <p>Ce site n’utilise pas de cookie publicitaire. [À COMPLÉTER si tu ajoutes une mesure d’audience.]</p>
    </main>
  );
}
